var Backbone = require('backbone');

module.exports = UserModel = Backbone.Model.extend({
    idAttribute: '_id',

    initialize: function(){
        //_.bindAll(this);
    },

    defaults: {
        id: 0,
        username: '',
        name: '',
        email: '',
        squestion: '',
        sanswer: ''
    },

    url: function(){
        return App.API + '/users';
    }

});