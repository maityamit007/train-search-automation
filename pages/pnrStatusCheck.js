class PnrStatusCheck {
    constructor(page) {
        this.page = page;

        this.currentStatus = page.locator(
            'table tbody tr td:nth-child(2) p.body-lg'
        );

        this.passengers = ['Amit', 'Mansi'];
    }

    async getCurrentStatus() {
        console.log('Waiting for PNR status...');

        await this.page
            .getByRole('heading', { name: 'Passenger Status' })
            .waitFor({
                state: 'visible',
                timeout: 30000
            });

        await this.currentStatus
            .first()
            .waitFor({
                state: 'visible',
                timeout: 30000
            });

        // Wait until the actual status is populated.
        await this.page.waitForFunction(() => {
            const elements = document.querySelectorAll(
                'table tbody tr td:nth-child(2) p.body-lg'
            );

            return [...elements].some(el =>
                /^(GNWL|RLWL|PQWL|RAC|CNF)/i.test(
                    el.textContent.trim()
                )
            );
        }, { timeout: 30000 });

        const statuses = await this.currentStatus.allTextContents();

        console.log('Raw Current Status:', statuses);

        const passengerStatuses = statuses
            .map((status, index) => {
                const cleanStatus = status.trim();

                let type = 'UNKNOWN';
                let number = null;

                // GNWL 25 / RLWL 10 / PQWL 5
                const waitingMatch = cleanStatus.match(
                    /^(GNWL|RLWL|PQWL)\s*(\d+)/i
                );

                // RAC 12
                const racMatch = cleanStatus.match(
                    /^RAC\s*(\d+)/i
                );

                // CNF
                const cnfMatch = cleanStatus.match(
                    /^CNF/i
                );

                if (waitingMatch) {
                    type = waitingMatch[1].toUpperCase();
                    number = Number(waitingMatch[2]);
                } else if (racMatch) {
                    type = 'RAC';
                    number = Number(racMatch[1]);
                } else if (cnfMatch) {
                    type = 'CNF';
                } else {
                    type = cleanStatus;
                }

                return {
                    passenger: this.passengers[index] || `Passenger ${index + 1}`,
                    status: cleanStatus,
                    type,
                    number
                };
            });

        console.log('Passenger Status:', passengerStatuses);

        return passengerStatuses;
    }
}

module.exports = { PnrStatusCheck };