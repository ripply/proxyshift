var Marionette = require('backbone.marionette');

module.exports = LoggedInHeaderView = Marionette.ItemView.extend({
    template: require('../../../templates/headers/logged_in.hbs'),
});
