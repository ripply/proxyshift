/* jshint -W030 */
var models = require('../../app/models');

describe('Models', function() {

    describe('Users', function() {
        var schema = models.Users.schema.paths;

        it('should exist', function() {
            expect(models.Users).to.exist;
        });

        it('should have name string field', function() {
            expect(schema.name).to.exist;
            expect(schema.name.instance).to.equal('String');
        });

        it('should have email string field', function() {
            expect(schema.email).to.exist;
            expect(schema.email.instance).to.equal('String');
        });

        it('should have password field', function() {
            expect(schema.password).to.exist;
            expect(schema.password.instance).to.equal('String');
        });

        it('should have squestion field', function() {
            expect(schema.squestion).to.exist;
            expect(schema.squestion.instance).to.equal('String');
        });

        it('should have sanswer field', function() {
            expect(schema.sanswer).to.exist;
            expect(schema.sanswer.instance).to.equal('String');
        });

    });
});
