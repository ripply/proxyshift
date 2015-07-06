var encrypt = require('../../controllers/encryption/encryption').encryptKey;

module.exports = {
    base: {
        users: [
            {
                username: 'test_nopassword',
                password: '',
                firstname: 'nopassword',
                lastname: 'nopassword',
                email: 'test_nopassword@example.com',
                squestion: 'test no password',
                sanswer: ''
            },
            {
                username: 'test_password',
                password: encrypt('test_password'),
                firstname: 'password',
                lastname: 'password',
                email: 'test_password@example.com',
                squestion: 'test password',
                sanswer: encrypt('test_password')
            }
        ]
    }
};