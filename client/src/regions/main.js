var Marionette = require('backbone.marionette');

console.log("MainRegion.extend");
module.exports = MainRegion = Marionette.Region.extend({
    el: "#js-boilerplate-app"
});