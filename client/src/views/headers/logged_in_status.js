module.exports = LoggedInStausView = Ractive.extend({
    template: require('../../../templates/headers/login_status.html'),

    adaptors: [ 'Backbone' ],

    el: "#loginStatus",

    init: function(backboneModel) {
        console.log("Initializing RACTIVE VIEW!!");
        this.set({
            session: backboneModel
        });
    }
});

