const metrics = {
    processedEvents: 0,
    failedEvents: 0,
};

function recordProcessed() {
    metrics.processedEvents++;
}

function recordFailed() {
    metrics.failedEvents++;
}

function snapshot() {
    return { ...metrics };
}

module.exports = {
    recordProcessed,
    recordFailed,
    snapshot,
};
