// @ts-check
import { test, expect } from '@playwright/test';

test.describe('WSL2 Playwright Browser Verification', () => {
  test('launches Chromium, loads local page, verifies title and automation', async ({ page }) => {
    // 1. Open a self-contained local test page
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <title>Blinkit Playwright Verification</title>
        </head>
        <body>
          <h1 id="header">Playwright Local Test</h1>
          <button id="test-btn" onclick="document.getElementById('result').textContent = 'Automation Active';">Trigger Action</button>
          <span id="result">Initial State</span>
        </body>
      </html>
    `;

    await page.setContent(htmlContent);

    // 2. Verify the page title
    await expect(page).toHaveTitle('Blinkit Playwright Verification');

    // 3. Verify initial text
    await expect(page.locator('#result')).toHaveText('Initial State');

    // 4. Verify browser automation interaction
    await page.locator('#test-btn').click();
    await expect(page.locator('#result')).toHaveText('Automation Active');

    // 5. Close browser is handled cleanly by fixture tear-down
  });
});

