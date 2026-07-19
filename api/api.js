const data = require("./mockData.js");

async function getAlerts() {
    // Later this will become an axios GET call
    return data;
}

async function updateAlert(id, payload) {
    console.log("Updating:", id);
    console.log(payload);

    // Later this becomes POST /alerts/result
}

module.exports = {
    getAlerts,
    updateAlert
};