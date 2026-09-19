class PnrStatusCheck {
    constructor(page) {
        this.page = page;
        this.currentStatus = page.locator('table tbody tr td:nth-child(2) p.body-lg');
    }

async getCurrentWaitingNumbers() {

    console.log('Waiting for PNR status...');

    await this.page
        .getByRole('heading', { name: 'Passenger Status' })
        .waitFor({ state: 'visible', timeout: 30000 });

    await this.currentStatus
        .first()
        .waitFor({ state: 'visible', timeout: 30000 });

    // Wait until the actual text contains GNWL/RAC/CNF/etc.
    await this.page.waitForFunction(() => {
        const elements = document.querySelectorAll(
            'table tbody tr td:nth-child(2) p.body-lg'
        );

        return [...elements].some(el =>
            /^(GNWL|RLWL|PQWL|RAC|CNF)/i.test(el.textContent.trim())
        );
    }, { timeout: 30000 });

    const statuses = await this.currentStatus.allTextContents();

    console.log('Raw Current Status:', statuses);

    const waitingNumbers = statuses
        .map(status => status.trim())
        .map(status => {
            const match = status.match(/^(GNWL|RLWL|PQWL)\s*(\d+)/i);

            if (!match) return null;

            return {
                type: match[1].toUpperCase(),
                number: Number(match[2])
            };
        })
        .filter(Boolean);

    console.log('Current Waiting:', waitingNumbers);

    return waitingNumbers;
}
}

module.exports = { PnrStatusCheck };