module.exports = {
    index: function(req, res, next) {
        res.cookie('csrftoken', req.csrfToken());
        res.render('index', {csrfToken: req.csrfToken()});
    },
    login: function(req, res, next) {

    }
};
