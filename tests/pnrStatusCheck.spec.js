const { test } = require('@playwright/test');

const { PnrStatusCheck } = require('../pages/pnrStatusCheck');
const { sendNtfy } = require('../api/api');

require('dotenv').config();

test('PNR Status Check', async ({ page }) => {

    await page.goto(
        `https://www.confirmtkt.com/pnr-status/${process.env.PNR}`,
        {
            waitUntil: 'domcontentloaded'
        }
    );

    const pnrStatusCheck = new PnrStatusCheck(page);

    const passengers = await pnrStatusCheck.getCurrentStatus();

    console.log('Final passenger data:', passengers);

    const statusMessage = passengers
        .map(({ passenger, status }) => {
            return `${passenger}: ${status}`;
        })
        .join('\n');

    const message = [
        `PNR Status`,
        ``,
        `PNR: ${process.env.PNR}`,
        ``,
        statusMessage,
        ``,
        `Checked automatically by GitHub Actions`
    ].join('\n');

    console.log('\n' + message);

    await sendNtfy(
        'Train PNR Update',
        message
    );

    if (!process.env.CI) {
        await page.pause();
    }
});