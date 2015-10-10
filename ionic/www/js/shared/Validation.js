// Validations need to be separated from Schema
// this is so that we do not need to generate this file
// from the Schema file.
// It needs to be used by both the client and the server
// the client should not have access to the database schema
// so that bad people won't know our database structure.

// the structure of the validation definition should be
// abstract enough that we can generate both client and
// server side validations from it.

var minimumStringLength = 4;
var maximumStringLength = 20;

var Validations = {
    User: {
        username: [{
            rule: 'required',
            message: 'Username is required.',
            label: 'Username'
        }, {
            rule: 'minLength:' + minimumStringLength,
            message: 'Username must have at least ' + minimumStringLength + ' characters.'
        }, {
            rule: 'maxLength:' + maximumStringLength,
            message: 'Username must have at most ' + maximumStringLength + ' characters.'
        }],
        firstname: [{
            rule: 'required',
            message: 'First name is required.',
            label: 'Firstname'
        }, {
            rule: 'minLength:' + minimumStringLength,
            message: 'Firstname must have at least ' + minimumStringLength + ' characters.'
        }, {
            rule: 'maxLength:' + maximumStringLength,
            message: 'Firstname must have at most ' + maximumStringLength + ' characters.'
        }],
        lastname: [{
            rule: 'required',
            message: 'Last name is required.',
            label: 'Lastname'
        }, {
            rule: 'minLength:' + minimumStringLength,
            message: 'Last name must have at least ' + minimumStringLength + ' characters.'
        }, {
            rule: 'maxLength:' + maximumStringLength,
            message: 'Last name must have at most ' + maximumStringLength + ' characters.'
        }],
        email: [{
            rule: 'required',
            message: 'Email is required.',
            label: 'Email'
        }, {
            rule: 'email',
            message: 'Must use a proper email.'
        }],
        password: [{
            rule: 'required',
            message: 'Password is required.',
            label: 'Password'
        }, {
            rule: 'minLength:' + minimumStringLength,
            message: 'Password must have at least ' + minimumStringLength + ' characters.'
        }, {
            rule: 'maxLength:' + maximumStringLength,
            message: 'Password must have at most ' + maximumStringLength + ' characters.'
        }],
        squestion: [{
            rule: 'required',
            message: 'Secret Question is required.',
            label: 'Squestion'
        }],
        sanswer: [{
            rule: 'required',
            message: 'Secret Answer is required.',
            label: 'Sanswer'
        }],
        phonehome: [{
            rule: 'integer',
            message: 'Phone number must be a number.',
            label: 'Phonehome'
        }],
        phonemobile: [{
            rule: 'integer',
            message: 'Phone number must be a number.',
            label: 'Phonemobile'
        }],
        pagernumber: [{
            rule: 'integer',
            message: 'Pager number must be a number.',
            label: 'Pagernumber'
        }]
    }
};

/*
var minimumStringLength = 4;
var maximumStringLength = 20;

var Validations = {
    User: {
        username: [
            { validator: 'notEmpty', message: 'Username is required.' },
            { validator: 'isLength', args: [minimumStringLength, maximumStringLength],
                message: 'Username must be between ' + minimumStringLength + ' and ' +
                maximumStringLength + ' characters.'},
        ],
        firstname: [
            { validator: 'notEmpty', message: 'Fist name is required.'},
            { validator: 'isLength', args: [1, maximumStringLength],
                message: 'First name must be within ' + maximumStringLength + ' characters.'},
        ],
        lastname: [
            { validator: 'notEmpty', message: 'Last name is required.'},
            { validator: 'isLength', args: [1, maximumStringLength],
                message: 'Last name must be within ' + maximumStringLength + ' characters.'},
        ],
        email: [
            { validator: 'notEmpty', message: 'Email is required.'},
            { validator: 'isEmail', message: 'Invalid Email.'},
        ],
        password: [
            { validator: 'notEmpty', message: 'Password is required.'},
            // TODO: This works client side but server stores password hash which is larger than 20 chars so this needs to be changed
            //{ validator: 'isLength', args: [minimumStringLength, 20], message: 'Password must be between ' + minimumStringLength + ' and 20 characters.'},
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
    },
    Group: {
        name: [
            { validator: 'notEmpty', message: 'Group must have a name' },
            { validator: 'isLength', args: [minimumStringLength, maximumStringLength],
                message: 'Group name must be within ' + minimumStringLength + ' and ' +
            maximumStringLength},
        ],
        state: [
            //{ validator: 'notEmpty', message: 'Group must have a state' },
            { validator: 'isLength', args: [minimumStringLength, maximumStringLength],
                message: 'Group state must be within ' + minimumStringLength + ' and ' +
                maximumStringLength},
        ],
        city: [
            //{ validator: 'notEmpty', message: 'Group must have a city' },
            { validator: 'isLength', args: [minimumStringLength, maximumStringLength],
                message: 'Group city must be within ' + minimumStringLength + ' and ' +
                maximumStringLength},
        ],
        address: [
            //{ validator: 'notEmpty', message: 'Group must have an address' },
            { validator: 'isLength', args: [minimumStringLength, maximumStringLength * 4],
                message: 'Group address must be within ' + minimumStringLength + ' and ' +
                maximumStringLength * 4},
        ],
        zipcode: [
            { validator: 'isInt', message: 'Invalid number'},
        ],
        weburl: [
            //{ validator: 'notEmpty', message: 'Group must have a url' },
            /*
            { validator: 'isLength', args: [minimumStringLength, maximumStringLength],
                message: 'URL must be within ' + minimumStringLength + ' and ' +
                maximumStringLength},
            //TODO: { validator: 'url' ...
                *//*
        ],
        contactemail: [
            { validator: 'notEmpty', message: 'Email must be present' },
            /*{ validator: 'isLength', args: [minimumStringLength, maximumStringLength],
                message: 'email must be within ' + minimumStringLength + ' and ' +
                maximumStringLength}*//*
            //TODO: { validator: 'isEmail'}
        ],
        contactphone: [
            { validator: 'isInt', message: 'Invalid phone number' }
        ]
    },
    Shift: {
        title: [
            { validator: 'notEmpty', message: 'A shift must have a title' },
            { validator: 'isLength', args: [0, 30], message: 'Cannot be larger than 30 characters'},
        ],
        description: [
            { validator: 'isLength', args: [0, 30], message: 'Cannot be larger than 30 characters'},
        ]
        // TODO: Validate start < end
        // TODO: Client side - if shift too short then make notification window, but allow it
    }

};
*/
// Set validations to global variables client side
if (typeof window == 'undefined') {
    module.exports = Validations;
} else {
    window.Validations = Validations;
}
