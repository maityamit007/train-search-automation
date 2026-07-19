function formatNotification(train) {
    if (train.matches.length === 0) {
        return `❌ No ${train.trainNumber} seats found.`;
    }

    let message = `Train ${train.trainNumber} is now availble for booking!\n`;

    train.matches.forEach(seat => {
        message +=
            `Coach : ${seat.coach}
Price : ₹${seat.price}
Status: ${seat.availability}

`;
    });

    return message;
}

module.exports = { formatNotification };