var Marionette = require('backbone.marionette'),
    parsley = require('parsley');

module.exports = LoginView = Marionette.ItemView.extend({
    template: require('../../../templates/users/login.hbs'),
    events: {
        'click a.back': 'goBack',
        'click a.submit': 'submit',
        'click a#login-btn': 'onLoginAttempt'
    },

    goBack: function(e) {
        e.preventDefault();
        window.App.controller.home();
    },
    onLoginAttempt: function(e) {
        e.preventDefault();

        if(this.$("#login-form").parsley('validate')){
            App.session.login({
                username: this.$("#login-username-input").val(),
                password: this.$("#login-password-input").val()
            }, {
                success: function(mod, res){
                    App.core.vent.trigger('app:login');
                },
                error: function(err){
                    App.core.vent.trigger('app:alert', 'Bummer dude!');
                }
            });
        } else {
            // Invalid clientside validations thru parsley
            console.log("Did not pass clientside validation");
        }

    }
});
