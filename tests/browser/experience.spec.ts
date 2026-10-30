import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("memory explorer preserves historical recall and exposes every memory type", async ({
  page,
}) => {
  await page.goto("/platform");
  const explorer = page.locator(".memory-explorer");
  await expect(
    explorer.getByText("Through the v2 payments API."),
  ).toBeVisible();
  await explorer.getByRole("button", { name: "As of Jan 2, 2026" }).click();
  await expect(
    explorer.getByText("Through the v1 refunds endpoint."),
  ).toBeVisible();
  await explorer.getByRole("button", { name: /Knowledge graph/ }).click();
  await expect(explorer.getByRole("img")).toHaveAccessibleName(
    /Project Alpha uses the payments service/,
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(explorer.getByRole("img")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(
    (await new AxeBuilder({ page }).include(".memory-explorer").analyze())
      .violations,
  ).toEqual([]);
  await page.setViewportSize({ width: 1440, height: 1000 });
  for (const name of [
    "Lessons",
    "Conversations",
    "Core blocks",
    "Procedures",
  ]) {
    await explorer.getByRole("button", { name: new RegExp(name) }).click();
    expect(
      (await new AxeBuilder({ page }).include(".memory-explorer").analyze())
        .violations,
    ).toEqual([]);
  }
  await explorer.getByRole("button", { name: /Facts/ }).click();
  await expect(
    explorer.getByText("Through the v1 refunds endpoint."),
  ).toBeVisible();
});

test("benchmark explorer separates retrieval scores from context cost", async ({
  page,
}) => {
  await page.goto("/benchmarks");
  const explorer = page.locator(".benchmark-explorer");
  await expect(explorer.getByRole("heading", { level: 2 })).toHaveText(
    "82.3% → 95.0%",
  );
  await explorer.getByRole("button", { name: /LongMemEval-S/ }).click();
  await expect(explorer.getByRole("heading", { level: 2 })).toHaveText(
    "82.0% → 94.9%",
  );
  await expect(explorer.getByText(/150 questions · stratified/)).toBeVisible();
  await expect(explorer.locator("figcaption")).toContainText("1,468 → 8,838");
  await explorer.getByRole("button", { name: /BEAM 100K/ }).click();
  await expect(explorer.getByRole("heading", { level: 2 })).toHaveText(
    "72.4% → 85.9%",
  );
  await expect(explorer.locator("figcaption")).toContainText(
    "not answer accuracy",
  );
  expect(
    (await new AxeBuilder({ page }).include(".benchmark-explorer").analyze())
      .violations,
  ).toEqual([]);
});

test("search supports keyboard navigation, no-result recovery, and focus return", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Search UniMem" }).click();
  const dialog = page.getByRole("dialog");
  const input = dialog.getByRole("searchbox");
  await expect(input).toBeFocused();
  expect(
    (await new AxeBuilder({ page }).include(".search-dialog").analyze())
      .violations,
  ).toEqual([]);
  await input.fill("zznomatchxyz");
  await expect(dialog.getByText("No pages found.")).toBeVisible();
  await input.fill("benchmarks");
  await input.press("ArrowDown");
  await expect(dialog.locator(".search-result").first()).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Search UniMem" }),
  ).toBeFocused();
  await page.keyboard.press("Control+k");
  await expect(dialog).toBeVisible();
  await input.fill("quickstart");
  await dialog.getByRole("link", { name: /Developers · quickstart/ }).click();
  await expect(page).toHaveURL(/\/developers$/);
  await expect(dialog).not.toBeVisible();
});

test("quickstart switches OS and client commands, copying the real source path", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/developers#start");
  const workbench = page.locator(".quickstart-workbench");
  await workbench.getByRole("button", { name: "Windows", exact: true }).click();
  await expect(workbench.locator("pre").first()).toContainText(
    ".\\.venv\\Scripts\\Activate.ps1",
  );
  await workbench
    .getByRole("button", { name: "Claude Code", exact: true })
    .click();
  await expect(workbench.locator("pre").last()).toContainText(
    "--target claude-code",
  );
  await workbench
    .getByRole("button", { name: "Copy PowerShell / install", exact: true })
    .click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    "https://github.com/varma61923/unimem.git",
  );
  await workbench
    .getByRole("button", { name: "macOS / Linux", exact: true })
    .click();
  await expect(workbench.locator("pre").first()).toContainText(
    "python3 -m venv",
  );
  expect(
    (await new AxeBuilder({ page }).include(".quickstart-workbench").analyze())
      .violations,
  ).toEqual([]);
});
