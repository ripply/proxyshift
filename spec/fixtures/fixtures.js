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
            },
            {
                username: 'locationmember',
                password: encrypt(password),
                firstname: 'unprivilegedgroupmember',
                lastname: 'unprivilegedgroupmember',
                email: 'unprivilegedgroupmember@example.com',
                squestion: 'unprivilegedgroupmember',
                sanswer: encrypt(password)
            },
            {
                username: 'veryprivileged',
                password: encrypt(password),
                firstname: 'veryprivileged',
                lastname: 'veryprivileged',
                email: 'veryprivileged@example.com',
                squestion: 'veryprivileged',
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
                user_id: '@users:username:test_password',
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
                user_id: '@users:username:groupowner',
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
                description: 'unprivileged',
                permissionlevel: 1
            },
            {
                groupsetting_id: 'groupsettings:0',
                description: 'privileged',
                permissionlevel: 2
            },
            {
                groupsetting_id: 'groupsettings:0',
                description: 'very privileged',
                permissionlevel: 3
            }
        ],
        usergroups: [
            {
                // user 1 is a member of its own group 0
                user_id: '@users:username:test_password',
                group_id: '@groups:name:test_password_group',
                grouppermission_id: '@grouppermissions:description:unprivileged'
            },
            {
                // user 2 is a member of group 0
                user_id: '@users:username:test_member_of_group',
                group_id: '@groups:name:test_password_group',
                grouppermission_id: '@grouppermissions:description:unprivileged'
            },
            {
                // user 3 is a member of group 0
                user_id: '@users:username:groupmember',
                group_id: '@groups:name:membershiptest',
                grouppermission_id: '@grouppermissions:description:unprivileged'
            },
            {
                // user 6 (priviledgegroupmember) is a member of group 0 and a privileged member
                user_id: '@users:username:privledgedmember',
                group_id: '@groups:name:membershiptest',
                grouppermission_id: '@grouppermissions:description:privileged'
            },
            {
                // user 7 is a member of group 1
                user_id: '@users:username:locationmember',
                group_id: '@groups:name:membershiptest',
                grouppermission_id: '@grouppermissions:description:unprivileged'
            },
            {
                user_id: '@users:username:veryprivileged',
                group_id: '@groups:name:membershiptest',
                grouppermission_id: '@grouppermissions:description:very privileged'
            }
        ],
        locations: [
            {
                group_id: '@groups:name:test_password_group',
                state: 'test_state',
                city: 'test_city',
                address: 'test_address',
                zipcode: 12345,
                phonenumber: 12435
            },
            {
                group_id: '@groups:name:membershiptest',
                state: 'membershiptest',
                city: 'test_city2',
                address: 'test_address2',
                zipcode: 123456,
                phonenumber: 124356
            }
        ],
        sublocations: [
            {
                title: 'floor 1',
                description: 'membershiptest floor 1',
                location_id: '@locations:state:membershiptest'
            }
        ],
        userpermissions: [
            {
                location_id: 'locations:0',
                user_id: '@users:username:test_password',
                grouppermission_id: '@grouppermissions:description:unprivileged'
            },
            {
                location_id: 'locations:1',
                user_id: '@users:username:locationmember',
                grouppermission_id: 'grouppermissions:0'
            }
        ],
        groupuserclasses: [
            {
                group_id: '@groups:name:membershiptest',
                title: 'User class 1',
                description: 'User class 1 description'
            }
        ],
        groupuserclasstousers: [
            {
                user_id: '@users:username:test_member_of_group',
                groupuserclass_id: '@groupuserclasses:title:User class 1'
            }
        ],
        areas: [
            {
                title: 'membership test area',
                group_id: '@groups:name:membershiptest'
            }
        ],
        arealocations: [
            {
                location_id: '@locations:state:membershiptest',
                area_id: '@areas:title:membership test area'
            }
        ]
    }
};
