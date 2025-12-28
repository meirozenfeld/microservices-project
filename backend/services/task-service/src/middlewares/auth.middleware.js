const authMiddleware = (req, res, next) => {
    const userId = req.headers['x-user-id'];

    // Debug log
    console.log('[TASK SERVICE AUTH] Headers:', {
        'x-user-id': req.headers['x-user-id'],
        'authorization': req.headers['authorization'],
        allHeaders: Object.keys(req.headers).filter(k => k.startsWith('x-'))
    });

    if (!userId) {
        return res.status(401).json({
            message: 'Unauthorized: missing user context'
        });
    }

    req.user = {
        id: userId
    };

    next();
};

module.exports = authMiddleware;
