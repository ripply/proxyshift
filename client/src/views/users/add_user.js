var Marionette = require('backbone.marionette');

module.exports = AddView = Marionette.ItemView.extend({
    template: require('../../../templates/users/add_user.hbs'),
    events: {
        'click a.save-button': 'save'
    },

    save: function(e) {
        e.preventDefault();
        var newUser = {
            username: this.$el.find('#username').val,
            password: this.$el.find('#password').val,
            name: this.$el.find('#name').val,
            email: this.$el.find('#email').val(),
            squestion: this.$el.find('#squestion').val(),
            sanswer: this.$el.find('#sanswer').val()
        };

        window.App.data.users.create(newUser);
        window.App.core.vent.trigger('app:log', 'Add View: Saved new user!');
        window.App.controller.home();
    }
});
