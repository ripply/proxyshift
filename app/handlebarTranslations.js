var I18n = require('i18n-js');

//I18n.translations = {};

I18n.translations["en"] = {
    welcome: {
        to: {
            proxyshift: 'Welcome to Proxy Shift!'
        },
        login: {
            header: 'Login to our site',
            description: 'Enter username and password to log on'
        },
        signup: {
            header: 'Sign up now',
            description: 'Create an account and join Proxy Shift'
        },
        getstarted: {
            download: {
                app: "To get started download our mobile app",
            },
            login: 'Or use the mobile web version'
        },
        resetpassword: 'Reset your password'
    },
    invites: {
        join: {
            group: "You've been invited to join {{1}}'s Proxy Shift group by {{2}}",
            expired: {
                headline: "Invitation to {{1}} expired",
                details: "Please contact {{1}} for another invitation"
            },
            success: "You have joined {{1}}'s Proxy Shift group",
            unknown: 'Unknown invitation'
        },
    },
    password: {
        reset: {
            success: "Password reset successfully",
            unknown: "Unknown password reset token",
            description: "Please type in your new password",
        }
    },
    accept: {
        invitation: {
            thisaccount: {
                clickhere: 'Accept invitation on your account ({{1}})'
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
        },
        already: {
            logged: {
                in: '...or use the account you are logged into ({{1}})'
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
        },
        submit: {
            join: {
                group: {
                    existing: 'Login and join {{1}}',
                    new: 'Sign me up and join {{1}}'
                }
            },
        }
    },
    message: {
        internalerror: 'Internal error',
        password: {
            notmatch: "Passwords don't match",
            invalid: 'Password is invalid'
        },
        username_or_email: {
            exists: 'Username or Email exists'
        }
    }
};
