
function reservationCheck(text = '', dynamicValue ='') {
    return text.includes(dynamicValue);
}

module.exports = { reservationCheck };