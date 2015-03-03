var Backbone = require('backbone');

module.exports = GroupModel = Backbone.Model.extend({
    idAttribute: '_id',

    initialize: function(){
        //_.bindAll(this);
    },

    defaults: {
        id: 0,
        groupname: '',
        squestion: '',
        sanswer: ''
    },

    url: function(){
        return App.API + '/groups';
    }

});