import { SITE } from "../../src/lib/site";
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { pages } from "../../src/lib/content";
const paths = ["/", "/learn", "/contact", ...pages.map((p) => p.path)];
for (const path of paths) {
  test(`metadata, content, links and accessibility: ${path}`, async ({
    page,
    request,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page).toHaveTitle(/UniMem/);
    expect(
      await page.locator('meta[name="description"]').getAttribute("content"),
    ).toBeTruthy();
    const canonical = await page
      .locator('link[rel="canonical"]')
      .getAttribute("href");
    expect(new URL(canonical!).href).toBe(new URL(path, SITE).href);
    expect(
      await page.locator('meta[property="og:image"]').getAttribute("content"),
    ).toContain("/opengraph-image");
    expect(
      await page.locator('meta[name="twitter:card"]').getAttribute("content"),
    ).toBe("summary_large_image");
    for (const json of await page
      .locator('script[type="application/ld+json"]')
      .allTextContents())
      expect(() => JSON.parse(json)).not.toThrow();
    const links = await page
      .locator("main a")
      .evaluateAll((els) =>
        els
          .map((e) => e.getAttribute("href") || "")
          .filter((h) => h.startsWith("/") || h.startsWith("#")),
      );
    for (const href of new Set(links)) {
      if (href.startsWith("#"))
        expect(await page.locator(`[id="${href.slice(1)}"]`).count()).toBe(1);
      else expect((await request.get(href)).status(), href).toBe(200);
    }
    expect(
      (
        await new AxeBuilder({ page })
          .withTags([
            "wcag2a",
            "wcag2aa",
            "wcag21a",
            "wcag21aa",
            "wcag22aa",
            "best-practice",
          ])
          .analyze()
      ).violations,
    ).toEqual([]);
    expect(errors).toEqual([]);
  });
}
for (const width of [320, 375, 430, 768, 1024, 1440, 1920]) {
  test(`responsive layout at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 950 });
    for (const path of ["/", "/developers", "/contact"]) {
      await page.goto(path);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        path,
      ).toBe(true);
      await expect(page.locator("h1")).toBeVisible();
    }
    await page.goto("/");
    await page.screenshot({
      path: `test-results/home-${width}.png`,
      fullPage: true,
    });
  });
}
test("mobile navigation, demo, code switcher, copy, keyboard and reduced motion", async ({
  page,
  context,
}) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Menu: open navigation" }).click();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeVisible();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "Developers" })
    .click();
  await expect(page).toHaveURL(/developers/);
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toHaveCount(0);
  await page.goto("/");
  for (const stage of ["Withhold", "Observe", "Evaluate", "Govern"])
    await page.getByRole("button", { name: new RegExp(stage) }).click();
  await expect(page.getByText("WITHDRAWN", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Python", exact: true }).click();
  await expect(page.locator(".code-example pre")).toContainText("CausalMemory");
  await page.getByRole("button", { name: "Copy Python / integration" }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    "CausalMemory",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
});
test("contact draft validates, preserves input, and requires explicit sending", async ({
  page,
}) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: "Prepare your email" }).click();
  await expect(page.locator("#name")).toBeFocused();
  await expect(page.getByText("This field is required.")).toHaveCount(5);
  await page.locator("#name").fill("Test User");
  await page.locator("#email").fill("test@example.com");
  await page.locator("#company").fill("Example");
  await page.locator("#workflow").fill("A test coding agent");
  await page.locator("#problem").fill("Repeated decisions");
  await page.waitForTimeout(2100);
  const submissions: string[] = [];
  page.on("request", (r) => {
    if (r.url().includes("/api/contact")) submissions.push(r.url());
  });
  await page.getByRole("button", { name: "Prepare your email" }).click();
  const email = page.getByRole("link", { name: "Open email app" });
  await expect(email).toBeVisible();
  const href = await email.getAttribute("href");
  expect(href).toContain("mailto:Pavan.Mudunuri@unimem.org");
  expect(decodeURIComponent(href!)).toContain("Repeated decisions");
  expect(submissions).toEqual([]);
  await expect(page.locator("#email")).toHaveValue("test@example.com");
  await expect(
    page.getByRole("button", { name: "Prepare your email" }),
  ).toBeEnabled();
});
test("robots, sitemap, share image, manifest, security headers and 404", async ({
  request,
}) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(await sitemap.text()).toContain(`${SITE}/product`);
  expect((await request.get("/robots.txt")).status()).toBe(200);
  const image = await request.get("/opengraph-image");
  expect(image.headers()["content-type"]).toContain("image/png");
  const manifest = await request.get("/manifest.webmanifest");
  expect(manifest.status()).toBe(200);
  for (const icon of (await manifest.json()).icons) {
    const resource = await request.get(icon.src);
    expect(resource.status(), icon.src).toBe(200);
    expect(resource.headers()["content-type"], icon.src).toContain(icon.type);
  }
  expect((await request.get("/missing-page")).status()).toBe(404);
  const home = await request.get("/");
  expect(home.headers()["x-frame-options"]).toBe("DENY");
  expect(home.headers()["x-content-type-options"]).toBe("nosniff");
  expect(home.headers()["cross-origin-opener-policy"]).toBe("same-origin");
  expect(home.headers()["content-security-policy"]).toContain(
    "frame-ancestors 'none'",
  );
  const securityTxt = await request.get("/.well-known/security.txt");
  expect(securityTxt.status()).toBe(200);
  const policy = await securityTxt.text();
  expect(policy).toContain("Contact: mailto:");
  const expires = /Expires: (\S+)/.exec(policy)?.[1];
  expect(Date.parse(expires!)).toBeGreaterThan(Date.now());
});

test("mobile menu dismisses with Escape, restores focus, and closes outside", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Menu: open navigation" });
  await toggle.click();
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toHaveCount(0);
  await toggle.click();
  await page.mouse.click(10, 700);
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toHaveCount(0);
});

test("article outline expands on mobile and tracks the current section on desktop", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto("/learn/evaluating-agent-memory");
  await expect(page.locator(".article-meta")).toContainText("min read");
  await expect(page.locator(".page-hero .hero-actions")).toHaveCount(0);
  await page.locator(".toc-mobile summary").click();
  await page
    .getByRole("navigation", { name: "Article sections" })
    .getByRole("link", { name: "Missing outcomes are part of the experiment." })
    .click();
  await expect(page).toHaveURL(/#outcomes$/);
  await expect(page.locator(".toc-mobile")).not.toHaveAttribute("open");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page
    .getByRole("navigation", { name: "On this page" })
    .getByRole("link", { name: "Read uncertainty as part of the result." })
    .click();
  await expect(
    page.locator('.toc-desktop a[aria-current="location"]'),
  ).toHaveAttribute("href", "#interpret");
});

test("copy failure selects the code, and changing examples clears stale feedback", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() =>
    Object.defineProperty(navigator.clipboard, "writeText", {
      configurable: true,
      value: () => Promise.reject(new Error("denied")),
    }),
  );
  await page
    .getByRole("button", { name: "Copy terminal / local-first" })
    .click();
  await expect(
    page.getByRole("button", { name: "Text selected terminal / local-first" }),
  ).toBeVisible();
  expect(await page.evaluate(() => getSelection()?.toString())).toContain(
    "unimem init",
  );
  await page.getByRole("button", { name: "Python", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Copy Python / integration" }),
  ).toBeVisible();
});

test("contact field errors clear as corrected, optional message stays available", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto("/contact");
  const formTop = (await page.locator(".contact-form").boundingBox())!.y;
  const explanationTop = (await page.locator(".contact-aside").boundingBox())!
    .y;
  expect(formTop).toBeLessThan(explanationTop);
  await page.locator("#email").fill("wrong");
  await page.locator("#company").click();
  await expect(page.locator("#email-error")).toContainText("valid email");
  await page.locator("#email").fill("test@example.com");
  await expect(page.locator("#email-error")).toHaveCount(0);
  await expect(page.locator("#message")).not.toBeVisible();
  await page.locator(".form-optional summary").click();
  await page.locator("#message").fill("An optional note.");
  expect(
    await page
      .locator("#email")
      .evaluate((el) => parseFloat(getComputedStyle(el).fontSize)),
  ).toBeGreaterThanOrEqual(16);
});

test("all memory stages remain accessible without moving surrounding content", async ({
  page,
}) => {
  await page.goto("/");
  const initialTop = (await page.locator(".integration-band").boundingBox())!.y;
  for (const stage of ["Withhold", "Observe", "Evaluate", "Govern"]) {
    await page.getByRole("button", { name: new RegExp(stage) }).click();
    expect((await page.locator(".integration-band").boundingBox())!.y).toBe(
      initialTop,
    );
    expect(
      (
        await new AxeBuilder({ page })
          .include(".memory-lab")
          .withTags([
            "wcag2a",
            "wcag2aa",
            "wcag21a",
            "wcag21aa",
            "wcag22aa",
            "best-practice",
          ])
          .analyze()
      ).violations,
    ).toEqual([]);
  }
});

for (const width of [320, 768]) {
  test(`all content routes fit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 950 });
    for (const path of paths) {
      await page.goto(path);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        path,
      ).toBe(true);
    }
    await page.goto("/");
    const geometry = await page.locator("h1").evaluate((el) => ({
      height: el.getBoundingClientRect().height,
      line: parseFloat(getComputedStyle(el).lineHeight),
    }));
    expect(geometry.height).toBeLessThanOrEqual(geometry.line * 3 + 2);
  });
}
