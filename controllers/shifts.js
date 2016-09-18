var models = require('../app/models');
var Bookshelf = models.Bookshelf;
var knex = models.knex;
var Promise = require('bluebird');
var moment = require('moment');
var notifications = require('../app/notifications');
var time = require('../app/time.js');
var controllerCommon = require('./controllerCommon');
var _ = require('underscore');
var grabNormalShiftRange = controllerCommon.grabNormalShiftRange;
var appLogic = require('../app');

var variables = require('./variables');

var managingPermissionLevel = require('./variables').managingLocationMember;


var getMark = controllerCommon.getMark;
var clearMarks = controllerCommon.clearMarks;
var simpleGetSingleModel = controllerCommon.simpleGetSingleModel;
var postModel = controllerCommon.postModel;
var patchModel = controllerCommon.patchModel;
var deleteModel = controllerCommon.deleteModel;
var updateModel = controllerCommon.updateModel;
var getModelKeys = controllerCommon.getModelKeys;
var error = controllerCommon.error;
var clientError = controllerCommon.clientError;
var clientCreate = controllerCommon.clientCreate;
var clientStatus = controllerCommon.clientStatus;
var getCurrentTimeForInsertionIntoDatabase = controllerCommon.getCurrentTimeForInsertionIntoDatabase;
var createSelectQueryForAllColumns = controllerCommon.createSelectQueryForAllColumns;

var shiftAndAppliedSelectKeys = _.clone(models.Shifts.selectkeys);
// LEFT OUTER JOIN TO GET THIS WHERE RECINDED = FALSE
shiftAndAppliedSelectKeys.push('shifts.id as id');
shiftAndAppliedSelectKeys.push('shiftapplications.id as applied');
shiftAndAppliedSelectKeys.push('shiftapplicationacceptdeclinereasons.accept as approved');
shiftAndAppliedSelectKeys.push('ignoreshifts.id as ignored');

module.exports = {
    route: '/api/v1/shifts',
    '/after/:after/before/:before': {
        'get': { // return all shifts you are connected to
            auth: ['mark if user is a group owner or privileged location member for this shift'],// logged in
            route: function(req, res) {
                getShifts(req, res);
            }
        }
    },
    '/all': {
        'get': { // get all shifts you can register for
            // auth: // logged in
            route: function(req, res) {
                getAllShifts(req, res, true, false, false, false, true, false);
            }
        }
    },
    '/noignored/all': {
        'get': { // get all shifts you can register for
            // auth: // logged in
            route: function(req, res) {
                getAllShifts(req, res, true, false, false, true, true, false);
            }
        }
    },
    '/all/dividers': {
        'get': { // get all shifts you can register for
            // auth: // logged in
            route: function(req, res) {
                getAllShifts(req, res, true, false, true, false, true, false);
            }
        }
    },
    '/noignored/all/dividers': {
        'get': { // get all shifts you can register for
            // auth: // logged in
            route: function(req, res) {
                getAllShifts(req, res, true, false, true, true, true, false);
            }
        }
    },
    '/all/appliedonly': {
        'get': {
            //auth: [],
            route: function allShiftsAcceptedOnly(req, res) {
                getAllShifts(req, res, true, true, false, false, true, false);
            }
        }
    },
    '/expired/all/appliedonly': {
        'get': {
            //auth: [],
            route: function allShiftsAcceptedOnly(req, res) {
                getAllShifts(req, res, true, true, false, true, true, false, getStartOfFiscalYear(req), time.nowInUtc());
            }
        }
    },
    '/noignored/all/appliedonly': {
        'get': {
            //auth: [],
            route: function allShiftsAcceptedOnly(req, res) {
                getAllShifts(req, res, true, true, false, true, true, false);
            }
        }
    },
    '/all/appliedonly/dividers': {
        'get': {
            //auth: [],
            route: function allShiftsAcceptedOnly(req, res) {
                getAllShifts(req, res, true, true, true, false, true, false);
            }
        }
    },
    '/noignored/all/appliedonly/dividers': {
        'get': {
            //auth: [],
            route: function allShiftsAcceptedOnly(req, res) {
                getAllShifts(req, res, true, true, true, true, true, false);
            }
        }
    },
    '/new': {
        'get': { // get new shifts that are not expired
            // auth: // logged in
            route: function(req, res) {
                var now = new Date();
                var range = grabNormalShiftRange(now);
                var after = now;
                models.Shift.query(function(q) {
                    // grab groups the user is a part of
                    var relatedGroupsSubQuery =
                        knex.select('usergroups.group_id as wat')
                            .from('usergroups')
                            .where('usergroups.user_id', '=', req.user.id)
                            .union(function() {
                                this.select('groups.id as wat')
                                    .from('groups')
                                    .where('groups.user_id', '=', req.user.id);
                            });

                    // grab locations related to all of those groups
                    var relatedLocationsSubQuery =
                        knex.select('locations.id as locationid')
                            .from('locations')
                            .whereIn('locations.group_id', relatedGroupsSubQuery);

                    // grab all your user classes
                    var relatedUserClassesSubQuery =
                        knex.select('groupuserclasses.id as groupuserclassid')
                            .from('groupuserclasses')
                            .innerJoin('groupuserclasstousers', function() {
                                this.on('groupuserclasstousers.groupuserclass_id', '=', 'groupuserclasses.id');
                            })
                            .where('groupuserclasstousers.user_id', '=', req.user.id)
                            .whereIn('groupuserclasses.group_id', relatedGroupsSubQuery);

                    // grab all shifts at locations/sublocations that are one of your job types

                    q.select('shifts.*')
                        .from('shifts')
                        .innerJoin('locations', function() {
                            this.on('shifts.location_id', '=', 'locations.id');
                        })
                        .where(function() {
                            this.where('shifts.end', '>=', after);
                        })
                        .whereIn('locations.id', relatedLocationsSubQuery)
                        .whereIn('shifts.groupuserclass_id', relatedUserClassesSubQuery)
                        .union(function() {
                            this.select('shifts.*')
                                .from('shifts')
                                .innerJoin('sublocations', function() {
                                    this.on('shifts.sublocation_id', '=', 'sublocations.id');
                                })
                                .where(function() {
                                    this.where('shifts.end', '>=', after);
                                })
                                .whereIn('shifts.groupuserclass_id', relatedUserClassesSubQuery)
                                .whereIn('sublocations.location_id', relatedLocationsSubQuery);
                        });
                })
                    .fetchAll()
                    .then(function(shifts) {
                        if (shifts) {
                            // TODO: Fetch related group user class information
                            res.json(shifts.toJSON());
                        } else {
                            res.json([]);
                        }
                    })
                    .catch(function(err) {
                        error(req, res, err);
                    })
            }
        },
    },
    '/create': {
        'post': {
            //auth: ['anyone'],
            route: function postCreateShifts(req, res) {
                /*
                // req.body.shifts come in as this
                [
                    {
                        location_id: '',
                        sublocation_id: '',
                        title: '',
                        description: '',
                        start: '',
                        end: '',
                        groupuserclass_id: '',
                        timezone_id: '', // optional
                        count: ''
                    }
                ]
                // transform it into what we want
                [
                    {
                        unsafe: {...}
                    }
                ]
                */
                var shifts = [];
                if (req.body && req.body instanceof Array) {
                    _.each(req.body, function(shift) {
                        shifts.push({
                            unsafe: shift,
                            safe: {
                                user_id: req.user.id
                            }
                        });
                    });
                }
                createShifts(req, res, shifts);
            }
        }
    },
    '/managing': {
        'get': { // get all shifts you can manage that have not expired
            // auth: ['anyone']
            route: function(req, res) {
                getShiftsYouAreManaging(req, res, false, false, false, time.nowInUtc());
            }
        }
    },
    '/expired/pending/managing': {
        'get': { // get all shifts you can manage that have not expired
            // auth: ['anyone']
            route: function(req, res) {
                getShiftsYouAreManaging(req, res, true, false, false, getStartOfFiscalYear(req), time.nowInUtc());
            }
        }
    },
    '/expired/noapplications/managing': {
        'get': { // get all shifts you can manage that have not expired
            // auth: ['anyone']
            route: function(req, res) {
                getShiftsYouAreManaging(req, res, false, true, false, getStartOfFiscalYear(req), time.nowInUtc());
            }
        }
    },
    '/expired/approved/managing': {
        'get': { // get all shifts you can manage that have not expired
            // auth: ['anyone']
            route: function(req, res) {
                getShiftsYouAreManaging(req, res, false, false, true, getStartOfFiscalYear(req),time.nowInUtc());
            }
        }
    },
    '/mine': {
        'get': {
            route: function(req, res) {
                getMyUnexpiredCallouts(req, res, false);
            }
        }
    },
    '/noignored/mine': {
        'get': {
            route: function(req, res) {
                getMyUnexpiredCallouts(req, res, true);
            }
        }
    },
    '/expired/mine': {
        'get': {
            route: function(req, res) {
                getMyExpiredCallouts(req, res, false);
            }
        }
    },
    '/noignored/expired/mine/': {
        'get': {
            route: function(req, res) {
                getMyExpiredCallouts(req, res, true);
            }
        }
    },
    '/application/:shiftapplication_id': {
        'get': { // gets a shift application
            auth: ['managing shift'],
            route: function(req, res) {
                simpleGetSingleModel('ShiftApplication', {
                        id: req.params.shiftapplication_id
                    },
                    req,
                    res
                );
            }
        },
        'post': { // approves a shift applicataion
            auth: ['managing shift'],
            route: function(req, res) {
                return acceptOrDeclineShiftApplication(req, res, true);
            }
        },
        'patch': { // rejects a shift application
            auth: ['managing shift'],
            route: function(req, res) {
                return acceptOrDeclineShiftApplication(req, res, false);
            }
        },
        'delete': { // rejects a shift application
            auth: ['managing shift'],
            route: function(req, res) {
                return acceptOrDeclineShiftApplication(req, res, false);
            }
        }
    },
    '/:shift_id': {
        'get': { // get info about a shift
            auth: ['mark if user is a group owner or privileged location member for this shift'], // connected to shift (part of location) or managing the shift
            route: function(req, res) {
                getShifts(req, res);
            }
        },
        'patch': { // update a shift
            auth: ['managing shift'], // must be managing the shift
            route: function(req, res) {
                patchModel(
                    'Shift',
                    {
                        id: req.params.shift_id
                    },
                    req,
                    res,
                    'Success',
                    [
                        'id',
                        'user_id'
                    ]
                );
            }
        },
        'delete': { // delete a shift
            auth: ['managing shift'],// must be managing the shift
            route: function(req, res) {
                deleteModel(
                    'Shift',
                    {
                        id: req.params.shift_id
                    },
                    req,
                    res,
                    'Success'
                );
            }
        }
    },
    '/:shift_id/notify': {
        'post': { // sends out notification
            auth: ['mark groupuserclass options for shift'],
            route: function(req, res) {
                var canSendNotifications = getMark(req, 'shift.cansendnotification', req.params.shift_id);
                var requiremanagerapproval= getMark(req, 'shift.requiremanagerapproval', req.params.shift_id);

                clearMarks(req);
            }
        }
    },
    '/:shift_id/register': {
        'post': {
            auth: ['user can apply for shift'],
            route: function(req, res) {
                // confirm that user can register for this shift
                // and shift has no user attached
                // if settings allow queueing for shifts and need manager approval
                // add to list
                // then send notification to managers
                // we should receive a notification when a manager approves

                // check that the user has not already applied for shift
                // then:
                // the user should be able to apply for this shift
                // if the user requires manager approval:
                //  - it should not matter if the shift has already been applied for
                // if the user does not then
                //  - only one person can apply for the shift?
                //  - they can still apply to be next in line

                return Bookshelf.transaction(function (t) {
                    // figure out how many people have applied to the shift
                    // and exactly who is approved - if any
                    var sqlOptions = {
                        transacting: t
                    };
                    console.log('get approved denied users for shift');
                    return appLogic.getApprovedDeniedUsersForShift(
                        req.user.id,
                        req.params.shift_id,
                        sqlOptions,
                        function getApprovedDeniedUsersForShiftSuccess(applicationsExist,
                                                                       approvedApplicant,
                                                                       approvedApplicationApplicationId,
                                                                       shiftApplicants,
                                                                       userHasOutstandingApplication,
                                                                       otherUsersHaveAppliedBeforeUser,
                                                                       shiftInfo
                        ) {
                            if (shiftApplicants.hasOwnProperty(req.user.id)) {
                                // already exists
                                return clientCreate(req, res, 200, shiftApplicants[req.user.id]);
                            }
                            if (shiftInfo.requiremanagerapproval) {
                                // apply for shift
                                // does not exist
                                // create it!
                                return createShiftApplication(false);
                            } else {
                                // user does not need manager approval to apply for the shift
                                if (otherUsersHaveAppliedBeforeUser) {
                                    // other users have already applied and have not recinded their shift...
                                    // we need to create an application but not automatically approve it
                                    return createShiftApplication(false);
                                } else {
                                    // no other users have applied, create this users shift application and approve it!
                                    return createShiftApplication(true);
                                }
                            }

                            function createShiftApplication(autoaccept) {
                                var shiftApplicationTime = getCurrentTimeForInsertionIntoDatabase();
                                return models.ShiftApplication.forge({
                                    shift_id: req.params.shift_id,
                                    user_id: req.user.id,
                                    date: shiftApplicationTime,
                                    recinded: false
                                })
                                    .save(null, sqlOptions)
                                    .tap(function createShiftApplicationSuccess(model) {
                                        console.log('2');
                                        return models.IgnoreShift.query(function(q) {
                                            q.select()
                                                .from('ignoreshifts')
                                                .where('shift_id', '=', req.params.shift_id)
                                                .where('user_id', '=', req.user.id)
                                                .delete();
                                        })
                                            .fetchAll(sqlOptions)
                                            .tap(function(ignoreShifts) {
                                                console.log('2');
                                                if (autoaccept) {
                                                    return models.ShiftApplicationAcceptDeclineReason.forge({
                                                        accept: true,
                                                        autoaccepted: true,
                                                        shiftapplication_id: model.get('id'),
                                                        user_id: null, // system
                                                        date: shiftApplicationTime,
                                                        reason: null
                                                    })
                                                        .save(null, sqlOptions)
                                                        .tap(function createShiftApplicationAutoAcceptSuccess(shiftapplicationacceptdeclinereason) {
                                                            console.log('3');
                                                            // send success notification to user and managers
                                                            // there will be no declined users because this was an auto accepted shift
                                                            clientCreate(req, res, 201, model.get('id'));
                                                            console.log('4');
                                                            appLogic.sendNotificationAboutAutoApprovedShift(
                                                                req.user.id,
                                                                req.params.shift_id,
                                                                shiftInfo.location_title,
                                                                shiftInfo.sublocation_title,
                                                                shiftInfo.shift_start,
                                                                shiftInfo.shift_end,
                                                                shiftInfo.shift_timezone,
                                                                function createShiftApplicationAutoAcceptSendNotificationSuccess() {

                                                                },
                                                                function createShiftApplicationAutoAcceptSendNotificationError(err) {
                                                                    // TODO: HOW TO NOTIFY USER THAT NOTIFICATIONS FAILED?
                                                                }
                                                            );
                                                        });
                                                } else {
                                                    console.log('4');
                                                    triggerShiftApplicationNotification(req.params.shift_id, model.get('id'));
                                                    console.log('5');
                                                    clientCreate(req, res, 201, model.get('id'));
                                                }
                                            });
                                    });
                            }
                        }, function getApprovedDeniedUsersForShiftError(err) {
                            // TODO:?
                            error(req, res, err);
                        }
                    );
                })
                    .catch(function (err) {
                        error(req, res, err);
                    });
            }
        },
        'put': {
            auth: ['mark groupuserclass options for shift', 'user can apply for shift or has applied already'],
            route: unregisterForShift
        },
        'delete': {
            auth: ['mark groupuserclass options for shift', 'user can apply for shift or has applied already'],
            route: unregisterForShift
        }
    },
    '/:shift_id/cancel': {
        'post': {
            auth: ['user owns shift', 'or', 'managing shift'],
            route: function(req, res) {
                cancelShift(req, res, true);
            }
        },
        'delete': {
            auth: ['user owns shift', 'or', 'managing shift'],
            route: function(req, res) {
                cancelShift(req, res, false);
            }
        }
    },
    '/:shift_id/ignore': {
        'post': {
            auth: ['user can apply for shift or has applied already'],
            route: function(req, res) {
                var ignoreShiftData = {
                    shift_id: req.params.shift_id,
                    user_id: req.user.id
                };
                return Bookshelf.transaction(function(t) {
                    return models.IgnoreShift.forge(ignoreShiftData)
                        .fetch({
                            transacting: t
                        })
                        .then(function(ignoreShift) {
                            if (ignoreShift) {
                                // already ignored
                                res.sendStatus(200);
                            } else {
                                return models.IgnoreShift.forge(ignoreShiftData)
                                    .save(null, {
                                        transacting: t
                                    })
                                    .then(function(ignoredShift) {
                                        res.sendStatus(201)
                                    })
                                    .catch(function(err) {
                                        error(req, res, err);
                                    });
                            }
                        })
                        .catch(function(err) {
                            error(req, res, err);
                        });
                });
            }
        },
        'delete': {
            route: function(req, res) {
                return Bookshelf.transaction(function(t) {
                    return models.IgnoreShift.query(function(q) {
                        q.select()
                            .from('ignoreshifts')
                            .where('shift_id', '=', req.params.shift_id)
                            .where('user_id', '=', req.user.id)
                            .delete();
                    })
                        .fetchAll({
                            transacting: t
                        })
                        .then(function(ignoreShifts) {
                            res.sendStatus(200);
                        })
                        .catch(function(err) {
                            error(req, res, err);
                        });
                });
            }
        },
        'get': {
            route: function(req, res) {
                fetchIgnoredShifts(req, res);
            }
        }
    },
    createNewShift: createNewShift,
    getShiftsYouAreManaging: getShiftsYouAreManaging

};

function fetchIgnoredShifts(req, res, from, to) {
    models.IgnoreShift.query(function(q) {
        var query = q.select()
            .from('ignoreshifts')
            .where('ignoreshifts.user_id', '=', req.user.id)
            .innerJoin('shifts', function() {
                this.on('shifts.id', '=', 'ignoreshifts.shift_id');
            });
        if (from) {
            query = query.where('ignoreshifts.date', '>=', from);
        }
        if (to) {
            query = query.where('ignoreshifts.date', '<=', to);
        }
    })
        .fetchAll()
        .then(function(ignoredShifts) {
            if (ignoredShifts) {
                res.json(ignoredShifts.toJSON());
            } else {
                res.json([]);
            }
        })
        .catch(function(err) {
            err(req, res, err);
        });
}

function triggerShiftApplicationNotification(shift_id, shift_application_id) {
    // TODO: NO-OP for now
    // if user that registered requires manager approval then we need to ping all managers
    // push notifications and emails
    // if the user does not require manager approval, we still need to ping managers and the owner of the shift
    // letting them know that someone registered
    console.log('Triggering shift application notification...');
    appLogic.sendNewShiftApplication(shift_id, shift_application_id);
}

function triggerShiftApplicationRecinsionNotification(shiftapplication_id) {
    // TODO: NO-OP for now
}

function triggerShiftSuccessfullyAppliedNotification(shift_id) {
    // TODO: NO-OP for now
}

// TODO: This probably won't scale to massive numbers of devices, it should do some kind of limit per db fetch and then keep hitting db until done
function triggerShiftCanceledNotification(shift_id, next) {
    // Query shift and send a notification to everyone who applied as well as to the owner of the shift (unless they canceled it)
    return models.PushToken.query(function(q) {
        var select = ['pushtokens.token as token', 'pushtokens.platform as platform'];
        var query = q.select(select)
            .from('pushtokens')
            .innerJoin('tokens', function() {
                this.on('tokens.id', '=', 'pushtokens.token_id');
            })
            .innerJoin('shiftapplications', function() {
                this.on('shiftapplications.user_id', '=', 'tokens.user_id');
            })
            .innerJoin('shifts', function() {
                this.on('shifts.user_id', '=', 'shiftapplications.user_id');
            })
            .where('shifts.id', '=', shift_id)
            .union(function() {
                // consider owner of shift an applicant so that we can use a union instead of two queries
                this.select(select)
                    .from('pushtokens')
                    .innerJoin('tokens', function() {
                        this.on('tokens.user_id', '=', 'pushtokens.token_id');
                    })
                    .innerJoin('shifts', function() {
                        this.on('shifts.user_id', '=', 'tokens.user_id');
                    })
                    .where('shifts.id', '=', shift_id);
            });
        query = notifications.filterExpiredPushTokens(query);
    })
        .fetchAll()
        .then(function(shiftsInformation) {
            next();
            // innerjoin and get tokens for each user_id
            if (shiftsInformation) {
                var information = shiftsInformation.toJSON();
                var tokensByPlatform = {};
                for (var i = 0; i < information.length; i++) {
                    var platform = information.platform;
                    if (!tokensByPlatform.hasOwnProperty(platform)) {
                        tokensByPlatform[platform] = [];
                    }
                    tokensByPlatform[platform].push(information.token);
                }
                _.each(tokensByPlatform, function(tokens, service) {
                    notifications.send(service, tokens, undefined, "Shift " + shift_id + " has been canceled");
                });
            } else {
                // nothing to send
                console.log("No clients interested that shift " + shift_id + "  was canceled");
            }
        })
        .catch(function(err) {
            // TODO: Log error to console and notify last person who canceled shift since this is async
            next(err);
        });
}

function notify(data) {

}

function _getShiftsYouAreManagingFilterByDates(query, before, after) {
    if (before && after) {
        query.where('shifts.end', '>=', before)
            .andWhere('shifts.end', '<=', after);
    } else if (before) {
        query.where('shifts.end', '>=', before);
    } else if (after) {
        query.where('shifts.end', '<=', after);
    }
    return query;
}

/**
 * If a location is passed in
 * this method does not check if you are a privileged member of that location
 */
function getShiftsYouAreManaging(req, res, pendingApprovalsOnly, noApplicationsOnly, approvedOnly, startShift, endShift) {
    // this should grab groups you are a member of
    // join them with the specific location
    // grab user classes you are managing
    // join them with shifts
    var now = new Date();
    var range = grabNormalShiftRange(now, startShift, endShift);
    var before = range[0];
    //var after = new moment(startShift || now).unix();
    var after = range[1];
    var location_id = req.params.location_id;
    return models.Shift.query(function(q) {
        // grab all shifts at locations/sublocations that you are a manager of and managing
        var user_id = req.user.id;
        q.distinct()
            .select('shifts.*')
            .from('shifts')
            .leftJoin('sublocations', function() {
                this.on('sublocations.id', '=', 'shifts.sublocation_id');
            })
            .innerJoin('locations', function() {
                this.on('locations.id', '=', 'sublocations.location_id')
                    .orOn('locations.id', '=', 'shifts.location_id');
            })
            .innerJoin('groups', function() {
                this.on('groups.id', '=', 'locations.group_id');
            })
            .innerJoin('groupuserclasses', function() {
                this.on('groupuserclasses.group_id', '=', 'groups.id');
            })
            .leftJoin('usergroups', function() {
                this.on('usergroups.group_id', '=', 'groups.id');
            })
            .innerJoin('groupuserclasstousers', function() {
                this.on('groupuserclasstousers.groupuserclass_id', '=', 'groupuserclasses.id');
            })
            .where(function() {
                this.where('groupuserclasstousers.user_id', '=', user_id)
                    .orWhere('groups.user_id', '=', user_id);
            })
            .innerJoin('grouppermissions', function() {
                this.on('grouppermissions.id', '=', 'usergroups.grouppermission_id');
            })
            .leftJoin('managingclassesatlocations', function() {
                this.on('managingclassesatlocations.sublocation_id', '=', 'sublocations.id')
                    .orOn('managingclassesatlocations.location_id', '=', 'locations.id');
            })
            .where(function () {
                _getShiftsYouAreManagingFilterByDates(this, before, after);
            })
            .whereRaw('(\
        managingclassesatlocations.managing = ' + models.sqlTrue + ' and\
        grouppermissions.permissionlevel >= ' + managingPermissionLevel + ' and\
        (\
            managingclassesatlocations.sublocation_id = shifts.sublocation_id or\
        managingclassesatlocations.location_id = shifts.location_id\
    ) and\
        managingclassesatlocations.groupuserclass_id = shifts.groupuserclass_id\
    )')
            .orWhere('groups.user_id', '=', user_id);
        if (location_id) {
            q.andWhere('locations.id', '=', location_id);
        }
        if (false) { // applied only
            joinShiftApplications(q, user_id, true);
        } else if (approvedOnly) {
            joinApprovedOnly(q);
        } else if (pendingApprovalsOnly) {
            joinPendingApprovalsOnly(q);
        } else if (noApplicationsOnly) {
            joinNoApplicationsOnly(q);
        }
    })
        .fetchAll({
            withRelated: withRelatedShiftApplicationsAndUsers([
                'timezone'
            ])
        })
        .then(function(shifts) {
            if (shifts) {
                // TODO: Fetch related group user class information
                res.json(shifts.toJSON());
            } else {
                res.json([]);
            }
        })
        .catch(function(err) {
            error(req, res, err);
        });
}

function createNewShift(req, res) {
    // a shift needs a location or sublocation
    var location_id = req.params.location_id;
    var sublocation_id = req.params.sublocation_id;
    // make sure that start/end are integers
    if (isNaN(parseFloat(req.params.start)) ||
        isNaN(parseFloat(req.params.end))) {
        // normally we would just let the validation library do this
        // that way we can send error messages to the client
        // but since we have to do math on these before that
        // we gotta check
        clientError(req, res, 400, 'Invalid numbers');
        return;
    }

    var otherArgs = {};
    if (sublocation_id) {
        otherArgs.sublocation_id = sublocation_id;
    } else if (location_id) {
        // TODO: Should we support user specifying both a location and a sublocation in a route?
        // the issues with that happen when a sublocation is moved from one location to another
        // currently, that functionality is not supported, but if it were to be this would cause issues
        // as a shift would be part of one location but part of another location's sublocation
        otherArgs.location_id = location_id;
    } else {
        throw new Error("When creating a shift, a location or sublocation is required");
    }

    if (req.body.start > req.body.end) {
        clientError(req, res, 400, 'Invalid date range');
    } else {
        otherArgs = _.extend(otherArgs, {
            start: req.params.start,
            end: req.params.end,
            groupuserclass_id: req.params.groupuserclass_id
        });

        Bookshelf.transaction(function(t) {
            // get location.utcoffset
            // then convert shift to location's timezone
            return models.Timezone.query(function(q) {
                var query = q.select()
                    .from('timezones')
                    .innerJoin('locations', function() {
                        this.on('locations.timezone_id', '=', 'timezones.id');
                    });
                if (req.params.location_id) {
                    query = query.where('locations.id', '=', req.params.location_id);
                } else if (req.params.sublocation_id) {
                    query = query.innerJoin('sublocations', function() {
                        this.on('sublocations.location_id', '=', 'locations.id');
                    })
                        .where('sublocations.id', '=', req.params.sublocation_id);
                }
            })
                .fetch({
                    transacting: t
                })
                .then(function(location) {
                    if (location) {
                        // get shift timezone from location.timezone_id
                        var locationJson = location.toJSON();
                        otherArgs.timezone_id = locationJson.id;
                        otherArgs.user_id = req.user.id;
                        if (!otherArgs.timezone_id) {
                            clientError(req, res, 400, 'No timezone sent and no timezone found for location');
                        } else {
                            return createShiftsInTransaction(req, res, [
                                {
                                    safe: otherArgs,
                                    unsafe: req.body,
                                    validate: {}
                                },
                                t
                            ]);
                            /*
                            return postModel(
                                'Shift',
                                otherArgs,
                                req,
                                res,
                                [
                                    'id',
                                    'user_id',
                                    'location_id',
                                    'sublocation_id',
                                    'groupuserclass_id',
                                    'timezone_id',
                                    'notify'
                                ],
                                {
                                    transacting: t
                                }
                            );
                            */
                        }
                    } else {
                        // unknown sub/location_id
                        res.sendStatus(403);
                    }
                })
                .catch(function(err) {
                    error(req, res, err);
                });
        });
    }
}

function createShifts(req, res, shifts) {
    return Bookshelf.transaction(function(t) {
        return createShiftsInTransaction(req, res, shifts, t);
    })
        .catch(function(err) {
            var code = 500;
            var message = 'error';
            if (err.hasOwnProperty('code') && err.hasOwnProperty('message')) {
                code = err.code;
                message = err.message;
                clientError(req, res, code, message);
            } else {
                error(req, res, err);
            }
        });
}

function createShiftsInTransaction(req, res, shifts, transaction) {
    return createShiftsInTransactionRecurse(req, res, shifts, transaction, -1, {}, {});
}

const createShiftUntrustedKeys = _.keys(
    getModelKeys('Shift',
        [
            'id',
            'user_id',
            'location_id',
            'sublocation_id',
            'groupuserclass_id',
            'timezone_id',
            'notify'
        ]
    )
);

const createShiftUntrustedKeysAllowLocationSublocationGroupclass = _.keys(
    getModelKeys('Shift',
        [
            'id',
            'user_id',
            'notify'
        ]
    )
);

const alwaysDefaultNewShiftParameters = {
    canceled: false
};

function rejectTransaction(t, code, message) {
    return t.rollback({
        code: code,
        message: message
    });
}

const MAX_CREATE_SHIFTS = 50;

function createShiftsInTransactionRecurse(req, res, shifts, transaction, index, locationMap, sublocationMap) {
    if (shifts.length == 0) {
        return rejectTransaction(transaction, 400, 'No shifts sent');
    }
    if (index >= shifts.length) {
        res.sendStatus(200);
        return;
    }
    var shift;
    var safeUnsafe = ['unsafe', 'safe'];
    // first filter unsafe input
    if (index < 0) {
        // only validate data on the first one
        // we don't want to make separate database queries for each shift
        // what do we need to validate...
        // that the user has access to each group for each location/sublocation
        // and has access to create shifts there

        // first grab all the location_ids/sublocation_ids that are applicable to these shifts
        var creatingShiftsInLocations = {};
        var creatingShiftsInSublocations = {};
        var hasLocations = false;
        var hasSublocations = false;
        for (var i = 0; i < shifts.length; i++) {
            var shiftInformation = shifts[i];

            var location_id;
            var location_id_is_safe;
            var sublocation_id;
            var sublocation_id_is_safe;

            _.each(safeUnsafe, function(key) {
                var shiftMap = shiftInformation[key];
                if (shiftMap) {
                    if (shiftMap.location_id) {
                        location_id = shiftMap.location_id;
                        sublocation_id = undefined;
                        location_id_is_safe = key == 'safe';
                    } else if (shiftMap.sublocation_id) {
                        sublocation_id = shiftMap.sublocation_id;
                        location_id = undefined;
                        sublocation_id_is_safe = key == 'safe';
                    }
                }
            });

            if (location_id) {
                creatingShiftsInLocations[location_id] = true;
                hasLocations = true;
            } else if (sublocation_id) {
                hasSublocations = true;
                creatingShiftsInSublocations[sublocation_id] = true;
            } else{
                return rejectTransaction(transaction, 400, 'Missing location/sublocation for shift');
            }
        }

        // now grab the timezone for each location and sublocation
        return models.Location.query(function(q) {
            q = q.select([
                // NOTE: BOOKSHELF ISSUE, IF YOU DO 'AS ID' THEN BOOKSHELF GETS CONFUSED, DO NOT DO, OUTPUTS DUPLICATE THINGS
                'locations.id as location_id',
                'locations.timezone_id as timezone_id',
                'timezones.name as timezone_name',
                'sublocations.id as sublocation_id',
                'groupuserclasses.id as groupuserclass_id']
            )
                .leftJoin('sublocations', function() {
                    this.on('sublocations.location_id', '=', 'locations.id');
                })
                .leftJoin('groupuserclasses', function() {
                    this.on('groupuserclasses.group_id', '=', 'locations.group_id');
                })
                .leftJoin('timezones', function() {
                    this.on('timezones.id', '=', 'locations.timezone_id');
                });
            // TODO: Inner join with groupmembership and group ownership
            // filter to those locations/sublocations that user is trying to create shifts in
            if (hasLocations) {
                q = q.whereIn('locations.id', Object.keys(creatingShiftsInLocations));
                if (hasSublocations) {
                    q = q.orWhereIn('sublocations.id', Object.keys(creatingShiftsInSublocations));
                }
            } else if (hasSublocations) {
                q = q.whereIn('sublocations.id', Object.keys(creatingShiftsInSublocations));
            }
        })
            .fetchAll({
                transacting: transaction
            })
            .tap(function(locationsWithTimezones) {
                if (locationsWithTimezones) {
                    _.each(locationsWithTimezones.toJSON(), function(locationWithTimezone) {
                        var map;
                        var key;
                        if (locationWithTimezone.sublocation_id) {
                            map = sublocationMap;
                            key = locationWithTimezone.sublocation_id;
                        } else {
                            map = locationMap;
                            key = locationWithTimezone.location_id;
                        }
                        if (!map[key]) {
                            map[key] = {
                                groupuserclasses: {}
                            };
                        }
                        var value = map[key];
                        value.timezone_id = locationWithTimezone.timezone_id;
                        value.timezone_name = locationWithTimezone.timezone_name;
                        var groupuserclass_id = locationWithTimezone.groupuserclass_id;
                        if (groupuserclass_id) {
                            value.groupuserclasses[groupuserclass_id] = true;
                        }
                    });

                    return createShiftsInTransactionRecurse(req, res, shifts, transaction, 0, locationMap, sublocationMap);
                } else {
                    // no locations found...
                    return rejectTransaction(transaction, 400, 'Unknown locations');
                }
            });
    } else {
        // now we have timezoneIds for each location/sublocation
        // there should not be a case where a user cannot create a shift
        // so we do not need to do any kind of permission checking here
        // we will treat people like adults and let administrative processes handle things
        var newShifts = [];
        for (var j = index; j < shifts.length; j++) {
            shift = shifts[j];
            var validatedShift;

            _.each(safeUnsafe, function(key) {
                if (!shift[key]) {
                    shift[key] = {};
                }
            });

            validatedShift = _.pick(shift.unsafe, createShiftUntrustedKeysAllowLocationSublocationGroupclass);
            validatedShift = _.extend(validatedShift, shift.safe);

            // sublocation_id overrides location_id
            var shiftsLocationInfo = validatedShift.sublocation_id ?
                locationMap[validatedShift.sublocation_id] : locationMap[validatedShift.location_id];
            if (validatedShift.sublocation_id) {
                shiftsLocationInfo = sublocationMap[validatedShift.sublocation_id];
                validatedShift.location_id = undefined;
            } else if (validatedShift.location_id) {
                shiftsLocationInfo = locationMap[validatedShift.location_id];
                validatedShift.sublocation_id = undefined;
            } else {
                // this should have been validated before here anyway
                return rejectTransaction(transaction, 400, 'Missing location/sublocation for shift');
            }

            if (validatedShift.groupuserclass_id) {
                // validate that this groupuserclass_id is proper for this location/sublocation

                if (shiftsLocationInfo) {
                    if (!shiftsLocationInfo.groupuserclasses.hasOwnProperty(validatedShift.groupuserclass_id)) {
                        return rejectTransaction(transaction, 400, 'Unknown groupuserclass for shift');
                    }
                } else {
                    // user does not have access, or invalid input
                    return rejectTransaction(transaction, 400, 'Unknown location/sublocation for shift');
                }

                // groupuserclass_id is valid for this location/sublocation
            }

            if (!validatedShift.timezone_id) {
                // there must be a timezone_id for each shift
                // assume local time
                // if the user submitted an invalid timezone_id, it should be rejected by the database
                validatedShift.timezone_id = shiftsLocationInfo.timezone_id;
            }

            // convert input type of start/end if needed
            // Eg: user supplied UNIX time instead of Z encoded time
            var datesOk = true;
            _.each(['start', 'end'], function(key) {
                var value = validatedShift[key];
                var valueStr = (value + '');
                if (valueStr.indexOf('Z') >= 0 || valueStr.indexOf('T') >= 0) {
                    // for now not ok, javascript date, this will NOOP when we transition to storing times in database like this
                    validatedShift[key] = time.dateToUnix(value, shiftsLocationInfo.timezone_name);
                } else if (typeof(value) == 'number') {
                    // ok unix time, this will NOOP until we transition away from storing times in UNIX time in database
                    validatedShift[key] = time.unixToDate(value, shiftsLocationInfo.timezone_name);
                } else {
                    datesOk = false;
                }
            });

            if (!datesOk) {
                return rejectTransaction(transaction, 400, 'Unknown date format');
            }

            var count = 1;
            _.each(safeUnsafe, function(key) {
                if (shift[key].count) {
                    count = shift[key].count;
                }
            });

            if (count === undefined || count === null) {
                count = 1;
            }

            _.extend(validatedShift, alwaysDefaultNewShiftParameters);

            if (count) {
                if (count > MAX_CREATE_SHIFTS) {
                    return rejectTransaction(transaction, 400, 'Trying to create too many shifts');
                } else if (count > 0) {
                    for (var currentCount = 0; currentCount < count; currentCount++) {
                        newShifts.push(validatedShift);
                    }
                } else {
                    return rejectTransaction(transaction, 400, 'Shift with zero count passed in');
                }
            } else {
                newShifts.push(validatedShift);
            }
        }

        var shiftInserts = models.Shifts.forge(newShifts);
        return Promise.all(shiftInserts.invoke('save', undefined, {transacting: transaction}))
            .tap(function (createdShifts) {
                var results = [];
                var shift_ids = [];
                _.each(createdShifts, function(individualCreatedShift) {
                    results.push(individualCreatedShift.toJSON());
                    shift_ids.push(individualCreatedShift.get('id'));
                });
                appLogic.fireEvent('shiftsCreated', req.user.id, shift_ids);
                clientCreate(req, res, 201, results);
            })
            .catch(function(err) {
                console.log(err);
                return rejectTransaction(transaction, 400, err);
            });
    }

}

function getAllShifts(req, res, hideCanceled, appliedOnly, showDividers, hideIgnored, hideDisconnectedShifts, showPrevious, shiftStart, shiftEnd) {
    var now = new Date();
    var start = moment(shiftStart || now);
    var finishedShifts = start.unix();
    if (showPrevious && !shiftStart) {
        // show this last weeks shifts
        start.subtract('1', 'week');
    } else {
        // only show shifts that have not ended yet
    }
    start = start.unix();

    var range = grabNormalShiftRange(now, start, shiftEnd);
    var before = range[0];
    var after = range[1];
    models.Shift.query(function(q) {
        // grab groups the user is a part of
        var relatedGroupsSubQuery =
            knex.select('usergroups.group_id as wat')
                .from('usergroups')
                .where('usergroups.user_id', '=', req.user.id)
                .union(function() {
                    this.select('groups.id as wat')
                        .from('groups')
                        .where('groups.user_id', '=', req.user.id);
                });

        // grab locations related to all of those groups
        var relatedLocationsSubQuery =
            knex.select('locations.id as locationid')
                .from('locations')
                .whereIn('locations.group_id', relatedGroupsSubQuery);

        // grab all your user classes
        var relatedUserClassesSubQuery =
            knex.select('groupuserclasses.id as groupuserclassid')
                .from('groupuserclasses')
                .innerJoin('groupuserclasstousers', function() {
                    this.on('groupuserclasstousers.groupuserclass_id', '=', 'groupuserclasses.id');
                })
                .where('groupuserclasstousers.user_id', '=', req.user.id)
                .whereIn('groupuserclasses.group_id', relatedGroupsSubQuery);

        // grab all shifts at locations/sublocations that are one of your job types

        var query = q.select(shiftAndAppliedSelectKeys)
            .from('shifts')
            .leftJoin('sublocations', function() {
                this.on('shifts.sublocation_id', '=', 'sublocations.id');
            })
            .leftJoin('locations', function() {
                this.on('shifts.location_id', '=', 'locations.id')
                    .orOn('sublocations.location_id', '=', 'locations.id');
            })
            .where(function() {
                this.where('shifts.start', '>=', before)
                    .orWhere(function() {
                        this.where('shifts.end', '>=', before)
                            .andWhere('shifts.end', '<=', after);
                    });
            })
            .where(function() {
                this.whereIn('locations.id', relatedLocationsSubQuery)
                    .orWhereIn('sublocations.location_id', relatedLocationsSubQuery);
            })
            .whereIn('shifts.groupuserclass_id', relatedUserClassesSubQuery)
            .joinRaw(
                'inner join userpermissions on userpermissions.id = (' +
                    'select id from userpermissions ' +
                    'where ( ' +
                        'userpermissions.location_id = locations.id ' +
                        'or userpermissions.sublocation_id = sublocations.id ' +
                        'or userpermissions.location_id = shifts.location_id ' +
                    ') ' +
                    'and userpermissions.user_id = ? ' +
                    'and userpermissions.subscribed = ? ' +
                    'limit 1 ' +
                ')'
            , [req.user.id, models.sqlTrue]);
        joinShiftApplications(query, req.user.id, appliedOnly);
        joinIgnoreShifts(query, req.user.id, hideIgnored);
        if (hideDisconnectedShifts) {
            // if a user is kicked from a group, they won't be able to know the location/sublocation name of a shift they called out on
            // so, don't send it to them
            query.innerJoin('usergroups', function() {
                this.on('usergroups.user_id', '=', req.user.id)
                    .andOn('usergroups.group_id', '=', 'locations.group_id');
            });
        }
        if (hideCanceled) {
            query = query.where('shifts.canceled', '=', models.sqlFalse);
        }
        query.orderBy('shifts.start');
    })
        .fetchAll({
            withRelated: [
                // in sqlite, if there are a lot of shifts, this will fail with a sqlite error
                // TODO: Check that this is not an issue with postgres
                // https://github.com/tgriesser/bookshelf/issues/707
                'timezone'
            ]
        })
        .then(function(shifts) {
            if (shifts) {
                // TODO: Fetch related group user class information
                if (showPrevious) {
                    // move expired shifts to the end of the array
                    var shiftLength = shifts.models.length;
                    // preallocate shift array
                    var oldShifts = new Array(shiftLength);
                    var newShifts = new Array(shiftLength);

                    var oldShiftsIndex = 0;
                    var newShiftsIndex = 0;
                    for (var i = 0; i < shiftLength; i++) {
                        var modelShift = shifts.models[i];
                        var modelShiftJson = modelShift.toJSON();
                        if (modelShiftJson.end < finishedShifts) {
                            oldShifts[oldShiftsIndex++] = modelShiftJson;
                        } else {
                            newShifts[newShiftsIndex++] = modelShiftJson;
                        }
                    }
                    if (newShiftsIndex !== 0) {
                        for (var i = 0; i < oldShiftsIndex; i++) {
                            newShifts[newShiftsIndex++] = oldShifts[i];
                        }
                        shifts = newShifts;
                    } else {
                        shifts = oldShifts;
                    }
                } else {
                    shifts = shifts.toJSON();
                }
                res.json(shifts);
            } else {
                res.json([]);
            }
        })
        .catch(function(err) {
            error(req, res, err);
        });
}

/**
 * Helper that does an outer join on the shiftapplications table
 * @param query
 * @returns {*}
 */
function joinShiftApplications(query, user_id, appliedOnly) {
    // TODO: Figure out how to use this query without recinded != true see:
    // https://stackoverflow.com/questions/9592875/sql-server-left-outer-join-with-top-1-to-select-at-most-one-row
    query = query.joinRaw(
        'left join shiftapplications on shiftapplications.id = (' +
            'select id from shiftapplications ' +
            'where shiftapplications.recinded <> ' + models.sqlTrue + ' ' +
            'and shiftapplications.shift_id = shifts.id ' +
            'and shiftapplications.user_id = ? ' +
            'order by shiftapplications.date desc ' +
            'limit 1 ' +
        ')',
        user_id
    )
        .joinRaw(
            'left join shiftapplicationacceptdeclinereasons on shiftapplicationacceptdeclinereasons.id = (' +
                'select id from shiftapplicationacceptdeclinereasons ' +
                'where shiftapplicationacceptdeclinereasons.shiftapplication_id = shiftapplications.id ' +
                'order by shiftapplicationacceptdeclinereasons.date desc ' +
                'limit 1 ' +
            ')'
    );
    if (appliedOnly) {
        query = query.whereNotNull('shiftapplications.id');
    }
    return query;
}

/**
 * Helper that does an inner join and only returns shifts that are pending approval
 * @param query
 * @returns {*}
 */
function joinPendingApprovalsOnly(query) {
    return query.joinRaw(
        'inner join shiftapplications on shiftapplications.shift_id = shifts.id ' +
        'inner join shiftapplicationacceptdeclinereasons on shiftapplicationacceptdeclinereasons.id =(' +
            'select shiftapplicationacceptdeclinereasons.id from shiftapplicationacceptdeclinereasons ' +
            'order by shiftapplicationacceptdeclinereasons.date desc ' +
            'limit 1 ' +
        ')'
    )
        .where('shiftapplicationacceptdeclinereasons.accept', '<>', models.sqlTrue)
        .andWhere('shiftapplications.recinded', '<>', models.sqlTrue);
}

/**
 * Helper that does an inner join and only returns shifts that are approved
 * @param query
 * @returns {*}
 */
function joinApprovedOnly(query) {
    return query.joinRaw(
        'inner join shiftapplications on shiftapplications.shift_id = shifts.id ' +
        'inner join shiftapplicationacceptdeclinereasons on shiftapplicationacceptdeclinereasons.id =(' +
            'select shiftapplicationacceptdeclinereasons.id from shiftapplicationacceptdeclinereasons ' +
            'order by shiftapplicationacceptdeclinereasons.date desc ' +
            'limit 1 ' +
        ')'
    )
        .where('shiftapplicationacceptdeclinereasons.accept', '=', models.sqlTrue)
        .andWhere('shiftapplications.recinded', '<>', models.sqlTrue);
}

/**
 * Helper that does a left join and only returns shifts that do not have any applications
 * @param query
 * @returns {*}
 */
function joinNoApplicationsOnly(query) {
    return query.leftJoin('shiftapplications', function() {
        this.on('shiftapplications.shift_id', '=', 'shifts.id');
    })
        .whereNull('shiftapplications.shift_id')
        .andWhere('shiftapplications.recinded', '<>', models.sqlTrue);
}

/**
 * Should be called with
 * 'mark if user is a group owner or privileged location member for this shift'
 * @param req
 * @param res
 */
function getShifts(req, res, appliedOnly, showDividers) {
    // determine if the user is allowed to access this
    var privilegedshift = getMark(req, 'privilegedshift', req.params.shift_id);
    clearMarks(req);

    function applySearchConstraintsOnShiftsTable(query) {
        if (req.params.hasOwnProperty('shift_id')) {
            // getting specific shift
            return query.where('shifts.id', '=', req.params.shift_id);
        } else if (req.params.hasOwnProperty('before') &&
            req.params.hasOwnProperty('after')) {
            return query.where(function() {
                this.where('shifts.start', '<=', req.params.before)
                    .orWhere('end', '>=', req.params.after);
            });
        } else {
            throw new Error("No parameters passed in");
        }
    }

    //return Bookshelf.transaction(function(t) {
        var query = null;
        if (privilegedshift) {
            // privileged user
            // has to allow fetching of managing shifts
            query = models.Shift.query(function (q) {
                // there does not need to be any complex
                // security checking in this method
                // the auth method has already performed the following checks:
                // that the user is either a group owner tied to the location or sublocation of the shift
                // or that the user is a privileged location member tied to the location or sublocation
                // therefore, since privileged location members should be able to access any shift they want
                // and they specifically accessed this one
                // we will allow it since the prerequisites have already been checked
                var query = q.select(shiftAndAppliedSelectKeys)
                    .from('shifts');
                query = applySearchConstraintsOnShiftsTable(query)
                    .leftJoin('sublocations', function () {
                        this.on('shifts.sublocation_id', '=', 'sublocations.id');
                    })
                    .innerJoin('locations', function () {
                        this.on('shifts.location_id', '=', 'locations.id')
                            .orOn('sublocations.location_id', '=', 'sublocations.location_id');
                    });
                query = joinShiftApplications(query, req.user.id)
                    .leftJoin('ignoreshifts', function() {
                        this.on('ignoreshifts.shift_id', '=', 'shifts.id')
                            .andOn('ignoreshifts.user_id', '=', req.user.id)
                    });
            })
        } else {
            // unprivileged user
            // only allows shifts they are elligible for
            query = models.Shift.query(function (q) {
                // grab groups the user is a part of
                var relatedGroupsSubQuery =
                    knex.select('usergroups.group_id as wat')
                        .from('usergroups')
                        .where('usergroups.user_id', '=', req.user.id)
                        .union(function () {
                            this.select('groups.id as wat')
                                .from('groups')
                                .where('groups.user_id', '=', req.user.id);
                        });

                // grab locations related to all of those groups
                var relatedLocationsSubQuery =
                    knex.select('locations.id as locationid')
                        .from('locations')
                        .whereIn('locations.group_id', relatedGroupsSubQuery);

                // grab all your user classes
                var relatedUserClassesSubQuery =
                    knex.select('groupuserclasses.id as groupuserclassid')
                        .from('groupuserclasses')
                        .innerJoin('groupuserclasstousers', function () {
                            this.on('groupuserclasstousers.groupuserclass_id', '=', 'groupuserclasses.id');
                        })
                        .where('groupuserclasstousers.user_id', '=', req.user.id)
                        .whereIn('groupuserclasses.group_id', relatedGroupsSubQuery);

                // grab all shifts at locations/sublocations that are one of your job types

                var query = q.select(shiftAndAppliedSelectKeys)
                    .from('shifts');
                query = applySearchConstraintsOnShiftsTable(query)
                    //.where('shifts.id', '=', req.params.shift_id)
                    .innerJoin('locations', function () {
                        this.on('shifts.location_id', '=', 'locations.id');
                    })
                    /*.where(function() {
                     this.where('shifts.start', '<=', before)
                     .orWhere('shifts.end', '>=', after);
                     })*/
                    .whereIn('locations.id', relatedLocationsSubQuery)
                    .whereIn('shifts.groupuserclass_id', relatedUserClassesSubQuery)
                    .leftJoin('ignoreshifts', function() {
                        this.on('ignoreshifts.shift_id', '=', 'shifts.id')
                            .andOn('ignoreshifts.user_id', '=', req.user.id)
                    });
                joinShiftApplications(query, req.user.id, appliedOnly)
                    .union(function () {
                        var query = this.select(shiftAndAppliedSelectKeys)
                            .from('shifts');
                        query = applySearchConstraintsOnShiftsTable(query)
                            //.where('shifts.id', '=', req.params.shift_id)
                            .innerJoin('sublocations', function () {
                                this.on('shifts.sublocation_id', '=', 'sublocations.id');
                            })
                            /*.where(function() {
                             this.where('shifts.start', '<=', before)
                             .orWhere('shifts.end', '>=', after);
                             })*/
                            .whereIn('shifts.groupuserclass_id', relatedUserClassesSubQuery)
                            .whereIn('sublocations.location_id', relatedLocationsSubQuery);
                        joinShiftApplications(query, req.user.id, appliedOnly)
                            .leftJoin('ignoreshifts', function() {
                                this.on('ignoreshifts.shift_id', '=', 'shifts.id')
                                    .andOn('ignoreshifts.user_id', '=', req.user.id)
                            });
                    });
            });
        }

        var withRelatedOptions = {
            //transacting: t
        };

        if (privilegedshift) {
            // people who have privileged access to shifts (group owners/managers)
            // will also be sent who has applied for the shift
            withRelatedOptions.withRelated = withRelatedShiftApplicationsAndUsers();
            withRelatedOptions.withRelated.push('ignoreshifts');
            withRelatedOptions.withRelated.push('timezone');
        } else {
            withRelatedOptions.withRelated = [
                'timezone'
            ];
        }

        clearMarks(req);

        return query
            .fetch(withRelatedOptions)
            .tap(function (shift) {
                if (!shift) {
                    // check if the shift exists
                    // TODO: This should be inside a transaction
                    // but putting it inside one ends up deadlocking the server
                    // not high priority this only checks if the user
                    // does not have access to the shift after the fact.
                    // very very low priority
                    return models.Shift.forge({
                        id: req.params.shift_id
                    })
                        .fetch({
                            //transacting: t
                        })
                        .tap(function (model) {
                            if (model) {
                                // shift exists
                                // they dont have access to it though
                                res.sendStatus(403);
                            } else {
                                // shift actually doesn't exist
                                // just send 200 empty object
                                res.sendStatus(204); // no content
                            }
                        })
                } else {
                    // determine if the user is a manager for this shift
                    // if they are not a manager
                    // we need to strip the 'shiftapplications'
                    // relation from the response
                    // non-managers should not be able to access that
                    var shiftJson = shift.toJSON();
                    shiftJson.privileged = privilegedshift;
                    res.json(shiftJson);
                }
            });
    /*
    })
        .then(function(model) {
            // do nothing, tap should take care of it
        })
        .catch(function (err) {
            error(req, res, err);
        });
    */
}

function cancelShift(req, res, cancel) {
    // get all shift keys
    var allShiftKeys = getModelKeys('Shift');
    // then delete just the canceled one so that we can set it as canceled
    delete allShiftKeys.canceled;
    req.body.canceled = cancel;
    return models.Shift.query(function(q) {
        q.select()
            .from('shifts')
            .where('shifts.id', '=', req.params.shift_id);
    })
        .fetch()
        .then(function(shift) {
            if (shift) {
                var alreadyCanceled = shift.get('canceled');
                if (!alreadyCanceled) {
                    patchModel('Shift', {
                            id: req.params.shift_id
                        },
                        req,
                        res,
                        'Success',
                        allShiftKeys,
                        // TODO: USE TRANSACTION
                        undefined,
                        function () {
                            return new Promise(function (resolve, reject) {
                                return models.ShiftCancelationReason.forge({
                                    user_id: req.user.id,
                                    shift_id: req.params.shift_id,
                                    reason: req.body.reason,
                                    date: time.nowInUtc()
                                })
                                    .save(undefined,
                                    {
                                        //transacting:t
                                    }
                                )
                                    .then(function (shift) {
                                        return triggerShiftCanceledNotification(req.params.shift_id, function(err) {
                                            // TODO: USE TRANSACTION SO FAILURE HERE REVERTS CANCELATION OF SHIFT
                                            resolve(err);
                                        });
                                    })
                                    .catch(function (err) {
                                        // TODO: FIX THIS TO USE A TRANSACTION SO FAILURE HERE REVERTS CANCELATION OF SHIFT
                                        // The shift has already been canceled
                                        // the reason has just not been logged due to an error
                                        // since the patch code does not use a transaction
                                        resolve(err);
                                    });
                            });
                        }
                    );
                } else {
                    res.sendStatus(200);
                }
            } else {
                // shouldn't really happen
                // auth rules should ensure that this shift exists
                res.sendStatus(403);
            }
        })
        .catch(function(err) {
            error(req, res, err);
        });
}

function withRelatedShiftApplicationsAndUsers(withRelated) {
    if (!withRelated) {
        withRelated = [];
    }
    withRelated.push('shiftapplications');
    withRelated.push('shiftapplications.shiftapplicationacceptdeclinereasons');
    withRelated.push({
        'shiftapplications.user': function(qb) {
            qb.columns(['users.id','users.username']);
        }
    });

    return withRelated;
}

function acceptOrDeclineShiftApplication(req, res, accept) {
    var reason = req.body.reason;
    if (!accept) {
        if (reason == null || reason.length == 0) {
            return clientError(req, res, 400, 'reason: required');
        }
    }
    return Bookshelf.transaction(function(t) {
        return models.ShiftApplicationAcceptDeclineReason.query(function(q) {
            q.select()
                .from('shiftapplicationacceptdeclinereasons')
                .where('shiftapplicationacceptdeclinereasons.shiftapplication_id', '=', req.params.shiftapplication_id)
                .orderBy('date', 'desc'); // desc so that always compares against latest one
        })
            .fetch({
                transacting: t
            })
            .tap(function(shiftapplicationacceptdeclinereason) {
                var action = false;
                if (shiftapplicationacceptdeclinereason) {
                    // there should be only one accept decline reason
                    var shiftAccepted = shiftapplicationacceptdeclinereason.get('accept');
                    action = (shiftAccepted == true || shiftAccepted == 1);
                    if (action != accept) {
                        // has already been declined...
                        // add a new one
                        return takeAction();
                    } else {
                        action = false;
                    }
                } else {
                    action = true
                }

                if (action) {
                    return takeAction();
                } else {
                    clientStatus(req, res, 200);
                }

                function takeAction() {
                    return models.ShiftApplicationAcceptDeclineReason.forge({
                        shiftapplication_id: req.params.shiftapplication_id,
                        accept: accept,
                        user_id: req.user.id,
                        date: getCurrentTimeForInsertionIntoDatabase(),
                        reason: reason,
                        autoaccepted: false
                    })
                        .save(null, {
                            transacting: t
                        })
                        .then(function(model) {
                            appLogic.shiftApplicationApprovalOrDenial(
                                req.params.shift_id,
                                model.get('id'),
                                accept
                            );
                            clientStatus(req, res, 200);
                        })
                        .catch(function(err) {
                            return error(req, res, err);
                        });
                }
            })
    });
}

function unregisterForShift(req, res) {
    var reason = req.body.reason;
    // TODO: Check for empty spaces etc
    if (!reason || reason == '') {
        clientError(req, res, 400, 'reason: required');
        return;
    }
    // make sure that the user is already registered

    // Transaction does not work with patchModel I think...
    //return Bookshelf.transaction(function(t) {
    return models.ShiftApplication.query(function(q) {
        q.select()
            .from('shiftapplications')
            .where('shiftapplications.user_id', '=', req.user.id)
            .andWhere('shiftapplications.shift_id', '=', req.params.shift_id)
            .andWhere(function() {
                this.where('shiftapplications.recinded', '!=', '1')
                    .orWhereNull('shiftapplications.recinded');
            });
    })
        .fetchAll({
            //transacting: t
        })
        .tap(function(shiftapplications) {
            var shiftApplicationKeys = Object.keys(getModelKeys('ShiftApplication'));
            if (shiftapplications) {
                var shiftapplicationIds = [];
                shiftapplications.each(function(shiftapplication) {
                    shiftapplicationIds.push(shiftapplication.get('id'));
                });
                // user has registered for shift
                // recind it
                var date = getCurrentTimeForInsertionIntoDatabase();
                models.ShiftApplication.query(function(q) {
                    q.select()
                        .from('shiftapplications')
                        .whereIn('id', shiftapplicationIds)
                        .update({
                            recinded: true,
                            recindeddate: date
                        });
                })
                    .fetch()
                    .tap(function() {
                        // TODO: Transaction
                        if (shiftapplicationIds[0]) {
                            return models.ShiftRescissionReason.forge({
                                user_id: req.user.id,
                                shiftapplication_id: shiftapplicationIds[0],
                                date: date,
                                reason: reason
                            })
                                .save()
                                .tap(function(shiftrecissionreason) {
                                    // shift has been recinded
                                    // send notifications
                                    clientCreate(req, res, 201, shiftrecissionreason.get('id'));
                                    return triggerShiftApplicationRecinsionNotification(shiftapplicationIds[0], shiftrecissionreason.get('id'));
                                })
                                .catch(function(err) {
                                    // TODO: Transaction so can rollback on possible error
                                    error(req, res, err);
                                    console.log(err);
                                });
                        } else {
                            res.sendStatus(200);
                        }
                    }
                );
            } else {
                // not even registered
                res.sendStatus(200);
            }
        })
        .catch(function(err) {
            error(req, res, err);
        });
    //});
}

function joinIgnoreShifts(q, user_id, hideIgnored) {
    q.leftJoin('ignoreshifts', function() {
        this.on('ignoreshifts.shift_id', '=', 'shifts.id')
            .andOn('ignoreshifts.user_id', '=', user_id);
    });
    if (hideIgnored) {
        q.whereNull('ignoreshifts.id');
    }
    return q;
}

const DAYS_IN_A_YEAR = 365;
const HOURS_IN_A_DAY = 24;
const MINUTES_IN_HOUR = 60;
const SECONDS_IN_MINUTE = 60;

const MYCALLOUTS_START = DAYS_IN_A_YEAR * HOURS_IN_A_DAY * MINUTES_IN_HOUR * SECONDS_IN_MINUTE / 2;

function getStartOfFiscalYear(req) {
    return moment().startOf('year').unix();
}

function getStartOfMyCallouts() {
    return time.nowInUtc() - MYCALLOUTS_START;
}

function getMyExpiredCallouts(req, res, hideIgnored) {
    getMyCallouts(req, res, hideIgnored, true);
}

function getMyUnexpiredCallouts(req, res, hideIgnored) {
    getMyCallouts(req, res, hideIgnored, false);
}

function getMyCallouts(req, res, hideIgnored, expiredOnly, start, end) {
    models.Shift.query(function(q) {
        q = q.select(shiftAndAppliedSelectKeys)
            .from('shifts')
            .leftJoin('sublocations', function() {
                this.on('shifts.sublocation_id', '=', 'sublocations.id');
            })
            .leftJoin('locations', function() {
                this.on('shifts.location_id', '=', 'locations.id')
                    .orOn('sublocations.location_id', '=', 'locations.id');
            })
            .where('shifts.user_id', '=', req.user.id);
        if (expiredOnly) {
            q.andWhere('shifts.end', '>=', start || getStartOfFiscalYear(req))
                .andWhere('shifts.end', '<=', end || time.nowInUtc());
        } else {
            q.andWhere('shifts.end', '>=', start || time.nowInUtc());
            if (end) {
                q.andWhere('shifts.end', '<=', end);
            }
        }
        joinShiftApplications(q, req.user.id, false);
        //if (hideDisconnectedShifts) {
            // if a user is kicked from a group, they won't be able to know the location/sublocation name of a shift they called out on
            // so, don't send it to them
            q.innerJoin('usergroups', function() {
                this.on('usergroups.user_id', '=', req.user.id)
                    .andOn('usergroups.group_id', '=', 'locations.group_id');
            });
        //}
        q = joinIgnoreShifts(q, req.user.id, hideIgnored);
    })
        .fetchAll({
            withRelated: [
                'timezone'
            ]
        })
        .then(function(shifts) {
            if (shifts) {
                res.send(shifts.toJSON());
            } else {
                res.sendStatus(204); // no content
            }
        })
        .catch(function(err) {
            error(req, res, err);
        });
}
