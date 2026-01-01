function getDayKeyFromDate(dateInput) {
    const date = new Date(dateInput);
    return date.toISOString().split("T")[0];
}

function getTodayKey() {
    return getDayKeyFromDate(new Date());
}

module.exports = { getTodayKey, getDayKeyFromDate };
