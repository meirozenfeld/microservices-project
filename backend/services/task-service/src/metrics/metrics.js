const metrics = {
    totalRequests: 0,
    totalErrors: 0,
    requestDurations: [],
};

function recordRequest(durationMs) {
    metrics.totalRequests++;
    metrics.requestDurations.push(durationMs);
}

function recordError() {
    metrics.totalErrors++;
}

function snapshot() {
    const avg =
        metrics.requestDurations.reduce((a, b) => a + b, 0) /
        (metrics.requestDurations.length || 1);

    return {
        totalRequests: metrics.totalRequests,
        totalErrors: metrics.totalErrors,
        avgResponseMs: Math.round(avg),
    };
}

module.exports = {
    recordRequest,
    recordError,
    snapshot,
};
