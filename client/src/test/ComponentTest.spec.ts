import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  const { chromium } = require("playwright");

  (async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    // Proceed with the steps below
  })();
  await page.goto("http://localhost:3000/radreciperecommender#/");

  await page.getByLabel("Email or phone").fill("ohh.louise.weng@gmail.com");
  await page.getByRole("button", { name: "Next" }).click();
  //await page.getByLabel('input[type="password"]', process.env.GOOGLE_PASSWORD);
  await page.click('button[type="submit"]');
});

test("test login", async ({ page }) => {
  await page.goto("http://localhost:3000/radreciperecommender#/login");
  await expect (page.getByText("RAD RECIPE RECOMMENDER").click());
  const page1Promise = page.waitForEvent("popup");
  await expect(page.getByRole("button", { name: "Sign in with Google" }).click());
  const page1 = await page1Promise;
  await expect(page1.getByLabel("Email or phone").fill("ohh.louise.weng@gmail.com"));
  await page1.getByRole("button", { name: "Next" }).click();
  await page1.getByLabel("Try again").click();
});