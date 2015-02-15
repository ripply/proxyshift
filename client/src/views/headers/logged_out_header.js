var Marionette = require('backbone.marionette');

module.exports = LoggedOutHeaderView = Marionette.ItemView.extend({
    template: require('../../../templates/headers/logged_out.hbs')
});
