var Backbone = require('backbone');

module.exports = ContactModel = Backbone.Model.extend({
    idAttribute: '_id',

    url: function() {
        return App.API + '/shifts';
    }
});
