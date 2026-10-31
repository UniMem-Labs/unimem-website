"""Check rendered text containment on every route, including internal columns.

Run against a production server. Screenshots and findings are development
artifacts; intentional code/table scroll regions are reported separately.
"""
import argparse
import concurrent.futures
import json
import os
from pathlib import Path
import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET

from playwright.sync_api import sync_playwright

MEASURE = r"""() => {
  const findings = [], scrolling = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const el = node.parentElement;
    if (!node.textContent.trim() || !(el instanceof HTMLElement) ||
        el.closest('script,style,.sr-only,.skip-link,.honeypot,[hidden]')) continue;
    let box = el;
    while (box && getComputedStyle(box).display === 'inline') box = box.parentElement;
    if (!box || !box.getClientRects().length) continue;
    const style = getComputedStyle(box);
    if (style.visibility !== 'visible' || style.display === 'none') continue;
    const bounds = box.getBoundingClientRect();
    if (!bounds.width || !bounds.height) continue;
    const range = document.createRange(); range.selectNodeContents(node);
    // A font's line box can extend beyond its CSS line-height without clipping.
    // Only treat vertical overhang as an error at an actual clipping boundary.
    let clip = box;
    while (clip && !['hidden','clip'].includes(getComputedStyle(clip).overflowY)) clip = clip.parentElement;
    const clipBounds = clip?.getBoundingClientRect();
    for (const r of range.getClientRects()) {
      if (!r.width || !r.height) continue;
      const clippedY = clipBounds && (r.top < clipBounds.top - 3 || r.bottom > clipBounds.bottom + 3);
      if (r.left < bounds.left - 2 || r.right > bounds.right + 2 || clippedY) {
        const finding = {element: box.tagName.toLowerCase() +
          (box.className ? '.' + String(box.className).trim().replace(/\s+/g,'.') : ''),
          text: node.textContent.trim().slice(0,120),
          excessX: Math.round(Math.max(bounds.left-r.left,r.right-bounds.right,0)),
          excessY: clippedY ? Math.round(Math.max(clipBounds.top-r.top,r.bottom-clipBounds.bottom,0)) : 0};
        if (el.closest('pre,.data-table-wrap')) scrolling.push(finding);
        else findings.push(finding);
        break;
      }
    }
  }
  return {findings, intentionalScrolling: scrolling.length,
    documentOverflow: document.documentElement.scrollWidth > innerWidth + 1,
    brokenImages: [...document.images].filter(i => i.complete && !i.naturalWidth).map(i => i.src)};
}"""


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base-url", default="http://127.0.0.1:3100")
    parser.add_argument("--routes", help="Optional JSON route list; otherwise use the site's sitemap")
    parser.add_argument("--output", default="artifacts/layout-audit")
    parser.add_argument("--widths", default="320,360,390,430,600,768,900,901,1024,1130,1280,1440,1536,1920")
    args = parser.parse_args()
    if args.routes:
        routes = json.loads(Path(args.routes).read_text())
    else:
        with urllib.request.urlopen(args.base_url + "/sitemap.xml", timeout=15) as response:
            sitemap = ET.fromstring(response.read())
        routes = list(dict.fromkeys(urllib.parse.urlparse(loc.text).path or "/" for loc in sitemap.findall(".//{*}loc")))
    output = Path(args.output)
    output.mkdir(parents=True, exist_ok=True)

    def review(width):
        results = []
        with sync_playwright() as p:
            browser = p.chromium.launch(executable_path=os.environ.get("CHROME_PATH", "/usr/bin/chromium"), headless=True, args=["--no-sandbox"])
            try:
                page = browser.new_page(viewport={"width": width, "height": 1000}, reduced_motion="reduce")
                for route in routes:
                    response = page.goto(args.base_url + route, wait_until="networkidle")
                    page.evaluate("document.fonts.ready")
                    result = {"route": route, "width": width, "status": response.status, **page.evaluate(MEASURE)}
                    name = route.strip("/").replace("/", "-") or "home"
                    if width in (390, 1440):
                        page.screenshot(path=str(output / f"{name}-{width}.png"), full_page=True)
                    if route == "/" and width in (901, 1280, 1440):
                        page.locator(".proof-band").screenshot(path=str(output / f"evidence-{width}.png"), style=".header { visibility: hidden !important; }")
                    results.append(result)
                if width in (320, 768, 1280):
                    def check_state(route, state):
                        results.append({"route": route, "width": width, "state": state, "status": 200, **page.evaluate(MEASURE)})
                    page.goto(args.base_url, wait_until="networkidle")
                    for i in range(5):
                        page.locator(".lab-stages button").nth(i).click()
                        check_state("/", f"memory-loop-{i}")
                    for i in range(6):
                        page.locator(".explorer-menu button").nth(i).click()
                        check_state("/", f"memory-type-{i}")
                    page.goto(args.base_url + "/benchmarks", wait_until="networkidle")
                    for i in range(3):
                        page.locator(".benchmark-tabs button").nth(i).click()
                        check_state("/benchmarks", f"dataset-{i}")
                    page.goto(args.base_url + "/developers", wait_until="networkidle")
                    for name in ("Windows", "macOS / Linux", "Codex", "Claude Code", "Cursor", "Windsurf", "MCP client"):
                        page.locator(".quickstart-workbench").get_by_role("button", name=name, exact=True).click()
                        check_state("/developers", name)
                    page.keyboard.press("Control+k")
                    page.get_by_role("searchbox").fill("a very long search query with no matching pages")
                    check_state("/developers", "search-empty-state")
                    page.keyboard.press("Escape")
                    page.goto(args.base_url + "/contact", wait_until="networkidle")
                    page.get_by_role("button", name="Prepare your email").click()
                    check_state("/contact", "validation-errors")
            finally:
                browser.close()
        return results

    results = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        for batch in pool.map(review, [int(w) for w in args.widths.split(",")]):
            results.extend(batch)
    report = {"baseUrl": args.base_url, "routes": len(routes), "combinations": len(results), "results": results}
    (output / "report.json").write_text(json.dumps(report, indent=2) + "\n")
    affected = [r for r in results if r["findings"] or r["documentOverflow"] or r["brokenImages"] or r["status"] != 200]
    print(json.dumps({"combinations": len(results), "affected": len(affected), "findings": affected}, indent=2))
    if affected:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
