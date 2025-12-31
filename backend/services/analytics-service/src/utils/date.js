function getDayKeyFromDate(dateString) {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
}

module.exports = { getTodayKey, getDayKeyFromDate };
