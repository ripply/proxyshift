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
            // null must be passed into save for callback to trigger
            user.save(null, {
                success: function(mod, res, options){
                    App.core.vent.trigger('app:info', 'Successfully created account.');
                    // trigger event that says we have signed up
                    // this should switch views to something like
                    // congratulations on signing up
                    // please check your email and then signin
                    App.core.vent.trigger('app:signup');
                },
                error: function(mod, res, options){
                    var text = res.responseJSON.error;
                    if (text === undefined ||
                        text === null) {
                        text = 'Failed to create user';
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
