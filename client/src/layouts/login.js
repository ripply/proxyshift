var Marionette = require('backbone.marionette');

module.exports = LoginLayoutView = Marionette.Layout.extend({
    template: require('../../templates/layouts/login_layout.hbs'),

    regions: {
        menu: "#menu",
        content: "#content"
    }
});