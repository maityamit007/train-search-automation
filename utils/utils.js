
function reservationCheck(text = '', dynamicValue = '') {
    return text.includes(dynamicValue);
}

function getConfirmationChance(type, number) {
    if (type === 'CNF') {
        return 100;
    }

    if (!number) {
        return 0;
    }

    if (type === 'RAC') {
        if (number <= 10) return 90;
        if (number <= 20) return 80;
        if (number <= 30) return 70;
        if (number <= 50) return 55;
        return 40;
    }

    if (type === 'GNWL') {
        if (number <= 10) return 85;
        if (number <= 20) return 70;
        if (number <= 40) return 50;
        if (number <= 60) return 35;
        return 20;
    }

    if (type === 'RLWL' || type === 'PQWL') {
        if (number <= 10) return 60;
        if (number <= 20) return 45;
        if (number <= 40) return 30;
        return 15;
    }

    return 0;
}

function createBattery(chance) {
    const total = 10;
    const filled = Math.round(chance / 10);

    return `${'🟩'.repeat(filled)}${'⬜'.repeat(total - filled)} ${chance}%`;
}


module.exports = { reservationCheck, createBattery, getConfirmationChance };