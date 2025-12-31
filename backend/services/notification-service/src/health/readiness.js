let consumerReady = false;

function markConsumerReady() {
    consumerReady = true;
}

function isReady() {
    return consumerReady;
}

module.exports = {
    markConsumerReady,
    isReady,
};
