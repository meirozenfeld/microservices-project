module.exports = (req, res, next) => {
    req.requestId = req.headers["x-request-id"];
    next();
};
