// Load the bcrypt module
var bcrypt = require('bcrypt-nodejs');

// Generate a salt
var salt = bcrypt.genSaltSync(10);

module.exports = {
    encryptKeySync: function(password) {
        if (password === null ||
            password === undefined ||
            password.length === 0) {
            return null;
        } else {
            // Hash the password with the salt
            var hash = bcrypt.hashSync(password, salt);

            return  hash;
        }
    },
    encryptKey: function(password, cb) {
        if (password === null ||
            password === undefined ||
            password.length === 0) {
            cb(undefined, null);
        } else {
            // Hash the password with the salt0
            bcrypt.hash(password, salt, undefined, cb);
        }
    }
};
