// Load the bcrypt module
var bcrypt = require('bcrypt-nodejs');

module.exports = {
    encryptKey: function(password) {
        if (password === null ||
            password === undefined ||
            password.length === 0) {
            return null;
        } else {
            // Generate a salt
            var salt = bcrypt.genSaltSync(10);
            // Hash the password with the salt
            var hash = bcrypt.hashSync(password, salt);

            return  hash;
        }
    }
}
