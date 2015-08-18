module.exports = {
    failureHandler: function(req, res, action) {
        res.status(401);
        res.json({error: true, message: 'You don\'t have permission to: ' + action});
    },
    async: true
};
