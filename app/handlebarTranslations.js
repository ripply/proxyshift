var I18n = require('i18n-js');

//I18n.translations = {};

I18n.translations["en"] = {
    welcome: {
        to: {
            proxyshift: 'Welcome to Proxy Shift!'
        },
        resetpassword: 'Reset your password'
    },
    invites: {
        join: {
            group: "You've been invited to join {{1}}'s Proxy Shift group by {{2}}"
        }
    },
    accept: {
        invitation: {
            thisaccount: {
                clickhere: 'to accept this invitation on this account click here'
            }
        }
    },
    date: {
        formats: {
            ordinal_day: "%B %{day}"
        }
    },
    you: {
        already: {
            loggedin: {
                as: 'You are already logged in as {{1}}'
            }
        }
    },
    or: {
        signin: {
            other: {
                existingaccount: 'or signin to another existing account'
            }
        },
        create: {
            new: {
                account: {
                    caps: 'Or create a new account'
                }
            }
        }
    },
    to: {
        getstarted: {
            signin: {
                anotherexistingaccount: {
                    orcreateanewone: 'To get started either sign into an existing Proxy Shift account or create a new one'
                }
            }
        }
    },
    signin: {
        existing: {
            proxyshift: {
                account: 'Signin to an existing Proxy Shift account'
            }
        }
    },
    invalid: {
        usernameorpassword: {
            caps: 'INVALID USERNAME/PASSWORD'
        }
    },
    form: {
        username: 'Username',
        password: 'Password',
        verifypassword: 'Verify password',
        lastname: 'Lastname',
        firstname: 'Firstname',
        email: 'Email',
        secretquestion: 'Secret question',
        secretanswer: 'Secret answer',
        phone: {
            home: 'Phone (Home)',
            mobile: 'Phone (Mobile)',
            pager: 'Pager number'
        }
    },
    message: {
        internalerror: 'Internal error',
        password: {
            notmatch: "Passwords don't match",
            invalid: 'Password is invalid'
        }
    }
};
