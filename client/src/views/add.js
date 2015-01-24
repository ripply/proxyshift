var Marionette = require('backbone.marionette');

module.exports = AddView = Marionette.ItemView.extend({
    template: require('../../templates/add.hbs'),
    events: {
        'click a.save-button': 'save'
    },

    save: function(e) {
        e.preventDefault();
        var newShift = {
            start: this.$el.find('#start').val(),
            end: this.$el.find('#end').val(),
        };

        window.App.data.contacts.create(newShift);
        window.App.core.vent.trigger('app:log', 'Add View: Saved new shift!');
        window.App.controller.home();
    }
});
