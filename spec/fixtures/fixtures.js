var encrypt = require('../../controllers/encryption/encryption').encryptKey;
moment = require('moment');
momentTimezone = require('moment-timezone');

var password = 'secret';

function formatDateForDb(date) {
    // TODO: pg needs different date formats
    return date;
}

// use index for database id
timezones = moment.tz.names();
var timezoneFixtures = [];
for (var i = 0; i < timezones.length; i++) {
    timezoneFixtures.push({
        name: timezones[i]
    });
}
function getTimezoneId(name) {
    for (var i = 0; i < timezones.length; i++) {
        if (timezones[i] == name) {
            // hack to get sqlite ids to align properly with zone name
            return i - 2;
            // postgres is fine without hack
            //return i;
        }
    }
    return -1;
}

var timezone = "America/Chicago";

function defaultTimezone() {
    return getTimezoneId(timezone);
}

module.exports = {
    base: {
        usersettings: [
            {
                pushnotifications: true,
                textnotifications: true,
                emailnotifications: true
            },
            {
                pushnotifications: true,
                textnotifications: true,
                emailnotifications: true
            },
            {
                pushnotifications: true,
                textnotifications: true,
                emailnotifications: true
            },
            {
                pushnotifications: true,
                textnotifications: true,
                emailnotifications: true
            },
            {
                pushnotifications: true,
                textnotifications: true,
                emailnotifications: true
            },
            {
                pushnotifications: true,
                textnotifications: true,
                emailnotifications: true
            },
            {
                pushnotifications: true,
                textnotifications: true,
                emailnotifications: true
            },
            {
                pushnotifications: true,
                textnotifications: true,
                emailnotifications: true
            },
            {
                pushnotifications: true,
                textnotifications: true,
                emailnotifications: true
            },
            {
                pushnotifications: true,
                textnotifications: true,
                emailnotifications: true
            },
            {
                pushnotifications: true,
                textnotifications: true,
                emailnotifications: true
            },
            {
                pushnotifications: true,
                textnotifications: true,
                emailnotifications: true
            }
        ],
        users: [
            {
                // user with a password used for testing login
                username: 'test_password',
                password: encrypt(password),
                firstname: 'password',
                lastname: 'password',
                email: 'test_password@example.com',
                squestion: 'test password',
                sanswer: encrypt(password),
                phonehome: '12345',
                phonemobile: '12345',
                pagernumber: '12345',
                usersetting_id: 'usersettings:0'
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
                sanswer: '',
                phonehome: '12345',
                phonemobile: '12345',
                pagernumber: '12345',
                usersetting_id: 'usersettings:1'
            },
            {
                username: 'test_member_of_group',
                password: encrypt(password),
                firstname: 'password_2',
                lastname: 'password_2',
                email: 'test_password_2@example.com',
                squestion: 'test password',
                sanswer: encrypt(password),
                phonehome: '12345',
                phonemobile: '12345',
                pagernumber: '12345',
                usersetting_id: 'usersettings:2'
            },
            {
                username: 'groupmember',
                password: encrypt(password),
                firstname: 'groupmember',
                lastname: 'groupmember',
                email: 'groupmember@example.com',
                squestion: 'groupmember',
                sanswer: encrypt(password),
                phonehome: '12345',
                phonemobile: '12345',
                pagernumber: '12345',
                usersetting_id: 'usersettings:3'
            },
            {
                username: 'groupowner',
                password: encrypt(password),
                firstname: 'groupowner',
                lastname: 'groupowner',
                email: 'groupowner@example.com',
                squestion: 'groupowner',
                sanswer: encrypt(password),
                phonehome: '12345',
                phonemobile: '12345',
                pagernumber: '12345',
                usersetting_id: 'usersettings:4'
            },
            {
                username: 'nongroupmember',
                password: encrypt(password),
                firstname: 'nongroupmember',
                lastname: 'nongroupmember',
                email: 'nongroupmember@example.com',
                squestion: 'nongroupmember',
                sanswer: encrypt(password),
                phonehome: '12345',
                phonemobile: '12345',
                pagernumber: '12345',
                usersetting_id: 'usersettings:5'
            },
            {
                username: 'privledgedmember',
                password: encrypt(password),
                firstname: 'privilegedgroupmember',
                lastname: 'privilegedgroupmember',
                email: 'privilegedgroupmember@example.com',
                squestion: 'privilegedgroupmember',
                sanswer: encrypt(password),
                phonehome: '12345',
                phonemobile: '12345',
                pagernumber: '12345',
                usersetting_id: 'usersettings:6'
            },
            {
                username: 'locationmember',
                password: encrypt(password),
                firstname: 'unprivilegedgroupmember',
                lastname: 'unprivilegedgroupmember',
                email: 'unprivilegedgroupmember@example.com',
                squestion: 'unprivilegedgroupmember',
                sanswer: encrypt(password),
                phonehome: '12345',
                phonemobile: '12345',
                pagernumber: '12345',
                usersetting_id: 'usersettings:7'
            },
            {
                username: 'veryprivileged',
                password: encrypt(password),
                firstname: 'veryprivileged',
                lastname: 'veryprivileged',
                email: 'veryprivileged@example.com',
                squestion: 'veryprivileged',
                sanswer: encrypt(password),
                phonehome: '12345',
                phonemobile: '12345',
                pagernumber: '12345',
                usersetting_id: 'usersettings:8'
            },
            {
                username: 'manager',
                password: encrypt(password),
                firstname: 'manager',
                lastname: 'manager',
                email: 'manager@example.com',
                squestion: 'manager',
                sanswer: encrypt(password),
                phonehome: '12345',
                phonemobile: '12345',
                pagernumber: '12345',
                usersetting_id: 'usersettings:9'
            },
            {
                username: 'nonlocationmem',
                password: encrypt(password),
                firstname: 'nonlocationmember',
                lastname: 'nonlocationmember',
                email: 'nonlocationmember@example.com',
                squestion: 'nonlocationmember',
                sanswer: encrypt(password),
                phonehome: '12345',
                phonemobile: '12345',
                pagernumber: '12345',
                usersetting_id: 'usersettings:10'
            },
            {
                username: 'shiftapplied',
                password: encrypt(password),
                firstname: 'shiftapplied',
                lastname: 'shiftapplied',
                email: 'shiftapplied@example.com',
                squestion: 'shiftapplied',
                sanswer: encrypt(password),
                phonehome: '12345',
                phonemobile: '12345',
                pagernumber: '12345',
                usersetting_id: 'usersettings:11'
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
                groupsetting_id: 'groupsettings:1'
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
                groupsetting_id: 'groupsettings:0'
            }
        ],
        grouppermissions: [
            {
                groupsetting_id: 'groupsettings:0',
                group_id: '@groups:name:membershiptest',
                description: 'unprivileged',
                permissionlevel: 1
            },
            {
                groupsetting_id: 'groupsettings:0',
                group_id: '@groups:name:membershiptest',
                description: 'privileged',
                permissionlevel: 2
            },
            {
                groupsetting_id: 'groupsettings:0',
                group_id: '@groups:name:membershiptest',
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
            },
            {
                user_id: '@users:username:manager',
                group_id: '@groups:name:membershiptest',
                grouppermission_id: '@grouppermissions:description:privileged'
            },
            {
                user_id: '@users:username:nonlocationmem',
                group_id: '@groups:name:membershiptest',
                grouppermission_id: '@grouppermissions:description:unprivileged'
            },
            {
                user_id: '@users:username:shiftapplied',
                group_id: '@groups:name:membershiptest',
                grouppermission_id: '@grouppermissions:description:unprivileged'
            },
        ],
        locations: [
            {
                group_id: '@groups:name:test_password_group',
                timezone_id: defaultTimezone(),
                state: 'test_state',
                city: 'test_city',
                address: 'test_address',
                zipcode: 12345,
                phonenumber: 12435
            },
            {
                group_id: '@groups:name:membershiptest',
                timezone_id: defaultTimezone(),
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
                location_id: '@locations:state:test_state',
                user_id: '@users:username:test_password',
                subscribed: true,
                //grouppermission_id: '@grouppermissions:description:unprivileged'
            },
            {
                location_id: '@locations:state:membershiptest',
                user_id: '@users:username:locationmember',
                subscribed: true,
                //grouppermission_id: '@grouppermissions:description:unprivileged'
            },
            {
                location_id: '@locations:state:membershiptest',
                user_id: '@users:username:groupmember',
                subscribed: true,
                //grouppermission_id: '@grouppermissions:description:unprivileged'
            },
            {
                location_id: '@locations:state:membershiptest',
                user_id: '@users:username:manager',
                subscribed: true,
                //grouppermission_id: '@grouppermissions:description:privileged'
            },
        ],
        groupuserclasses: [
            {
                group_id: '@groups:name:membershiptest',
                title: 'User class 1',
                description: 'User class 0 description',
                grouppermission_id: '@grouppermissions:description:unprivileged'
            },
            {
                group_id: '@groups:name:membershiptest',
                title: 'classtest',
                description: 'User class 1 description',
                grouppermission_id: '@grouppermissions:description:unprivileged'
            },

            {
                group_id: '@groups:name:membershiptest',
                title: 'manager',
                description: 'Manages people',
                grouppermission_id: '@grouppermissions:description:privileged'
            }
        ],
        groupuserclasstousers: [
            {
                user_id: '@users:username:test_member_of_group',
                groupuserclass_id: '@groupuserclasses:title:User class 1'
            },
            {
                user_id: '@users:username:groupmember',
                groupuserclass_id: '@groupuserclasses:title:classtest'
            },
            {
                user_id: '@users:username:manager',
                groupuserclass_id: '@groupuserclasses:title:manager'
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
        ],
        shifts: [
            {
                title: 'monthshiftisover',
                description: 'month long shift ending now',
                start: formatDateForDb(moment(new Date()).subtract('1', 'month').unix()),
                end: formatDateForDb(moment(new Date()).unix()),
                timezone_id: defaultTimezone(),
                location_id: '@locations:state:membershiptest',
                //sublocation_id: null,
                user_id: '@users:username:groupmember',
                groupuserclass_id: '@groupuserclasses:title:classtest'
            },
            {
                title: 'newshift',
                description: 'shift that starts in the future',
                start: formatDateForDb(moment(new Date()).add('1', 'hour').unix()),
                end: formatDateForDb(moment(new Date()).add('3', 'hour').unix()),
                timezone_id: defaultTimezone(),
                location_id: '@locations:state:membershiptest',
                //sublocation_id: null,
                user_id: '@users:username:groupmember',
                groupuserclass_id: '@groupuserclasses:title:classtest'
            },
            {
                // FIXME: This shift gets inserted into db (sqlite3) as id 3 when it is 5th in the list, so for now set it to 3rd item
                title: 'shift_in_other_location',
                description: 'shift in another location',
                start: formatDateForDb(moment(new Date()).add('1', 'hour').unix()),
                end: formatDateForDb(moment(new Date()).add('3', 'hour').unix()),
                timezone_id: defaultTimezone(),
                location_id: '@locations:state:test_state',
                //sublocation_id: '@sublocations:description:membershiptest floor 1',
                user_id: '@users:username:groupmember',
                groupuserclass_id: '@groupuserclasses:title:classtest'
            },
            {
                title: 'sublocationshift',
                description: 'shift in sublocation',
                start: formatDateForDb(moment(new Date()).add('1', 'hour').unix()),
                end: formatDateForDb(moment(new Date()).add('3', 'hour').unix()),
                timezone_id: defaultTimezone(),
                //location_id: null,
                sublocation_id: '@sublocations:description:membershiptest floor 1',
                //user_id: null,
                groupuserclass_id: '@groupuserclasses:title:classtest'
            },
            {
                title: 'sublocationshiftwithuser',
                description: 'shift in sublocation',
                start: formatDateForDb(moment(new Date()).add('1', 'hour').unix()),
                end: formatDateForDb(moment(new Date()).add('3', 'hour').unix()),
                timezone_id: defaultTimezone(),
                //location_id: null,
                sublocation_id: '@sublocations:description:membershiptest floor 1',
                user_id: '@users:username:groupmember',
                groupuserclass_id: '@groupuserclasses:title:classtest'
            },
            {
                title: 'different_classtype',
                description: 'shift in sublocation',
                start: formatDateForDb(moment(new Date()).add('1', 'hour').unix()),
                end: formatDateForDb(moment(new Date()).add('3', 'hour').unix()),
                timezone_id: defaultTimezone(),
                //location_id: null,
                sublocation_id: '@sublocations:description:membershiptest floor 1',
                //user_id: null,
                groupuserclass_id: '@groupuserclasses:title:User class 1'
            },
        ],
        shiftapplications:[
            {
                shift_id: '@shifts:title:monthshiftisover',
                user_id: '@users:username:shiftapplied',
                date: formatDateForDb(moment(new Date()).unix())
            }
        ],
        managingclassesatlocations: [
            {
                usergroup_id: 'usergroups:6', // manager
                location_id: '@locations:state:membershiptest',
                groupuserclass_id: '@groupuserclasses:title:User class 1',
                managing: true
            },
            {
                usergroup_id: 'usergroups:6', // manager
                location_id: '@locations:state:membershiptest',
                groupuserclass_id: '@groupuserclasses:title:classtest',
                managing: true
            }
        ]
    }
};
