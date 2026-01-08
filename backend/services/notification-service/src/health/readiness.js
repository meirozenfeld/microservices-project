let consumerReady = false;

function markConsumerReady() {
    consumerReady = true;
}

function isReady() {
    if (process.env.NODE_ENV === "production") {
        return true;
    }
    return consumerReady;
}


module.exports = {
    markConsumerReady,
    isReady,
};
