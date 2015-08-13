var encrypt = require('../../controllers/encryption/encryption').encryptKey;

var password = 'secret';

module.exports = {
    base: {
        users: [
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
                username: 'test_member_of_group',
                password: encrypt(password),
                firstname: 'password_2',
                lastname: 'password_2',
                email: 'test_password_2@example.com',
                squestion: 'test password',
                sanswer: encrypt(password)
            },
            {
                username: 'groupmember',
                password: encrypt(password),
                firstname: 'groupmember',
                lastname: 'groupmember',
                email: 'groupmember@example.com',
                squestion: 'groupmember',
                sanswer: encrypt(password)
            },
            {
                username: 'groupowner',
                password: encrypt(password),
                firstname: 'groupowner',
                lastname: 'groupowner',
                email: 'groupowner@example.com',
                squestion: 'groupowner',
                sanswer: encrypt(password)
            },
            {
                username: 'nongroupmember',
                password: encrypt(password),
                firstname: 'nongroupmember',
                lastname: 'nongroupmember',
                email: 'nongroupmember@example.com',
                squestion: 'nongroupmember',
                sanswer: encrypt(password)
            },
            {
                username: 'privledgedmember',
                password: encrypt(password),
                firstname: 'privilegedgroupmember',
                lastname: 'privilegedgroupmember',
                email: 'privilegedgroupmember@example.com',
                squestion: 'privilegedgroupmember',
                sanswer: encrypt(password)
            }
        ],
        groupsettings: [
            {
                allowalltocreateshifts: true,
                requireshiftconfirmation: true
            },
            {
                allowalltocreateshifts: true,
                requireshiftconfirmation: true
            }
        ],
        groups: [
            {
                user_id: 'users:0',
                name: 'test_password_group',
                state: 'test_password_state',
                city: 'test_password_city',
                address: 'test_password_address',
                zipcode: 12435,
                weburl: 'test_password_weburl',
                contactemail: 'test_password_2@example.com',
                contactphone: 12435,
                groupsetting_id: 'groupsettings:0'
            },
            {
                user_id: 'users:4',
                name: 'membershiptest',
                state: 'test_password_state',
                city: 'test_password_city',
                address: 'test_password_address',
                zipcode: 12435,
                weburl: 'membershiptest',
                contactemail: 'membershiptest@example.com',
                contactphone: 12435,
                groupsetting_id: 'groupsettings:1'
            }
        ],
        grouppermissions: [
            {
                groupsetting_id: 'groupsettings:0',
                description: 'lowest permission level',
                permissionlevel: 1
            },
            {
                groupsetting_id: 'groupsettings:0',
                description: 'second lowest permission level',
                permissionlevel: 2
            },
            {
                groupsetting_id: 'groupsettings:0',
                description: 'highest permission level?',
                permissionlevel: 3
            }
        ],
        usergroups: [
            {
                // user 1 is a member of its own group 0
                user_id: 'users:0',
                group_id: 'groups:0',
                grouppermission_id: 'grouppermissions:0'
            },
            {
                // user 2 is a member of group 0
                user_id: 'users:2',
                group_id: 'groups:0',
                grouppermission_id: 'grouppermissions:0'
            },
            {
                // user 3 is a member of group 0
                user_id: 'users:3',
                group_id: 'groups:1',
                grouppermission_id: 'grouppermissions:2'
            },
            {
                // user 6 (priviledgegroupmember) is a member of group 0 and a privileged member
                user_id: 'users:6',
                group_id: 'groups:1',
                grouppermission_id: 'grouppermissions:2'
            }
        ],
        locations: [
            {
                group_id: 'groups:0',
                state: 'test_state',
                city: 'test_city',
                address: 'test_address',
                zipcode: 12345,
                phonenumber: 12435
            }
        ],
        userpermissions: [
            {
                location_id: 'locations:0',
                user_id: 'users:0',
                grouppermission_id: 'grouppermissions:0'
            }
        ],
        groupuserclasses: [
            {
                group_id: 'groups:0',
                title: 'User class 1',
                description: 'User class 1 description'
            }
        ],
        groupuserclasstousers: [
            {
                user_id: 'users:2',
                groupuserclassses: 'groupuserclasstousers:0'
            }
        ]
    }
};
