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