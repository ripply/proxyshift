var string = 'string';
var increments = 'increments';
var integer = 'integer';
var cascade = 'cascade';
var restrict = 'restrict';
var boolean = 'boolean';
var date = 'date';

// http://blog.ragingflame.co.za/2014/7/21/using-nodejs-with-mysql

var Schema = {
    'users': {
        id: {
            type: increments,
            nullable: false
        },
        username: {
            type: string,
            unique: true,
            nullable: false,
            maxlen: 20
        },
        firstname: {
            type: string,
            nullable: false
        },
        lastname: {
            type: string,
            nullable: false
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
    },
    shifts: {
        id: {
            type: increments
        },
        groupsid: {
            type: integer,
            references: 'id',
            inTable: 'groups',
            onDelete: cascade
        },
        usersid: {
            type: integer,
            references: 'id',
            inTable: 'users',
            onDelete: cascade
        },
        title: {
            type: string,
            maxlen: 30,
            nullable: false
        },
        decription: {
            type: string,
            maxlen: 30
        },
        allDay: {
            type: boolean,
            defaultTo: false
        },
        recurring: {
            type: boolean,
            defaultTo: false
        },
        start: {
            type: date,
            nullable: false
        },
        end: {
            type: date,
            nullable: false
        }
    },
    groups: {
        id: {
            type: increments
        },
        ownerid: {
            type: integer,
            references: 'id',
            inTable: 'users',
            onDelete: restrict
        },
        name: {
            type: string,
            nullable: false
        },
        state: {
            type: string
        },
        city: {
            type: string
        },
        address: {
            type: string
        },
        zipcode: {
            type: integer // TODO: this should be a string? zipcodes can have - in them
        },
        weburl: {
            type: string
        },
        contactemail: {
            type: string,
            nullable: false
        },
        contactphone: {
            type: integer
        }
    },
    usergroups: {
        id: {
            type: increments
        },
        userid: {
            type: integer,
            references: 'id',
            inTable: 'users',
            onDelete: cascade
        },
        groupid: {
            type: integer,
            references: 'id',
            inTable: 'groups',
            onDelete: cascade
        }
    },
    tokens: {
        id: {
            type: increments
        },
        userid: {
            type: integer,
            references: 'id',
            inTable: 'users',
            onDeleet: cascade,
            nullable: false
        },
        token: {
            type: string,
            nullable: false,
            unique: true
        },
        date: {
            type: date,
            nullable: false
        }
    },
    groupuserclasses: {
        id: {
            type: increments
        },
        title: {
            type: string,
            maxlen: 50,
            unique: true,
            nullable: false
        },
        description: {
            type: string,
            maxlen: 50
        }
    },
    locations: {
        id: {
            type: increments
        },
        groupid: {
            type: integer,
            references: 'id',
            inTable: 'groups',
            onDelete: restrict, // prevent accidental deletion of a location
            nullable: false
        },
        state: {
            type: string,
            nullable: false
        },
        city: {
            type: string,
            nullable: false
        },
        address: {
            type: string,
            nullable: false
        },
        zipcode: {
            type: integer,
            nullable: false
        },
        phonenumber: {
            type: integer,
            nullable: false
        }
    },
    areas: {
        id: {
            type: increments
        },
        title: {
            type: string,
            nullable: false,
            // TODO: If we have one database for the entire site it doesn't make sense to have this be unique, each company can have identically named places
            unique: false
        }
    },
    arealocations: {
        id: {
            type: increments
        },
        locationsid: {
            type: integer,
            references: 'id',
            inTable: 'locations',
            onDelete: cascade
        },
        areaid: {
            type: integer,
            references: 'id',
            inTable: 'areas',
            onDelete: cascade
        }
    },
    userpermissions: {
        id: {
            type: increments
        },
        locationsid: {
            type: integer,
            references: 'id',
            inTable: 'locations',
            onDelete: cascade,
            nullable: false
        },
        usersid: {
            type: integer,
            references: 'id',
            inTable: 'users',
            onDelete: cascade,
            nullable: false
        }
    },
    groupsettings: {
        id: {
            type: increments
        },
        groupsid: {
            type: integer,
            references: 'id',
            inTable: 'groups',
            nullable: false,
            unique: true
        },
        allowalltocreateshifts: {
            type: boolean,
            defaultTo: false
        },
        requireshiftconfirmation: {
            type: boolean,
            defaultTo: true
        }
    },
    groupadditionalinformation: {
        id: {
            type: increments
        },
        groupsid: {
            type: integer,
            references: 'id',
            inTable: 'groups',
            onDelete: cascade,
            nullable: false
        },
        title: {
            type: string,
            nullable: false
        }
    },
    groupuserinformation: {
        id: {
            type: increments
        },
        usersid: {
            type: integer,
            references: 'id',
            inTable: 'users',
            onDelete: cascade,
            nullable: false
        },
        groupadditionalinformationid: {
            type: integer,
            references: 'id',
            inTable: 'groupadditionalinformation',
            onDelete: cascade,
            nullable: false
        },
        data: {
            type: string,
            nullable: false
        }
    },
    grouppermissions: {
        id: {
            type: increments
        },
        groupsettingsid: {
            type: integer,
            references: 'id',
            inTable: 'groupsettings',
            onDelete: cascade,
            nullable: false
        },
        decription: {
            type: string,
            nullable: false
        },
        permissionlevel: {
            // TODO: What is this table for? it doesnt link to a user or location
            type: integer,
            nullable: false
        }
    }
};

module.exports = {
    Schema: Schema
};