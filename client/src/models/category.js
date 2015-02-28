var Backbone = require('backbone');

module.exports = CategoryModel = Backbone.Model.extend({
    idAttribute: '_id',

    url: function() {
        return App.API + '/categories';
    }
});
