const { test, chromium } = require('@playwright/test');
const { PnrStatusCheck } = require('../pages/pnrStatusCheck');
require('dotenv').config();

test('PNR Status Check', async ({ page }) => {
  await page.goto(`https://www.confirmtkt.com/pnr-status/${process.env.PNR}`,
    { waitUntil: 'domcontentloaded' });
  const pnrStatusCheck = new PnrStatusCheck(page);
  await pnrStatusCheck.getCurrentWaitingNumbers();
  if (!process.env.CI) {
    await page.pause();
  }
});