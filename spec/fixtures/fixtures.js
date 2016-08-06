var encrypt = require('../../controllers/encryption/encryption').encryptKey;
var _ = require('underscore');
moment = require('moment');
momentTimezone = require('moment-timezone');

var password = 'secret';

function formatDateForDb(date) {
    // TODO: pg needs different date formats
    return date;
}

function startOfHour() {
    return new moment().startOf('hour');
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

// don't even actually do this calculation, its *very* slow
var encrypted_password = '$2a$10$TqoucSy5v/xPYrJqUpJgZ.I/CgmP4RWGADhWL6rtilF5w0X2h6TYG'; //encrypt(password);

var users = [
    {
        // user with a password used for testing login
        username: 'test_password',
        password: encrypted_password,
        firstname: 'password',
        lastname: 'password',
        email: 'test_password@example.com',
        squestion: 'test password',
        sanswer: encrypted_password,
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
        password: encrypted_password,
        firstname: 'password_2',
        lastname: 'password_2',
        email: 'test_password_2@example.com',
        squestion: 'test password',
        sanswer: encrypted_password,
        phonehome: '12345',
        phonemobile: '12345',
        pagernumber: '12345',
        usersetting_id: 'usersettings:2'
    },
    {
        username: 'groupmember',
        password: encrypted_password,
        firstname: 'groupmember',
        lastname: 'groupmember',
        email: 'groupmember@example.com',
        squestion: 'groupmember',
        sanswer: encrypted_password,
        phonehome: '12345',
        phonemobile: '12345',
        pagernumber: '12345',
        usersetting_id: 'usersettings:3'
    },
    {
        username: 'groupowner',
        password: encrypted_password,
        firstname: 'groupowner',
        lastname: 'groupowner',
        email: 'groupowner@example.com',
        squestion: 'groupowner',
        sanswer: encrypted_password,
        phonehome: '12345',
        phonemobile: '12345',
        pagernumber: '12345',
        usersetting_id: 'usersettings:4'
    },
    {
        username: 'nongroupmember',
        password: encrypted_password,
        firstname: 'nongroupmember',
        lastname: 'nongroupmember',
        email: 'nongroupmember@example.com',
        squestion: 'nongroupmember',
        sanswer: encrypted_password,
        phonehome: '12345',
        phonemobile: '12345',
        pagernumber: '12345',
        usersetting_id: 'usersettings:5'
    },
    {
        username: 'privledgedmember',
        password: encrypted_password,
        firstname: 'privilegedgroupmember',
        lastname: 'privilegedgroupmember',
        email: 'privilegedgroupmember@example.com',
        squestion: 'privilegedgroupmember',
        sanswer: encrypted_password,
        phonehome: '12345',
        phonemobile: '12345',
        pagernumber: '12345',
        usersetting_id: 'usersettings:6'
    },
    {
        username: 'locationmember',
        password: encrypted_password,
        firstname: 'unprivilegedgroupmember',
        lastname: 'unprivilegedgroupmember',
        email: 'unprivilegedgroupmember@example.com',
        squestion: 'unprivilegedgroupmember',
        sanswer: encrypted_password,
        phonehome: '12345',
        phonemobile: '12345',
        pagernumber: '12345',
        usersetting_id: 'usersettings:7'
    },
    {
        username: 'veryprivileged',
        password: encrypted_password,
        firstname: 'veryprivileged',
        lastname: 'veryprivileged',
        email: 'veryprivileged@example.com',
        squestion: 'veryprivileged',
        sanswer: encrypted_password,
        phonehome: '12345',
        phonemobile: '12345',
        pagernumber: '12345',
        usersetting_id: 'usersettings:8'
    },
    {
        username: 'manager',
        password: encrypted_password,
        firstname: 'manager',
        lastname: 'manager',
        email: 'manager@example.com',
        squestion: 'manager',
        sanswer: encrypted_password,
        phonehome: '12345',
        phonemobile: '12345',
        pagernumber: '12345',
        usersetting_id: 'usersettings:9'
    },
    {
        username: 'nonlocationmem',
        password: encrypted_password,
        firstname: 'nonlocationmember',
        lastname: 'nonlocationmember',
        email: 'nonlocationmember@example.com',
        squestion: 'nonlocationmember',
        sanswer: encrypted_password,
        phonehome: '12345',
        phonemobile: '12345',
        pagernumber: '12345',
        usersetting_id: 'usersettings:10'
    },
    {
        username: 'shiftapplied',
        password: encrypted_password,
        firstname: 'shiftapplied',
        lastname: 'shiftapplied',
        email: 'shiftapplied@example.com',
        squestion: 'shiftapplied',
        sanswer: encrypted_password,
        phonehome: '12345',
        phonemobile: '12345',
        pagernumber: '12345',
        usersetting_id: 'usersettings:11'
    },
    // Retail
    {
        username: 'retail_owner',
        password: encrypted_password,
        firstname: 'retail_owner',
        lastname: 'owner',
        email: 'retail_owner@example.com',
        squestion: 'retail',
        sanswer: encrypted_password,
        phonehome: '12345',
        phonemobile: '12345',
        pagernumber: '12345',
        usersetting_id: 'usersettings:12'
    },
    {
        username: 'retail_manager',
        password: encrypted_password,
        firstname: 'retail_manager',
        lastname: 'manager',
        email: 'retail_manager@example.com',
        squestion: 'retail',
        sanswer: encrypted_password,
        phonehome: '12345',
        phonemobile: '12345',
        pagernumber: '12345',
        usersetting_id: 'usersettings:13'
    },
    {
        username: 'retail_pharmacist',
        password: encrypted_password,
        firstname: 'retail_pharmacist',
        lastname: 'pharmacy',
        email: 'retail_pharmacist@example.com',
        squestion: 'retail',
        sanswer: encrypted_password,
        phonehome: '12345',
        phonemobile: '12345',
        pagernumber: '12345',
        usersetting_id: 'usersettings:14'
    },
    {
        username: 'retail_pharmacy_tech',
        password: encrypted_password,
        firstname: 'retail_pharmacy_tech',
        lastname: 'pharmacy',
        email: 'retail_pharmacy_tech@example.com',
        squestion: 'retail',
        sanswer: encrypted_password,
        phonehome: '12345',
        phonemobile: '12345',
        pagernumber: '12345',
        usersetting_id: 'usersettings:15'
    },
    {
        username: 'retail_cashier',
        password: encrypted_password,
        firstname: 'retail_cashier',
        lastname: 'front',
        email: 'retail_cashier@example.com',
        squestion: 'retail',
        sanswer: encrypted_password,
        phonehome: '12345',
        phonemobile: '12345',
        pagernumber: '12345',
        usersetting_id: 'usersettings:16'
    },
    {
        username: 'retail_deli_employee',
        password: encrypted_password,
        firstname: 'retail_deli_employee',
        lastname: 'owner',
        email: 'retail_deli_employee@example.com',
        squestion: 'retail',
        sanswer: encrypted_password,
        phonehome: '12345',
        phonemobile: '12345',
        pagernumber: '12345',
        usersetting_id: 'usersettings:17'
    },
    {
        username: 'retail_baker',
        password: encrypted_password,
        firstname: 'retail_baker',
        lastname: 'bakery',
        email: 'retail_baker@example.com',
        squestion: 'retail',
        sanswer: encrypted_password,
        phonehome: '12345',
        phonemobile: '12345',
        pagernumber: '12345',
        usersetting_id: 'usersettings:18'
    },
    {
        username: 'retail_florist',
        password: encrypted_password,
        firstname: 'retail_florist',
        lastname: 'floral',
        email: 'retail_florist@example.com',
        squestion: 'retail',
        sanswer: encrypted_password,
        phonehome: '12345',
        phonemobile: '12345',
        pagernumber: '12345',
        usersetting_id: 'usersettings:19'
    },
    // Hospital
    {
        username: 'hospital_owner',
        password: encrypted_password,
        firstname: 'hospital_owner',
        lastname: 'owner',
        email: 'hospital_owner@example.com',
        squestion: 'retail',
        sanswer: encrypted_password,
        phonehome: '12345',
        phonemobile: '12345',
        pagernumber: '12345',
        usersetting_id: 'usersettings:20'
    },
    {
        username: 'hospital_doctor',
        password: encrypted_password,
        firstname: 'hospital_doctor',
        lastname: 'manager',
        email: 'hospital_doctor@example.com',
        squestion: 'retail',
        sanswer: encrypted_password,
        phonehome: '12345',
        phonemobile: '12345',
        pagernumber: '12345',
        usersetting_id: 'usersettings:21'
    },
    {
        username: 'hospital_nurse',
        password: encrypted_password,
        firstname: 'hospital_nurse',
        lastname: 'icu',
        email: 'hospital_nurse@example.com',
        squestion: 'retail',
        sanswer: encrypted_password,
        phonehome: '12345',
        phonemobile: '12345',
        pagernumber: '12345',
        usersetting_id: 'usersettings:22'
    },
    {
        username: 'hospital_pharmacist',
        password: encrypted_password,
        firstname: 'hospital_pharmacist',
        lastname: 'pharmacy',
        email: 'hospital_pharmacist@example.com',
        squestion: 'retail',
        sanswer: encrypted_password,
        phonehome: '12345',
        phonemobile: '12345',
        pagernumber: '12345',
        usersetting_id: 'usersettings:23'
    },
    {
        username: 'hospital_pharmacy_tech',
        password: encrypted_password,
        firstname: 'hospital_pharmacy_tech',
        lastname: 'pharmacy_tech',
        email: 'hospital_pharmacy_tech@example.com',
        squestion: 'retail',
        sanswer: encrypted_password,
        phonehome: '12345',
        phonemobile: '12345',
        pagernumber: '12345',
        usersetting_id: 'usersettings:24'
    },
    {
        username: 'hospital_lab_tech',
        password: encrypted_password,
        firstname: 'hospital_lab_tech',
        lastname: 'lab',
        email: 'hospital_lab_tech@example.com',
        squestion: 'retail',
        sanswer: encrypted_password,
        phonehome: '12345',
        phonemobile: '12345',
        pagernumber: '12345',
        usersetting_id: 'usersettings:25'
    },
    {
        username: 'hospital_janitor',
        password: encrypted_password,
        firstname: 'hospital',
        lastname: 'janitor',
        email: 'hospital_janitor@example.com',
        squestion: 'retail',
        sanswer: encrypted_password,
        phonehome: '12345',
        phonemobile: '12345',
        pagernumber: '12345',
        usersetting_id: 'usersettings:26'
    },
];

var usersettings = [];
for (var i = 0; i < users.length + 1; i++) {
    usersettings.push({
        pushnotifications: true,
        textnotifications: true,
        emailnotifications: true
    });
}

var sublocations = [{
    title: 'floor 1',
    description: 'membershiptest floor 1',
    location_id: '@locations:state:membershiptest'
}];

// Create each of these sublocations in each of these retail stores
_.each([
    'Store 1',
    'Store 2',
    'Store 3',
    'Store 4',
    'Store 5'
], function(location) {
    _.each([
        'Pharmacy',
        'Front Store',
        'Deli',
        'Bakery',
        'Floral',
        'Electronics'
    ], function(sublocation) {
        sublocations.push({
            title: sublocation,
            description: 'Retail ' + sublocation + ' @ ' + location,
            location_id: '@locations:title:' + location
        })
    });
});

// Create each of these sublocations in each of these hospitals
_.each([
    'Hospital Alpha',
    'Hospital Beta',
    'Hospital Delta',
    'Hospital Theta',
    'Hospital Omega'
], function(location) {
    _.each([
        'ICU',
        'Pharmacy',
        'ER',
        'Lab',
        'Janitorial',
        'Psych Ward'
    ], function(sublocation) {
        sublocations.push({
            title: sublocation,
            description: sublocation + ' @ ' + location,
            location_id: '@locations:title:' + location
        })
    });
});

module.exports = {
    base: {
        usersettings: usersettings,
        users: users,
        groupsettings: [
            {
                allowalltocreateshifts: true,
                requireshiftconfirmation: true
            },
            {
                allowalltocreateshifts: true,
                requireshiftconfirmation: true
            },
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
            },
            {
                user_id: '@users:username:retail_owner',
                name: 'Retail Store Chain',
                state: 'test_password_state',
                city: 'test_password_city',
                address: 'test_password_address',
                zipcode: 12435,
                weburl: 'membershiptest',
                contactemail: 'membershiptest@example.com',
                contactphone: 12435,
                groupsetting_id: 'groupsettings:2'
            },
            {
                user_id: '@users:username:hospital_owner',
                name: 'Hospital',
                state: 'test_password_state',
                city: 'test_password_city',
                address: 'test_password_address',
                zipcode: 12435,
                weburl: 'membershiptest',
                contactemail: 'membershiptest@example.com',
                contactphone: 12435,
                groupsetting_id: 'groupsettings:3'
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
            },
            {
                groupsetting_id: 'groupsettings:0',
                group_id: '@groups:name:Retail Store Chain',
                description: 'unprivileged (retail)',
                permissionlevel: 1
            },
            {
                groupsetting_id: 'groupsettings:0',
                group_id: '@groups:name:Retail Store Chain',
                description: 'privileged (retail)',
                permissionlevel: 2
            },
            {
                groupsetting_id: 'groupsettings:0',
                group_id: '@groups:name:Retail Store Chain',
                description: 'very privileged (retail)',
                permissionlevel: 3
            },
            {
                groupsetting_id: 'groupsettings:0',
                group_id: '@groups:name:Hospital',
                description: 'unprivileged (hospital)',
                permissionlevel: 1
            },
            {
                groupsetting_id: 'groupsettings:0',
                group_id: '@groups:name:Hospital',
                description: 'privileged (hospital)',
                permissionlevel: 2
            },
            {
                groupsetting_id: 'groupsettings:0',
                group_id: '@groups:name:Hospital',
                description: 'very privileged (hospital)',
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
            // retail
            {
                user_id: '@users:username:retail_owner',
                group_id: '@groups:name:Retail Store Chain',
                grouppermission_id: '@grouppermissions:description:very privileged (retail)'
            },
            {
                user_id: '@users:username:retail_manager',
                group_id: '@groups:name:Retail Store Chain',
                grouppermission_id: '@grouppermissions:description:privileged (retail)'
            },
            {
                user_id: '@users:username:retail_pharmacist',
                group_id: '@groups:name:Retail Store Chain',
                grouppermission_id: '@grouppermissions:description:unprivileged (retail)'
            },
            {
                user_id: '@users:username:retail_pharmacy_tech',
                group_id: '@groups:name:Retail Store Chain',
                grouppermission_id: '@grouppermissions:description:unprivileged (retail)'
            },
            {
                user_id: '@users:username:retail_cashier',
                group_id: '@groups:name:Retail Store Chain',
                grouppermission_id: '@grouppermissions:description:unprivileged (retail)'
            },
            {
                user_id: '@users:username:retail_deli_employee',
                group_id: '@groups:name:Retail Store Chain',
                grouppermission_id: '@grouppermissions:description:unprivileged (retail)'
            },
            {
                user_id: '@users:username:retail_baker',
                group_id: '@groups:name:Retail Store Chain',
                grouppermission_id: '@grouppermissions:description:unprivileged (retail)'
            },
            {
                user_id: '@users:username:retail_florist',
                group_id: '@groups:name:Retail Store Chain',
                grouppermission_id: '@grouppermissions:description:unprivileged (retail)'
            },
            // Hospital
            {
                user_id: '@users:username:hospital_owner',
                group_id: '@groups:name:Hospital',
                grouppermission_id: '@grouppermissions:description:very privileged (hospital)'
            },
            {
                user_id: '@users:username:hospital_nurse',
                group_id: '@groups:name:Hospital',
                grouppermission_id: '@grouppermissions:description:unprivileged (hospital)'
            },
            {
                user_id: '@users:username:hospital_pharmacist',
                group_id: '@groups:name:Hospital',
                grouppermission_id: '@grouppermissions:description:unprivileged (hospital)'
            },
            {
                user_id: '@users:username:hospital_pharmacy_tech',
                group_id: '@groups:name:Hospital',
                grouppermission_id: '@grouppermissions:description:unprivileged (hospital)'
            },
            {
                user_id: '@users:username:hospital_lab_tech',
                group_id: '@groups:name:Hospital',
                grouppermission_id: '@grouppermissions:description:unprivileged (hospital)'
            },
            {
                user_id: '@users:username:hospital_janitor',
                group_id: '@groups:name:Hospital',
                grouppermission_id: '@grouppermissions:description:unprivileged (hospital)'
            },
        ],
        locations: [
            {
                group_id: '@groups:name:test_password_group',
                timezone_id: defaultTimezone(),
                title: 'test_state_title',
                state: 'test_state',
                city: 'test_city',
                address: 'test_address',
                zipcode: 12345,
                phonenumber: 12435
            },
            {
                group_id: '@groups:name:membershiptest',
                timezone_id: defaultTimezone(),
                title: 'membershiptest_title',
                state: 'membershiptest',
                city: 'test_city2',
                address: 'test_address2',
                zipcode: 123456,
                phonenumber: 124356
            },
            {
                group_id: '@groups:name:Retail Store Chain',
                timezone_id: defaultTimezone(),
                title: 'Store 1',
                state: 'VA',
                city: 'Chesapeake',
                address: '111 Blue St',
                zipcode: 23320,
                phonenumber: 5551111111
            },
            {
                group_id: '@groups:name:Retail Store Chain',
                timezone_id: defaultTimezone(),
                title: 'Store 2',
                state: 'VA',
                city: 'Yorktown',
                address: '222 Red Rd',
                zipcode: 23693,
                phonenumber: 5552222222
            },
            {
                group_id: '@groups:name:Retail Store Chain',
                timezone_id: defaultTimezone(),
                title: 'Store 3',
                state: 'OH',
                city: 'Kent',
                address: '333 Orange Blvd',
                zipcode: 44240,
                phonenumber: 555333333
            },
            {
                group_id: '@groups:name:Retail Store Chain',
                timezone_id: defaultTimezone(),
                title: 'Store 4',
                state: 'IL',
                city: 'Lombard',
                address: '444 Indigo Ave',
                zipcode: 60148,
                phonenumber: 5554444444
            },
            {
                group_id: '@groups:name:Retail Store Chain',
                timezone_id: defaultTimezone(),
                title: 'Store 5',
                state: 'IL',
                city: 'Chicago',
                address: '555 Violet Ln',
                zipcode: 60290,
                phonenumber: 5555555555
            },
            {
                group_id: '@groups:name:Hospital',
                timezone_id: defaultTimezone(),
                title: 'Hospital Alpha',
                state: 'VA',
                city: 'Chesapeake',
                address: '100 Blue St',
                zipcode: 23320,
                phonenumber: 5551001000
            },
            {
                group_id: '@groups:name:Hospital',
                timezone_id: defaultTimezone(),
                title: 'Hospital Beta',
                state: 'VA',
                city: 'Yorktown',
                address: '200 Red Rd',
                zipcode: 23693,
                phonenumber: 5552002000
            },
            {
                group_id: '@groups:name:Hospital',
                timezone_id: defaultTimezone(),
                title: 'Hospital Delta',
                state: 'OH',
                city: 'Kent',
                address: '300 Orange Blvd',
                zipcode: 44240,
                phonenumber: 5553003000
            },
            {
                group_id: '@groups:name:Hospital',
                timezone_id: defaultTimezone(),
                title: 'Hospital Theta',
                state: 'IL',
                city: 'Lombard',
                address: '400 Indigo Ave.',
                zipcode: 60148,
                phonenumber: 5554004000
            },
            {
                group_id: '@groups:name:Hospital',
                timezone_id: defaultTimezone(),
                title: 'Hospital Omega',
                state: 'IL',
                city: 'Chicago',
                address: '500 Violet Ln',
                zipcode: 60290,
                phonenumber: 5555005000
            }
        ],
        sublocations: sublocations,
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
                grouppermission_id: '@grouppermissions:description:unprivileged',
                requiremanagerapproval: false,
                cansendnotification: true
            },
            {
                group_id: '@groups:name:membershiptest',
                title: 'classtest',
                description: 'User class 1 description',
                grouppermission_id: '@grouppermissions:description:unprivileged',
                requiremanagerapproval: true,
                cansendnotification: true
            },
            {
                group_id: '@groups:name:membershiptest',
                title: 'manager',
                description: 'Manages people',
                grouppermission_id: '@grouppermissions:description:privileged',
                requiremanagerapproval: true,
                cansendnotification: true
            },
            // Retail
            {
                group_id: '@groups:name:Retail Store Chain',
                title: 'Manager (retail)',
                description: '',
                grouppermission_id: '@grouppermissions:description:privileged (retail)',
                requiremanagerapproval: true,
                cansendnotification: true
            },
            {
                group_id: '@groups:name:Retail Store Chain',
                title: 'Pharmacist (retail)',
                description: '',
                grouppermission_id: '@grouppermissions:description:privileged (retail)',
                requiremanagerapproval: true,
                cansendnotification: true
            },
            {
                group_id: '@groups:name:Retail Store Chain',
                title: 'Pharmacy Tech (retail)',
                description: '',
                grouppermission_id: '@grouppermissions:description:unprivileged (retail)',
                requiremanagerapproval: true,
                cansendnotification: true
            },
            {
                group_id: '@groups:name:Retail Store Chain',
                title: 'Cashier',
                description: '',
                grouppermission_id: '@grouppermissions:description:unprivileged (retail)',
                requiremanagerapproval: true,
                cansendnotification: true
            },
            {
                group_id: '@groups:name:Retail Store Chain',
                title: 'Deli employee',
                description: '',
                grouppermission_id: '@grouppermissions:description:unprivileged (retail)',
                requiremanagerapproval: true,
                cansendnotification: true
            },
            {
                group_id: '@groups:name:Retail Store Chain',
                title: 'Baker',
                description: '',
                grouppermission_id: '@grouppermissions:description:unprivileged (retail)',
                requiremanagerapproval: true,
                cansendnotification: true
            },
            {
                group_id: '@groups:name:Retail Store Chain',
                title: 'Florist',
                description: '',
                grouppermission_id: '@grouppermissions:description:unprivileged (retail)',
                requiremanagerapproval: true,
                cansendnotification: true
            },
            // Hospital
            {
                group_id: '@groups:name:Hospital',
                title: 'Doctor',
                description: '',
                grouppermission_id: '@grouppermissions:description:privileged (hospital)',
                requiremanagerapproval: true,
                cansendnotification: true
            },
            {
                group_id: '@groups:name:Hospital',
                title: 'Nurse',
                description: '',
                grouppermission_id: '@grouppermissions:description:unprivileged (hospital)',
                requiremanagerapproval: true,
                cansendnotification: true
            },
            {
                group_id: '@groups:name:Hospital',
                title: 'Pharmacist',
                description: '',
                grouppermission_id: '@grouppermissions:description:privileged (hospital)',
                requiremanagerapproval: true,
                cansendnotification: true
            },
            {
                group_id: '@groups:name:Hospital',
                title: 'Pharmacy Tech',
                description: '',
                grouppermission_id: '@grouppermissions:description:unprivileged (hospital)',
                requiremanagerapproval: true,
                cansendnotification: true
            },
            {
                group_id: '@groups:name:Hospital',
                title: 'Lab Tech',
                description: '',
                grouppermission_id: '@grouppermissions:description:unprivileged (hospital)',
                requiremanagerapproval: true,
                cansendnotification: true
            },
            {
                group_id: '@groups:name:Hospital',
                title: 'Janitor',
                description: '',
                grouppermission_id: '@grouppermissions:description:unprivileged (hospital)',
                requiremanagerapproval: true,
                cansendnotification: true
            },
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
            },
            // Retail
            {
                user_id: '@users:username:retail_manager',
                groupuserclass_id: '@groupuserclasses:title:Manager (retail)'
            },
            {
                user_id: '@users:username:retail_pharmacist',
                groupuserclass_id: '@groupuserclasses:title:Pharmacist (retail)'
            },
            {
                user_id: '@users:username:retail_pharmacy_tech',
                groupuserclass_id: '@groupuserclasses:title:Pharmacy Tech (retail)'
            },
            {
                user_id: '@users:username:retail_cashier',
                groupuserclass_id: '@groupuserclasses:title:Cashier'
            },
            {
                user_id: '@users:username:retail_deli_employee',
                groupuserclass_id: '@groupuserclasses:title:Deli employee'
            },
            {
                user_id: '@users:username:retail_baker',
                groupuserclass_id: '@groupuserclasses:title:Baker'
            },
            {
                user_id: '@users:username:retail_florist',
                groupuserclass_id: '@groupuserclasses:title:Florist'
            },
            // Hospital
            {
                user_id: '@users:username:hospital_doctor',
                groupuserclass_id: '@groupuserclasses:title:Doctor'
            },
            {
                user_id: '@users:username:hospital_nurse',
                groupuserclass_id: '@groupuserclasses:title:Nurse'
            },
            {
                user_id: '@users:username:hospital_pharmacist',
                groupuserclass_id: '@groupuserclasses:title:Pharmacist'
            },
            {
                user_id: '@users:username:hospital_pharmacy_tech',
                groupuserclass_id: '@groupuserclasses:title:Pharmacy Tech'
            },
            {
                user_id: '@users:username:hospital_lab_tech',
                groupuserclass_id: '@groupuserclasses:title:Lab Tech'
            },
            {
                user_id: '@users:username:hospital_janitor',
                groupuserclass_id: '@groupuserclasses:title:Janitor'
            },
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
                description: 'month long shift ending now',
                start: formatDateForDb(startOfHour().subtract('1', 'month').unix()),
                end: formatDateForDb(startOfHour().unix()),
                timezone_id: defaultTimezone(),
                location_id: '@locations:state:membershiptest',
                canceled: false,
                //sublocation_id: null,
                user_id: '@users:username:groupmember',
                groupuserclass_id: '@groupuserclasses:title:classtest'
            },
            {
                description: 'shift that starts in the future',
                start: formatDateForDb(startOfHour().add('1', 'hour').unix()),
                end: formatDateForDb(startOfHour().add('3', 'hour').unix()),
                timezone_id: defaultTimezone(),
                location_id: '@locations:state:membershiptest',
                canceled: false,
                //sublocation_id: null,
                user_id: '@users:username:groupmember',
                groupuserclass_id: '@groupuserclasses:title:classtest'
            },
            {
                // FIXME: This shift gets inserted into db (sqlite3) as id 3 when it is 5th in the list, so for now set it to 3rd item
                description: 'shift in another location',
                start: formatDateForDb(startOfHour().add('1', 'hour').unix()),
                end: formatDateForDb(startOfHour().add('3', 'hour').unix()),
                timezone_id: defaultTimezone(),
                location_id: '@locations:state:test_state',
                canceled: false,
                //sublocation_id: '@sublocations:description:membershiptest floor 1',
                user_id: '@users:username:groupmember',
                groupuserclass_id: '@groupuserclasses:title:classtest'
            },
            {
                description: 'shift in sublocation',
                start: formatDateForDb(startOfHour().add('1', 'hour').unix()),
                end: formatDateForDb(startOfHour().add('3', 'hour').unix()),
                timezone_id: defaultTimezone(),
                canceled: false,
                //location_id: null,
                sublocation_id: '@sublocations:description:membershiptest floor 1',
                //user_id: null,
                groupuserclass_id: '@groupuserclasses:title:classtest'
            },
            {
                description: 'shift in sublocation',
                start: formatDateForDb(startOfHour().add('1', 'hour').unix()),
                end: formatDateForDb(startOfHour().add('3', 'hour').unix()),
                timezone_id: defaultTimezone(),
                canceled: false,
                //location_id: null,
                sublocation_id: '@sublocations:description:membershiptest floor 1',
                user_id: '@users:username:groupmember',
                groupuserclass_id: '@groupuserclasses:title:classtest'
            },
            {
                description: 'shift in sublocation',
                start: formatDateForDb(startOfHour().add('1', 'hour').unix()),
                end: formatDateForDb(startOfHour().add('3', 'hour').unix()),
                timezone_id: defaultTimezone(),
                canceled: false,
                //location_id: null,
                sublocation_id: '@sublocations:description:membershiptest floor 1',
                //user_id: null,
                groupuserclass_id: '@groupuserclasses:title:User class 1'
            },
            // Hospital
            {
                description: 'Over Time Authorized',
                start: formatDateForDb(moment(new Date()).startOf('day').add('3', 'days').add('8', 'hour').unix()),
                end: formatDateForDb(moment(new Date()).startOf('day').add('3', 'days').add('17', 'hour').unix()),
                timezone_id: defaultTimezone(),
                canceled: false,
                //location_id: null,
                sublocation_id: '@sublocations:description:ER @ Hospital Alpha',
                user_id: '@users:username:hospital_nurse',
                groupuserclass_id: '@groupuserclasses:title:Nurse'
            }
        ],
        shiftapplications:[
            {
                shift_id: '@shifts:description:month long shift ending now',
                user_id: '@users:username:shiftapplied',
                date: formatDateForDb(moment(new Date()).unix()),
                recinded: false
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
