const { test } = require('@playwright/test');
const { SearchTrainPage } = require('../pages/searchTrain.js');
const { formatNotification } = require('../utils/formatter.js');
const { notify } = require('../utils/notifiy.js');
const { getAlerts } = require("../api/api.js");

test('Search train', async ({ page }) => {
  await page.goto('https://www.railyatri.in/');

  const searchPage = new SearchTrainPage(page);
  const alerts = await getAlerts();

  for (const alert of alerts) {

    await searchPage.searchTrain(
      alert.fromStation,
      alert.toStation,
      alert.journeyDate
    );

    const result = await searchPage.getTrainDetails(
      alert.trainNumber,
      alert.coachType
    );
    const message = formatNotification(result);
    await notify(message, result);

  }
  await page.pause();
});