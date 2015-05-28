var mongoose = require('mongoose'),
    models = require('./models'),
    md5 = require('MD5');

module.exports = {
    /*
    check: function() {
        models.Shift.find({}, function(err, shifts) {
            if (shifts.length === 0) {
                console.log('no shifts found, seeding...');
                var newShift = new models.Shift({
                    start: Date.now(),
                    end: Date.now()
                });
                newShift.save(function(err, shift) {
                    console.log('successfully inserted shift: ' + shift._id);
                });

                newShift = new models.Shift({
                    start: Date.now(),
                    end: Date.now()
                });
                newShift.save(function(err, shift) {
                    console.log('successfully inserted shift: ' + shift._id);
                });

                newShift = new models.Shift({
                    start: Date.now(),
                    end: Date.now()
                });
                newShift.save(function(err, shift) {
                    console.log('successfully inserted shift: ' + shift._id);
                });
            } else {
                console.log('found ' + shifts.length + ' existing shifts!');
                console.log(shifts);
            }
        });
        models.Users.remove({username: 'asdf'}, function(err) {
            if (err) {console.log("ERRRRRRRR WUTTT");}

            console.log("DELETED USERSSS YEYEYEE");
        });
        models.Users.find({}, function(err, users) {
            if (users.length == 0) {
                console.log('No users found, seeding...');
                var user = new models.Users({ username: 'asdf', email: 'asdf@example.com', password: 'asdf', squestion: 'whatever?', sanswer: 'test' });
                user.save(function(err) {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log('user: ' + user.username + " saved.");
                        console.log(user);
                    }
                });
            } else {
                console.log('There are ' + users.length + ' existing users!');
            }
        });
        models.Token.find({}, function(err, tokens) {
            if (tokens.length == 0) {
                console.log("There are no remember me tokens");
            } else {
                console.log("Remember me tokens exist");
                console.log(tokens);
            }
        });
        models.Category.find({}, function(err, categories) {
            if (categories.length < 4) {
                var rootCategory = new models.Category({
                    name: 'root category!'
                });
                rootCategory.save(function(err, category) {
                    if (!err) {
                        console.log("successfully created root category");
                    }
                });
                firstChild = new models.Category({
                    parent: rootCategory._id,
                    name: "First child"
                });
                firstChild.save();
                secondChild = new models.Category({
                    parent: firstChild._id,
                    name: "second child"
                });
                secondChild.save();
                otherChild = new models.Category({
                    parent: rootCategory._id,
                    name: 'other child'
                });
                otherChild.save();
            } else {
                console.log(categories.length + " categories found");
            }
        });
    }
    */
};
