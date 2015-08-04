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
            { validator: 'notEmpty', message: 'Name is required' },
        ],
        firstname: [
            { validator: 'notEmpty', message: 'Fist name is required'},
        ],
        lastname: [
            { validator: 'notEmpty', message: 'Last name is required'},
        ],
        email: [
            { validator: 'notEmpty', message: 'Email is required'},
        ],
        password: [
            { validator: 'notEmpty', message: 'Password is required'},
        ],
        squestion: [
            { validator: 'notEmpty', message: 'Secret question is required'},
        ],
        sanswer: [
            { validator: 'notEmpty', message: 'Secret answer is required'},
        ],
        phonemobile: [
            { validator: 'notEmpty', message: 'Mobile phone number required'},
        ]
    }

};

// Set validations to global variables client side
if (typeof window == 'undefined') {
    module.exports = Validations;
} else {
    window.Validations = Validations;
}
