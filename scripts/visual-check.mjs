import { chromium } from "playwright-core";

const browser = await chromium.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: true,
});

const errors = [];
for (const target of [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 },
]) {
  const page = await browser.newPage({ viewport: { width: target.width, height: target.height }, deviceScaleFactor: 1 });
  page.on("console", (message) => { if (message.type() === "error") errors.push(`${target.name}: ${message.text()}`); });
  page.on("pageerror", (error) => errors.push(`${target.name}: ${error.message}`));
  await page.goto("http://127.0.0.1:3000", { waitUntil: "networkidle" });
  await page.screenshot({ path: `visual-${target.name}.png`, fullPage: true });
  if (target.name === "mobile") {
    await page.getByRole("button", { name: "叉腰" }).click();
    await page.getByRole("button", { name: /3D 轮廓/ }).click();
    await page.waitForTimeout(1200);
    await page.getByRole("button", { name: /2D 效果/ }).click();
    await page.getByRole("button", { name: /生成高清试穿图/ }).click();
    await page.waitForTimeout(4500);
    await page.screenshot({ path: "visual-mobile-generated.png", fullPage: true });
  }
  await page.close();
}

await browser.close();
console.log(JSON.stringify({ errors }, null, 2));
