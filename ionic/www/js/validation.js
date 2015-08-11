// Validations need to be separated from Schema
// this is so that we do not need to generate this file
// from the Schema file.
// It needs to be used by both the client and the server
// the client should not have access to the database schema
// so that bad people won't know our database structure.

// the structure of the validation definition should be
// abstract enough that we can generate both client and
// server side validations from it.

var Validations = {
    User: {
        username: [
            { validator: 'notEmpty', message: 'Username is required.' },
            { validator: 'isLength', args: [4, 20], message: 'Username must be between 4 and 20 characters.'},
        ],
        firstname: [
            { validator: 'notEmpty', message: 'Fist name is required.'},
            { validator: 'isLength', args: [0, 20], message: 'First name must be within 20 characters.'},
        ],
        lastname: [
            { validator: 'notEmpty', message: 'Last name is required.'},
            { validator: 'isLength', args: [0, 20], message: 'Last name must be within 20 characters.'},
        ],
        email: [
            { validator: 'notEmpty', message: 'Email is required.'},
            { validator: 'isEmail', message: 'Invalid Email.'},
        ],
        password: [
            { validator: 'notEmpty', message: 'Password is required.'},
            { validator: 'isLength', args: [4, 20], message: 'Password must be between 4 and 20 characters.'},
        ],
        squestion: [
            { validator: 'notEmpty', message: 'Secret question is required.'},
        ],
        sanswer: [
            { validator: 'notEmpty', message: 'Secret answer is required.'},
        ],
        phonehome: [
            { validator: 'isInt', message: 'Invalid Number.'},
        ],
        phonemobile: [
            { validator: 'isInt', message: 'Invalid Number.'},
        ],
        pagernumber: [
            { validator: 'isInt', message: 'Invalid Number.'},
        ]
    }

};

// Set validations to global variables client side
if (typeof window == 'undefined') {
    module.exports = Validations;
} else {
    window.Validations = Validations;
}
