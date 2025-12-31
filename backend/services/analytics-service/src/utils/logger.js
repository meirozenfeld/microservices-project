function log(...args) {
    console.log("[ANALYTICS]", ...args);
}

function error(...args) {
    console.error("[ANALYTICS]", ...args);
}

module.exports = { log, error };
