var Marionette = require('backbone.marionette'),
    parsley = require('parsley');

module.exports = LoginView = Marionette.ItemView.extend({
    template: require('../../../templates/users/login.hbs'),
    events: {
        'click a.back': 'goBack',
        'click a.submit': 'submit',
        'click #login-btn': 'onLoginAttempt'
    },

    goBack: function() {
        e.preventDefault();
        window.App.controller.home();
    },
    onLoginAttempt: function(e) {
        e.preventDefault();

        if(this.$("#login-form").parsley('validate')){
            options = {
                username: this.$("#login-username-input").val(),
                password: this.$("#login-password-input").val()
            };
            if (this.$("#login-remember-me").prop('checked')) {
                options.remember_me = true;
            }
            App.session.login(options, {
                success: function(mod, res){
                    App.core.vent.trigger('app:login');
                },
                error: function(err, textStatus){
                    App.core.vent.trigger('app:danger', textStatus);
                }
            });
        } else {
            // Invalid clientside validations thru parsley
            console.log("Did not pass clientside validation");
        }

    }
});
