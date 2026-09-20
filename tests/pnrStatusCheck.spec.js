const { test } = require('@playwright/test');

const { PnrStatusCheck } = require('../pages/pnrStatusCheck');
const { sendNtfy } = require('../api/api');
const { getConfirmationChance, createBattery } = require('../utils/utils');

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

    const passengerMessages = passengers.map(
        ({ passenger, status, type, number }) => {

            const chance = getConfirmationChance(type, number);
            const battery = createBattery(chance);

            return [
                `${passenger}: ${status}`,
                `${battery}`
            ].join('\n');
        }
    );

    const message = [
        `PNR: ${process.env.PNR}`,
        ...passengerMessages,
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