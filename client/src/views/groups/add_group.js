var Marionette = require('backbone.marionette'),
    parsley = require('parsley'),
    GroupModel = require('../../models/group_model');

module.exports = GroupsView = Marionette.ItemView.extend({
    template: require('../../../templates/groups/add_group.hbs'),
    events: {
        'click a.back': 'goBack',
        'click a.submit': 'submit',
        'click #addgroup-btn': 'onAddGroupAttempt'
    },

    goBack: function() {
        e.preventDefault();
        window.App.controller.home();
    },
    onAddGroupAttempt: function(e) {
        e.preventDefault();

        if(this.$("#addgroup-form").parsley('validate')){
            options = {
                groupname: this.$("#addgroup-groupname-input").val(),
                squestion: this.$("#addgroup-squestion-input").val(),
                sanswer: this.$("#addgroup-sanswer-input").val()
            };
            var group = new GroupModel(options);
            // null must be passed into save for callback to trigger
            group.save(null, {
                success: function(mod, res, options){
                    App.core.vent.trigger('app:info', 'Successfully created group.');
                    // trigger event that says we have created a group
                    // this should switch views to something like
                    // congratulations on creating a group
                    App.core.vent.trigger('app:groups');
                },
                error: function(mod, res, options){
                    var text = res.responseJSON;
                    if (text === undefined ||
                        text === null) {
                        text = 'Failed to create group';
                        App.core.vent.trigger('app:log', 'Unknown response from server: ' + res.responseText);
                    }
                    App.core.vent.trigger('app:danger', text);
                }
            });

        } else {
            // Invalid clientside validations thru parsley
            console.log("Did not pass clientside validation");
        }

    }
});
