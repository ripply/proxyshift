module.exports = {
    failureHandler: function(req, res, action) {
        if (req.hasOwnProperty('statusCode') &&
            // this gets set null somewhere... and it will crash res.json() I am confused, the all mighty grep is failing me
            req.statusCode !== null
        ) {
            res.status(req.statusCode);
        } else {
            res.status(401);
        }
        res.json({error: true, message: 'You don\'t have permission to: ' + action});
    },
    async: true
};
