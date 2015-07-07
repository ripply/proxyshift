var encrypt = require('../../controllers/encryption/encryption').encryptKey;

var password = 'secret';

module.exports = {
    base: {
        users: [
            {
                // simple user account with an empty password
                // it should never be allowed to login
                username: 'test_nopassword',
                password: '',
                firstname: 'nopassword',
                lastname: 'nopassword',
                email: 'test_nopassword@example.com',
                squestion: 'test no password',
                sanswer: ''
            },
            {
                // user with a password used for testing login
                username: 'test_password',
                password: encrypt(password),
                firstname: 'password',
                lastname: 'password',
                email: 'test_password@example.com',
                squestion: 'test password',
                sanswer: encrypt(password)
            },
            {
                username: 'test_member_of_group',
                password: encrypt(password),
                firstname: 'password_2',
                lastname: 'password_2',
                email: 'test_password_2@example.com',
                squestion: 'test password',
                sanswer: encrypt(password)
            }
        ],
        groupsettings: [
            {
                allowalltocreateshifts: true,
                requireshiftconfirmation: true
            }
        ],
        groups: [
            {
                user_id: 'users:1',
                name: 'test_password_group',
                state: 'test_password_state',
                city: 'test_password_city',
                address: 'test_password_address',
                zipcode: 12435,
                weburl: 'test_password_weburl',
                contactemail: 'test_password_2@example.com',
                contactphone: 12435,
                groupsetting_id: 'groupsettings:0'
            }
        ],
        usergroups: [
            {
                // user 1 is a member of its own group 0
                user_id: 'users:1',
                group_id: 'groups:0'
            },
            {
                // user 2 is a member of group 0
                user_id: 'users:2',
                group_id: 'groups:0'
            }
        ]
    }
};