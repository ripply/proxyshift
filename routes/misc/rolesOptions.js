module.exports = {
    failureHandler: function(req, res, action) {
        res.status(401);
        res.send('You don\'t have permission to: ' + action);
        //throw new Exception("HEY");
    },
    async: true
};