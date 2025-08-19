// Simple script to load demo data
var models = require('./app/models');
var fixtures = require('./spec/fixtures/fixtures');
var fixturesHelper = require('./spec/fixtureshelper');

console.log('Loading demo data...');

models.onDatabaseReady.then(function() {
    console.log('Database ready, loading fixtures...');
    return fixturesHelper.setFixtures(fixtures);
}).then(function() {
    console.log('Demo data loaded successfully!');
    console.log('You can now login with:');
    console.log('Username: test_password');
    console.log('Password: supersecretdemopasswordpleasedontabuse');
    process.exit(0);
}).catch(function(err) {
    console.error('Error loading demo data:', err);
    process.exit(1);
});