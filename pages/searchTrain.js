const { reservationCheck } = require('../utils/utils');

class SearchTrainPage {
    constructor(page) {
        this.page = page;

        this.fromInput = page.locator('#TrainFromSourceField');
        this.toInput = page.locator('#toSourceField');
        this.dateInput = page.locator('#trainDatepicker');
        this.monthLabel = page.locator('[id$="grid-label"]');
        this.nextMonthButton = page.getByRole('button', { name: 'Next month' });
        this.searchButton = page.getByRole('button', { name: 'Search train' });
    }

    async searchTrain(from, to, date) {
        await this.fromInput.fill(from);
        await this.toInput.fill(to);
        await this.dateInput.evaluate(el => el.click());
        const targetDate = new Date(date);

        const targetMonth = targetDate.toLocaleString('en-US', {
            month: 'long'
        });

        const targetYear = targetDate.getFullYear().toString();

        while (true) {
            const currentMonth = await this.monthLabel.innerText();

            if (
                currentMonth.includes(targetMonth) &&
                currentMonth.includes(targetYear)
            ) {
                break;
            }

            await this.nextMonthButton.click();
        }

        const targetDay = targetDate.getDate().toString();
        await this.page.waitForTimeout(3000);
        await this.page
            .locator('button[role="gridcell"]')
            .filter({ hasText: targetDay })
            .first()
            .click();
        await this.searchButton.click();
    }

    async getTrainDetails(trainNumber, resType) {
        const container = this.page.locator(
            `#availabilityContainer_${trainNumber}`
        );
        let trainStatus = '';
        await container.waitFor({
            state: 'visible',
            timeout: 30000
        });

        const seatBoxes = container.locator('.Mui-seat__layout_box');
        const count = await seatBoxes.count();

        const matches = [];

        for (let i = 0; i < count; i++) {
            const status = (await seatBoxes.nth(i).innerText()).trim();

            if (reservationCheck(status, resType)) {
                const [coach, price, availability] = status.split('\n');

                matches.push({
                    coach,
                    price,
                    availability
                });
            }
        }

        return {
            trainNumber,
            matches
        };
    }
}

module.exports = { SearchTrainPage };