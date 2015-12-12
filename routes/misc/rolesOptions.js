module.exports = {
    failureHandler: function(req, res, action) {
        if (req.hasOwnProperty('statusCode')) {
            res.status(req.statusCode);
        } else {
            res.status(401);
        }
        res.json({error: true, message: 'You don\'t have permission to: ' + action});
    },
    async: true
};
