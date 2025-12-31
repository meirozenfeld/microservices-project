const processedEventIds = new Set();

function isProcessed(eventId) {
    return processedEventIds.has(eventId);
}

function markProcessed(eventId) {
    processedEventIds.add(eventId);
}

module.exports = {
    isProcessed,
    markProcessed,
};
