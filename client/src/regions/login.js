var Marionette = require('backbone.marionette');

module.exports = LoginRegion = Marionette.Region.extend({
    el: "#content",
    template: require('../../templates/login_layout.hbs')
});