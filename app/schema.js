var string = 'string';
var increments = 'increments';

// http://blog.ragingflame.co.za/2014/7/21/using-nodejs-with-mysql

var Schema = {
    'users': {
        id: {
            type: increments,
            nullable: false,
            primary: true
        },
        username: {
            type: string,
            unique: true,
            nullable: false,
            maxlen: 20
        },
        firstname: {
            type: string,
            nullable: false,
        },
        lastname: {
            type: string,
            nullable: false,
        },
        email: {
            type: string,
            unique: true,
            nullable: false
        },
        password: {
            type: string,
            unique: false,
            maxlen: 100,
            nullable: false
        },
        squestion: {
            type: string,
            nullable: false
        },
        sanswer: {
            type: string,
            nullable: false
        },
        phonehome: {
            type: string
        },
        phonemobile: {
            type: string,
            unique: true
        },
        pagernumber: {
            type: string
        }
    }

};


