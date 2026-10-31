"""Screenshot and interaction review using Anthropic's webapp-testing workflow.

Run through the installed with_server.py helper, or pass --base-url for an
already running local server. This never sends an inquiry or opens a mail app.
"""

import argparse
import json
import os
import re
import shutil
from pathlib import Path

from playwright.sync_api import expect, sync_playwright


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base-url", default="http://127.0.0.1:3100")
    parser.add_argument("--output-dir", default="artifacts/skill-review")
    parser.add_argument("--chromium", default=os.environ.get("CHROME_PATH"))
    args = parser.parse_args()
    output = Path(args.output_dir)
    output.mkdir(parents=True, exist_ok=True)
    report = {"base_url": args.base_url, "viewports": [], "checks": [], "errors": [], "ok": False}
    executable = args.chromium or shutil.which("chromium")

    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path=executable, headless=True, args=["--no-sandbox"]
        )
        try:
            for width in (1440, 768, 390, 320):
                context = browser.new_context(
                    viewport={"width": width, "height": 1000},
                    reduced_motion="reduce",
                )
                page = context.new_page()
                page.on("pageerror", lambda error: report["errors"].append(str(error)))
                response = page.goto(args.base_url, wait_until="networkidle")
                assert response.status == 200
                # Discover the rendered controls before taking any action.
                controls = page.get_by_role("button").all_text_contents()
                assert any("Recall" in label for label in controls)
                assert page.locator("h1").count() == 1
                assert page.evaluate("document.documentElement.scrollWidth <= innerWidth")
                page.screenshot(path=str(output / f"hero-{width}.png"))
                if width in (390, 1440):
                    page.screenshot(path=str(output / f"home-{width}.png"), full_page=True)

                page.get_by_role("button", name="Govern", exact=False).click()
                expect(page.get_by_text("WITHDRAWN", exact=True)).to_be_visible()
                explorer = page.locator(".memory-explorer")
                explorer.get_by_role("button", name="As of Jan 2, 2026").click()
                expect(explorer).to_contain_text("v1 refunds endpoint")
                explorer.get_by_role("button", name=re.compile("Knowledge graph")).click()
                expect(explorer.get_by_role("img")).to_be_visible()
                if width in (390, 1440):
                    explorer.screenshot(path=str(output / f"memory-{width}.png"), style=".header { visibility: hidden !important; }")

                page.goto(args.base_url + "/developers", wait_until="networkidle")
                workbench = page.locator(".quickstart-workbench")
                workbench.get_by_role("button", name="Windows", exact=True).click()
                assert "Activate.ps1" in workbench.locator("pre").first.inner_text()
                workbench.get_by_role("button", name="Claude Code", exact=True).click()
                assert "--target claude-code" in workbench.locator("pre").last.inner_text()
                assert page.evaluate("document.documentElement.scrollWidth <= innerWidth")
                if width in (390, 1440):
                    page.screenshot(path=str(output / f"developers-{width}.png"))

                page.keyboard.press("Control+k")
                dialog = page.get_by_role("dialog")
                expect(dialog).to_be_visible()
                dialog.get_by_role("searchbox").fill("benchmarks")
                assert dialog.locator(".search-result").count() > 0
                page.keyboard.press("Escape")
                expect(dialog).not_to_be_visible()

                page.goto(args.base_url + "/benchmarks", wait_until="networkidle")
                page.get_by_role("button", name="BEAM 100K", exact=True).click()
                assert "85.9%" in page.locator("#benchmark-title").inner_text()
                assert "not answer accuracy" in page.locator("figcaption").first.inner_text()
                assert page.evaluate("document.documentElement.scrollWidth <= innerWidth")
                if width in (390, 1440):
                    page.locator(".benchmark-explorer").screenshot(
                        path=str(output / f"benchmarks-{width}.png"), style=".header { visibility: hidden !important; }"
                    )
                report["viewports"].append(width)
                context.close()

            context = browser.new_context(viewport={"width": 390, "height": 900})
            page = context.new_page()
            page.goto(args.base_url + "/contact", wait_until="networkidle")
            submissions = []
            page.on("request", lambda req: submissions.append(req.url)
                    if "/api/contact" in req.url else None)
            values = {
                "name": "Browser review",
                "email": "review@example.com",
                "company": "Local QA",
                "workflow": "A developer evaluating agent memory",
                "problem": "Review the note before deciding whether to send it",
            }
            for field, value in values.items():
                page.locator("#" + field).fill(value)
            page.wait_for_timeout(2100)
            page.get_by_role("button", name="Prepare your email").click()
            mail_link = page.get_by_role("link", name="Open email app")
            assert mail_link.get_attribute("href").startswith("mailto:")
            assert submissions == []
            context.close()
            report["checks"] = [
                "memory lifecycle", "historical fact recall", "mobile graph",
                "OS and client instructions", "keyboard search", "benchmark scope",
                "contact draft without submission", "horizontal layout",
            ]
            assert not report["errors"], report["errors"]
            report["ok"] = True
        except Exception as error:
            report["failure"] = str(error)
            raise
        finally:
            browser.close()
            (output / "review.json").write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
