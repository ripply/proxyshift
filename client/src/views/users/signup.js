var Marionette = require('backbone.marionette'),
    parsley = require('parsley'),
    UserModel = require('../../models/user_model');

module.exports = SignupView = Marionette.ItemView.extend({
    template: require('../../../templates/users/signup.hbs'),
    events: {
        'click a.back': 'goBack',
        'click a.submit': 'submit',
        'click #signup-btn': 'onSignupAttempt'
    },

    goBack: function() {
        e.preventDefault();
        window.App.controller.home();
    },
    onSignupAttempt: function(e) {
        e.preventDefault();

        if(this.$("#signup-form").parsley('validate')){
            options = {
                username: this.$("#signup-username-input").val(),
                password: this.$("#signup-password-input").val(),
                name: this.$("#signup-name-input").val(),
                email: this.$("#signup-email-input").val(),
                squestion: this.$("#signup-squestion-input").val(),
                sanswer: this.$("#signup-sanswer-input").val()
            };
            var user = new UserModel(options);
            user.save({
                success: function(mod, res){
                    App.core.vent.trigger('app:signup');
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
