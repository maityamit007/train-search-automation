const { test, chromium } = require('@playwright/test');
const { PnrStatusCheck } = require('../pages/pnrStatusCheck');
require('dotenv').config();

test('PNR Status Check', async () => {
  
  const browser = await chromium.launch({ headless: false, slowMo: 100 });
  const page = await browser.newPage();
  await page.goto(`https://www.confirmtkt.com/pnr-status/${process.env.PNR}`, {
    waitUntil: 'domcontentloaded'
  });
  const pnrStatusCheck = new PnrStatusCheck(page);
  await pnrStatusCheck.getCurrentWaitingNumbers();
  await page.pause(); 
  await browser.close();
});