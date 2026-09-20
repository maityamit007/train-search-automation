const { default: axios } = require("axios");
require('dotenv').config();

async function getAlerts() {
    let respData = await axios(process.env.API_URL);
    if (respData.data.length > 0 ) {
        return respData.data
    } else {
        return [];
    }
}

async function updateAlert(id, payload) {
    console.log("Updating:", id);
    console.log(payload);
}

module.exports = {
    getAlerts,
    updateAlert
};

async function sendNtfy(title, message) {
    const topic = process.env.NTFY_TOPIC;

    if (!topic) {
        throw new Error('NTFY_TOPIC environment variable is missing');
    }

    const response = await fetch(`https://ntfy.sh/${topic}`, {
        method: 'POST',
        headers: {
            'Title': title,
            'Priority': 'high',
            'Tags': 'train'
        },
        body: message
    });

    if (!response.ok) {
        throw new Error(
            `ntfy notification failed: ${response.status} ${response.statusText}`
        );
    }

    console.log('📱 ntfy notification sent successfully');
}

module.exports = { sendNtfy };