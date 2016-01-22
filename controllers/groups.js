var models = require('../app/models'),
    time = require('../app/time'),
    utils = require('../app/utils'),
    appLogic = require('../app'),
    Promise = require('bluebird'),
    updateModel = require('./controllerCommon').updateModel,
    simpleGetSingleModel = require('./controllerCommon').simpleGetSingleModel,
    simpleGetListModel = require('./controllerCommon').simpleGetListModel,
    postModel = require('./controllerCommon').postModel,
    patchModel = require('./controllerCommon').patchModel,
    deleteModel = require('./controllerCommon').deleteModel,
    createSelectQueryForAllColumns = require('./controllerCommon').createSelectQueryForAllColumns,
    getPatchKeysWithoutBannedKeys = require('./controllerCommon').getPatchKeysWithoutBannedKeys,
    controllerCommon = require('./controllerCommon'),
    _ = require('underscore'),
    error = require('./controllerCommon').error,
    users = require('./users'),
    Bookshelf = models.Bookshelf;

module.exports = {
    route: '/api/groups',
    '/': {
        'get': { // list all groups a part of
            auth: ['anyone'], // anyone can query what groups they are a part of/own
            route: function(req, res) {
                models.Group.forge({id: req.params.group_id})
                    .fetchAll()
                    .then(function (groups) {
                        res.json(groups.toJSON());
                    })
                    .catch(function (err) {
                        error(req, res, err);
                    });
            }
        },
        'post': {
            auth: ['anyone'], // anyone can create a group
            route: function (req, res) {
                Bookshelf.transaction(function (t) {
                    return models.GroupSetting.forge({})
                        .save(null, {transacting: t})
                        .tap(function (groupsetting) {
                            return models.Group.forge({
                                groupsetting_id: groupsetting.id,
                                user_id: req.user.id,
                                name: req.body.name,
                                state: req.body.state,
                                city: req.body.city,
                                address: req.body.address,
                                zipcode: req.body.zipcode,
                                weburl: req.body.weburl,
                                contactemail: req.body.contactemail,
                                contactphone: req.body.contactphone
                            })
                                .save(null, {transacting: t})
                                .tap(function (group) {
                                    return models.UserGroup.forge({
                                        user_id: req.user.id,
                                        group_id: group.id
                                    })
                                        .save(null, {transacting: t});
                                })
                        })
                })
                    .then(function (group) {
                        res.json({id: group.get('id')});
                    })
                    .catch(function (err) {
                        error(req, res, err);
                    });
            }
        }
    },
    '/:group_id': {
        'get': {
            auth: ['group owner or group member'],
            route: function (req, res) {
                var user_id = req.user.id;
                models.Group.query(function (q) {
                    q.select('groups.*').innerJoin('usergroups', function () {
                        this.on('groups.id', '=', 'usergroups.group_id')
                            .andOn('usergroups.user_id', '=', user_id);
                    })
                        .union(function () {
                            this.select('*')
                                .from('groups')
                                .where('user_id', '=', user_id);
                        });
                })
                    .fetch()
                    .then(function (group) {
                        if (group) {
                            res.json(group.toJSON());
                        } else {
                            throw new Error("Error when fetching group id: " + req.params.group_id + " auth passed so group should exist");
                        }
                    })
                    .catch(function (err) {
                        error(req, res, err);
                    });
            }
        },
        'patch': { // update a group
            auth: ['group owner', 'or', 'privileged group member'], // must be owner or privileged member
            route: function(req, res) {
                patchModel('Group',
                    {
                        id: req.params.group_id
                    },
                    req,
                    res,
                    'Group details updated'
                );
            }
        },
        'delete': {
            auth: ['group owner'], // must be group owner
            route: function(req, res) {
                // Start a transaction
                Bookshelf.transaction(function (t) {
                    // delete all locations that depend on this group
                    return models.Location
                        .where({
                            group_id: req.params.group_id
                        })
                        .destroy({transacting: t})
                        .then(function () {
                            // then delete the group
                            return models.Group.forge({
                                id: req.params.group_id
                            })
                                .destroy({transacting: t})
                                .then(function(model) {
                                    if (model) {
                                        res.json({error: false, data: {message: 'Success'}});
                                    } else {
                                        res.status(403);
                                    }
                                })
                                .catch(function(err) {
                                    error(req, res, err);
                                })
                        })
                        .catch(function (err) {
                            error(req, res, err);
                        });
                });
            }
        }
    },
    '/:group_id/classes': {
        'get': { // get list of all class types
            auth: ['group owner', 'or', 'group member'], // must be a member/owner of the group
            route: function(req, res) {
                simpleGetListModel('GroupUserClass',
                    {
                        group_id: req.params.group_id
                    },
                    req,
                    res,
                    {
                        withRelated: 'grouppermission'
                    }
                );
            }
        },
        'post': { // create new class for group
            auth: ['group owner', 'or', 'privileged group member'], // must be an owner or privileged group member
            route: function(req, res) {
                postModel('GroupUserClass',
                    {
                        group_id: req.params.group_id
                    },
                    req,
                    res
                );
            }
        }
    },
    '/:group_id/classes/:class_id': {
        'get': { // get info about a class type
            auth: ['group owner', 'or', 'group member'], // must be a member/owner of the group
            route: function(req, res) {
                simpleGetSingleModel('GroupUserClass',
                    {
                        id: req.params.class_id,
                        group_id: req.params.group_id
                    },
                    req,
                    res
                );
            }
        },
        'patch': { // update class type in group
            auth: ['group owner', 'or', 'privileged group member'], // must be an owner or privileged group member
            route: function(req, res) {
                patchModel('GroupUserClass',
                    {
                        id: req.params.class_id,
                        group_id: req.params.group_id
                    },
                    req,
                    res,
                    'User class details updated'
                );
            }
        },
        'delete': { // delete class type in group
            auth: ['group owner', 'or', 'very privileged group member'],
            route: function(req, res) {
                deleteModel('GroupUserClass',
                    {
                        id: req.params.class_id,
                        group_id: req.params.group_id
                    },
                    req,
                    res,
                    'User class deleted'
                );
            }
        }
    },
    '/:group_id/users': {
        'get': { // get all group members
            auth: ['group owner', 'or', 'privileged group member'], // owner/privileged member
            route: function(req, res) {
                searchUsers(req, res, function getGroupMembersCallback(json) {
                    res.json(json);
                })
            }
        },
        'post': {
            auth: ['group owner', 'or', 'privileged group member'],
            route: function searchGroupMembers(req, res) {
                searchUsers(req, res, function searchGroupMembersCallback(json) {
                    res.json(json);
                });
            }
        }
    },
    '/:group_id/users/invite': {
        'post': {
            auth: ['group owner', 'or', 'privileged group member'],
            route: function inviteGroupMember(req, res) {
                var emails = req.body.emails;
                if (!(emails instanceof Array)) {
                    if (emails) {
                        emails = [emails];
                    } else {
                        return res.sendStatus(400);
                    }
                }
                var inviter_user_id = req.user.id;
                var grouppermission_id = req.body.grouppermission_id;
                var userclasses = req.body.userclasses;
                var message = req.body.message;
                var group_id = req.params.group_id;
                var user_id;
                Bookshelf.transaction(function inviteUserToGroupTransaction(t) {
                    var sqlOptions = {
                        transacting: t
                    };
                    return getCurrentUserInfo(sqlInfo, req.user.id, function inviteUserToGroupGetInviterUserInfo(inviter_user) {
                        var inviter_user_json = inviter_user.toJSON();
                        // see if the email already exists in the system
                        // if it does, use that user_id
                        return seeIfEmailsAlreadyExistInSystem(sqlOptions, function inviteUserToGroupFindExistingUserSuccess(users) {
                            var usersAndEmails = convertFoundUsersEmailsToUserIds(emails, users);
                            var emailsToUserIds = usersAndEmails.emails;
                            var userIdsToEmail = usersAndEmails.user_ids_to_email;
                            var foundUserIds = usersAndEmails.user_ids;
                            // check if this invitation already exists for any of these emails/users
                            return findExistingInvitationsForTheFoundUserIdsAndSpecifiedEmails(sqlOptions, emails, foundUserIds, function inviteUserToGroupFilterInvalidGrouppermissions(groupinvitations) {
                                var groupinvitationsJson = groupinvitations.toJSON();
                                var groupinviteMaps = getFoundGroupinvitationToUserIdMap(groupinvitationsJson);
                                // map of groupinvitation.id => user_id
                                var existingGroupinvitationIdsToUserIdMap = groupinviteMaps.idToUserIdMap;
                                // map of user_id => groupinvitation.id
                                var existingGroupinvitationUserIdsToIdMap = groupinviteMaps.userIdToGroupinviteIdMap;
                                // map of email => groupinvitation.id for invites with an email
                                var existingGroupinvitationEmailToIdMap = groupinviteMaps.emailToGroupInviteIdMap;
                                // array of found groupinvitation.id
                                var foundExistingGroupinvitationIds = Object.keys(existingGroupinvitationIdsToUserIdMap);

                                // determine which emails are not in the system
                                var emailsNotInSystem = [];
                                var emailsWithoutOutstandingInvitations = [];
                                var emailsWithOutstandingInvitations = [];
                                var userIdsWithoutOutstandingInvitations = [];
                                var userIdsWithOutstandingInvitations = [];
                                _.each(emailsToUserIds, function(user_id, email) {
                                    var userIdExists = false;
                                    var emailExists;

                                    if (user_id === null) {
                                        // email is not in the system
                                        emailsNotInSystem.push(email);
                                    } else {
                                        // user is in the system
                                        // check if they have a pending invitation
                                        userIdExists = existingGroupinvitationUserIdsToIdMap.hasOwnProperty(user_id);
                                    }

                                    // see if email has an outstanding invitation
                                    emailExists = existingGroupinvitationEmailToIdMap.hasOwnProperty(email);

                                    if (userIdExists || emailExists) {
                                        if (userIdExists) {
                                            userIdsWithOutstandingInvitations.push(user_id);
                                        } else {
                                            emailsWithOutstandingInvitations.push(email);
                                        }
                                    } else {
                                        // add them to the list!
                                        // prefer user_ids
                                        if (userIdExists) {
                                            if (user_id === null){
                                                throw new Error("Internal Error: Failure to create invitation");
                                            }
                                            userIdsWithoutOutstandingInvitations.push(user_id);
                                        } else {
                                            // email exists
                                            if (email === null){
                                                throw new Error("Internal Error: Failure to create invitation");
                                            }
                                            emailsWithoutOutstandingInvitations.push(email);
                                        }
                                    }
                                });

                                // we next need to validate that the grouppermission level is part of the group that the client says it is a part of
                                return validateGrouppermissionIdIsPartOfGroup(sqlOptions, group_id, grouppermission_id, function inviteUserToGroupFilterInvalidGrouppermissionsSuccess(fetchedGrouppermission) {
                                    if (!fetchedGrouppermission) {
                                        // cannot invite without permission level
                                        console.log("Invalid grouppermission_id sent: " + grouppermission_id);
                                        //t.rollback();
                                        return res.sendStatus(400);
                                    } else {
                                        // grouppermission_id is valid
                                    }

                                    return getGroupsPermissionSet(sqlOptions, group_id, function inviteUserToGroupGetPermissionSet(foundGrouppermissions) {
                                        var foundGrouppermissionsJson = foundGrouppermissions.toJSON();
                                        var grouppermissionLevelToGrouppermissionMap = orderGroupPermissionSetByPermissionLevel(foundGrouppermissionsJson);
                                        var grouppermissionIdToGrouppermissionMap = getGroupPermissionIdToGroupPermissionMap(foundGrouppermissionsJson);

                                        // we also need to validate that the userclasses are part of the group as well
                                        return filterInvalidUserClasses(sqlOptions, group_id, userclasses, function inviteUserToGroupFilterInvalidUserClassesSuccess(fetchedUserClasses) {
                                            var foundUserClasses = getFoundUserclassIds(fetchedUserClasses);
                                            // found all valid group permissions
                                            if (foundUserClasses.length === 0) {
                                                // cannot invite without user class types
                                                console.log("Invalid groupuserclasses sent: " + userclasses);
                                                //t.rollback();
                                                return res.sendStatus(400);
                                            }

                                            var usersToIgnore = {};
                                            var usersToInstantlyPromote = {};
                                            var usersToIgnoreAndPromote = {};
                                            var emailsToIgnore = {};
                                            var ignoredUsers = false;

                                            // figure out if any of the users are already a member of this group
                                            // if they are, we need to check if their new permission level is higher
                                            // if it is lower, we ignore, otherwise we automatically grant the new permission level
                                            // and send the user an email telling them about their 'promotion' within the app
                                            _.each(users.toJSON(), function(user) {
                                                var grouppermissions = user.groupBasedGroupPermissions;
                                                if (grouppermissions && grouppermissions.length > 0) {
                                                    for (var i = 0; i < grouppermissions.length; i++) {
                                                        var grouppermission = grouppermissions[i];
                                                        if (grouppermission.group_id == group_id) {
                                                            if (grouppermissionLevelToGrouppermissionMap.hasOwnProperty(grouppermission.permissionlevel)) {
                                                                var grouppermissionArray = grouppermissionLevelToGrouppermissionMap[grouppermission.permissionlevel];
                                                                for (var j = 0; j < grouppermissionArray.length; j++) {
                                                                    var userGrouppermission = grouppermissionArray[j];
                                                                    if (userGrouppermission.id === grouppermission.id) {
                                                                        // user is a member of the group with permission level
                                                                        var existingGroupPermissionLevel = userGrouppermission.permissionlevel;
                                                                        var invitingPermissionLevel = grouppermissionIdToGrouppermissionMap[grouppermission_id].permissionlevel;
                                                                        if (existingGroupPermissionLevel >= invitingPermissionLevel) {
                                                                            // ignore this user!
                                                                            // they are already a member of the group AND have the same permission level (or better) being invited
                                                                            usersToIgnore[user.id] = user;
                                                                        } else {
                                                                            // their group permission level is LOWER than what is being offered
                                                                            // automatically upgrade them without their consent and send a notification
                                                                            usersToInstantlyPromote[user.id] = user;
                                                                        }
                                                                        usersToIgnoreAndPromote[user.id] = user;
                                                                        emailsToIgnore[user.email] = user;
                                                                        ignoredUsers = true;
                                                                        break;
                                                                    }
                                                                }
                                                            }
                                                            break;
                                                        }
                                                    }
                                                }
                                            });

                                            return upgradeExistingGroupMembers(sqlOptions, Object.keys(usersToInstantlyPromote), group_id, grouppermission_id, function inviteUserToGroupUpgradeExistingUsers() {
                                                // we need to delete existing GroupInvitationUserClass rows that link to the existing GroupInvitation tables
                                                // (so that we can remake everything at once)
                                                return deleteExistingGroupInvitationUserClasses(sqlOptions, foundExistingGroupinvitationIds, function inviteUserToGroupDeleteExistingUserClasses() {
                                                    // now that we know the ids of existing groupinvitations that will be re-used
                                                    // and their groupinvitationuserclass related rows are deleted
                                                    // we can create groupinvitations for emails/users that do not already have an outstanding group invite

                                                    var expires = time.nowInUtc() + (60 * 60 * 24 * 15); // 2 weeks + 1 day
                                                    // create invitations for users in the system (userids)
                                                    var newGroupInvitations = [];
                                                    _.each(userIdsWithoutOutstandingInvitations, function(user_id_without_invitation) {
                                                        if (!usersToIgnoreAndPromote.hasOwnProperty(user_id_without_invitation)) {
                                                            newGroupInvitations.push(
                                                                createGroupInvitation(inviter_user_id, user_id_without_invitation, null, grouppermission_id, message, expires)
                                                            )
                                                        }
                                                    });
                                                    // create invitations for users not in the system (emails only)
                                                    _.each(emailsWithoutOutstandingInvitations, function(email_without_invitation) {
                                                        if (!emailsToIgnore.hasOwnProperty(email_without_invitation)) {
                                                            newGroupInvitations.push(
                                                                createGroupInvitation(inviter_user_id, null, email_without_invitation, grouppermission_id, message, expires)
                                                            )
                                                        }
                                                    });
                                                    // now we have all the invitations we need
                                                    // create them in the database
                                                    return updateMultipleGroupInvitations(sqlOptions, foundExistingGroupinvitationIds, {
                                                        expires: expires,
                                                        grouppermission_id: grouppermission_id,
                                                        inviter_user_id: inviter_user_id
                                                    }, function inviteUserToGroupUpdateExistingInvitations() {
                                                        return createMultipleGroupInvitations(sqlOptions, newGroupInvitations, function inviteUserToGroupCreatedInvitations(createdGroupInvitations) {
                                                            var groupInvitationUserClasses = [];
                                                            _.each(foundExistingGroupinvitationIds, function (existingGroupinvitationId) {
                                                                _.each(foundUserClasses, function(userclass_id) {
                                                                    groupInvitationUserClasses.push({
                                                                        groupinvitation_id: existingGroupinvitationId,
                                                                        groupuserclass_id: userclass_id
                                                                    });
                                                                });
                                                            });

                                                            _.each(createdGroupInvitations, function(createdGroupInvitation) {
                                                                _.each(foundUserClasses, function(userclass_id) {
                                                                    groupInvitationUserClasses.push({
                                                                        groupinvitation_id: createdGroupInvitation.id,
                                                                        groupuserclass_id: userclass_id
                                                                    });
                                                                });
                                                            });

                                                            if (!ignoredUsers && groupInvitationUserClasses.length === 0) {
                                                                console.log("Couldn't find any valid userclases\n" + createdGroupInvitations);
                                                                //t.rollback();
                                                                return res.sendStatus(400);
                                                            }

                                                            return createMultipleGroupInvitationUserClasses(sqlOptions, groupInvitationUserClasses, function inviteUserToGroupUserClassesCreated() {
                                                                // do not put the sending of emails into a promise
                                                                // they will send data over the network and we dont want to be doing a sql transaction during that
                                                                _.each(groupinvitationsJson, function(existingGroupInvitation) {
                                                                    var email;
                                                                    if (existingGroupInvitation.usersemail) {
                                                                        email = existingGroupInvitation.usersemail;
                                                                    } else {
                                                                        email = existingGroupInvitation.email;
                                                                    }
                                                                    sendEmail(existingGroupInvitation.token, email, inviter_user_json, message);
                                                                });
                                                                _.each(newGroupInvitations, function(newGroupInvitation) {
                                                                    var email;
                                                                    if (newGroupInvitation.user_id) {
                                                                        email = userIdsToEmail[newGroupInvitation.user_id];
                                                                    } else {
                                                                        email = newGroupInvitation.email;
                                                                    }
                                                                    sendEmail(newGroupInvitation.token, email, inviter_user_json, message);
                                                                });
                                                                _.each(usersToInstantlyPromote, function(promotedUser) {
                                                                    appLogic.notifyGroupPromoted(promotedUser.id, inviter_user_json, group_id);
                                                                });
                                                                res.sendStatus(200);
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        })
                    })
                        .catch(function(err) {
                            error(req, res, err);
                        });

                    function getCurrentUserInfo(sqlOptions, user_id, next) {
                        return models.User.query(function inviteUserToGroupGetInviterQuery(q) {
                            q.select([
                                // don't even accidentally expose sensitive info like hashed passwords
                                'users.id as id',
                                'users.firstname as firstname',
                                'users.lastname as lastname',
                                'users.email as email'
                            ])
                                .from('users')
                                .where('users.id', '=', user_id);
                        })
                            .fetch(sqlOptions)
                            .tap(next);
                    }

                    function seeIfEmailsAlreadyExistInSystem(sqlOptions, next) {
                        return models.User.query(function inviteUserToGroupFindExistingUserQuery(q) {
                            q.select()
                                .from('users')
                                .whereIn('users.email', emails);
                        })
                            .fetchAll(_.extend({
                                withRelated: 'groupBasedGroupPermissions'
                            }, sqlOptions))
                            .tap(next);
                    }

                    function convertFoundUsersEmailsToUserIds(emails, users) {
                        var emailSet = {};
                        var userIdToEmail = {};
                        var user_ids = [];
                        _.each(emails, function(email) {
                            emailSet[email] = null;
                        });
                        if (users) {
                            var foundUsers = users.toJSON();
                            _.each(foundUsers, function (foundUser) {
                                emailSet[foundUser.email] = foundUser.id;
                                userIdToEmail[foundUser.id] = foundUser.email;
                                user_ids.push(foundUser.id);
                            });
                        }

                        return {
                            emails: emailSet,
                            user_ids: user_ids,
                            user_ids_to_email: userIdToEmail
                        };
                    }

                    function findExistingInvitationsForTheFoundUserIdsAndSpecifiedEmails(sqlOptions, emails, user_ids, next) {
                        return models.GroupInvitation.query(function inviteUserToGroupFindExistingInvitationQuery(q) {
                            q.select([
                                'groupinvitations.id as id',
                                'groupinvitations.token as token',
                                'groupinvitations.user_id as user_id',
                                'groupinvitations.email as email',
                                'groupinvitations.expires as expires',
                                'users.email as usersemail'
                            ])
                                .from('groupinvitations')
                                .whereIn('groupinvitations.user_id', user_ids)
                                .orWhereIn('groupinvitations.email', emails)
                                .innerJoin('users', function() {
                                    this.on('users.id', '=', 'groupinvitations.user_id');
                                })
                                .union(function() {
                                    this.select([
                                        'groupinvitations.id as id',
                                        'groupinvitations.token as token',
                                        'groupinvitations.user_id as user_id',
                                        'groupinvitations.email as email',
                                        'groupinvitations.expires as expires',
                                        ' as usersemail' // empty usersemail because not joining with user table
                                    ])
                                        .from('groupinvitations')
                                        .whereIn('groupinvitations.email', emails)
                                });
                        })
                            .fetchAll(sqlOptions)
                            .tap(next);
                    }

                    function getFoundGroupinvitationToUserIdMap(groupinvitations_json) {
                        var idToUserIdMap = {};
                        var userIdToGroupinviteIdMap = {};
                        var emailToGroupinviteIdMap = {};
                        _.each(groupinvitations_json, function(groupinvitation) {
                            idToUserIdMap[groupinvitation.id] = groupinvitation.user_id;
                            userIdToGroupinviteIdMap[groupinvitation.user_id] = groupinvitation.id;
                            if (groupinvitation.email !== null && groupinvitation.email !== undefined) {
                                emailToGroupinviteIdMap[groupinvitation.email] = groupinvitation.id;
                            }
                        });

                        return {
                            idToUserIdMap: idToUserIdMap,
                            userIdToGroupinviteIdMap: userIdToGroupinviteIdMap,
                            emailToGroupInviteIdMap: emailToGroupinviteIdMap
                        };
                    }

                    function validateGrouppermissionIdIsPartOfGroup(sqlOptions, group_id, grouppermission_id, next) {
                        return models.GroupPermission.query(function inviteUserToGroupFilterInvalidGrouppermissionsQuery(q) {
                            q.select()
                                .from('grouppermissions')
                                .innerJoin('usergroups as a', function() {
                                    this.on('a.group_id', '=', 'grouppermissions.group_id');
                                })
                                .innerJoin('grouppermissions as b', function() {
                                    this.on('b.id', '=', 'a.grouppermission_id');
                                })
                                .where('grouppermissions.group_id', '=', group_id)
                                .andWhere('grouppermissions.id', '=', grouppermission_id)
                                .andWhere('a.user_id', '=', req.user.id)
                                .andWhereRaw('grouppermissions.permissionlevel <= b.permissionlevel');
                        })
                            .fetch(sqlOptions)
                            .tap(next);
                    }

                    function getGroupsPermissionSet(sqlOptions, group_id, next) {
                        return models.GroupPermission.query(function inviteUserToGroupGetPermissionSetQuery(q) {
                            q.select()
                                .from('grouppermissions')
                                .where('grouppermissions.group_id', '=', group_id);
                        })
                            .fetchAll(sqlOptions)
                            .tap(next);
                    }

                    function orderGroupPermissionSetByPermissionLevel(grouppermissions_json) {
                        var permissions = {};
                        _.each(grouppermissions_json, function (grouppermission) {
                            if (permissions.hasOwnProperty(grouppermission.id)) {
                                permissions[grouppermission.id].push(grouppermission);
                            } else {
                                permissions[grouppermission.id] = [grouppermission];
                            }
                        });

                        return permissions;
                    }

                    function getGroupPermissionIdToGroupPermissionMap(grouppermissions_json) {
                        var grouppermissionIdToGrouppermission = {};
                        _.each(grouppermissions_json, function (grouppermission) {
                            grouppermissionIdToGrouppermission[grouppermission.id] = grouppermission;
                        });

                        return grouppermissionIdToGrouppermission;
                    }

                    function filterInvalidUserClasses(sqlOptions, group_id, userclasses, next) {
                        return models.GroupUserClass.query(function inviteUserToGroupFilterInvalidUserClassesQuery(q) {
                            q.select()
                                .from('groupuserclasses')
                                .where('groupuserclasses.group_id', '=', group_id)
                                .whereIn('groupuserclasses.id', userclasses);
                        })
                            .fetchAll(sqlOptions)
                            .tap(next);
                    }

                    function getFoundUserclassIds(userclasses) {
                        var foundUserClasses = [];
                        _.each(userclasses.toJSON(), function(fetchedUserClass) {
                            foundUserClasses.push(fetchedUserClass.id);
                        });

                        return foundUserClasses;
                    }

                    function upgradeExistingGroupMembers(sqlOptions, user_ids, group_id, grouppermission_id, next) {
                        if (user_ids.length > 0) {
                            return models.UserGroup.query(function inviteUserToGroupUpgradeExistingMemberQuery(q) {
                                q.select()
                                    .from('usergroups')
                                    .whereIn('usergroups.user_id', user_ids)
                                    .andWhere('usergroups.group_id', '=', group_id)
                                    .update({
                                        grouppermission_id: grouppermission_id
                                    });
                            })
                                .fetchAll(sqlOptions)
                                .tap(next);
                        } else {
                            return next();
                        }
                    }

                    function deleteExistingGroupInvitationUserClasses(sqlOptions, groupinvitation_ids, next) {
                        return models.GroupInvitationUserClass.query(function inviteUserToGroupDeleteOldUserClasses(q) {
                            q.select()
                                .from('groupinvitationuserclasses')
                                .whereIn('groupinvitationuserclasses.groupinvitation_id', groupinvitation_ids)
                                .del();
                        })
                            .fetchAll(sqlOptions)
                            .tap(next);
                    }

                    function createGroupInvitation(inviter, user_id, email, grouppermission_id, message, expires) {
                        if ((user_id === null || user_id === undefined) && (email === null || email === undefined)) {
                            throw new Error("Internal error, failed to create invitation");
                        }
                        return {
                            inviter_user_id: inviter,
                            user_id: user_id,
                            email: email,
                            grouppermission_id: grouppermission_id,
                            message: message,
                            expires: expires,
                            token: utils.randomString(64)
                        };
                    }

                    function updateMultipleGroupInvitations(sqlOptions, existingGroupInvitationIds, updates, next) {
                        if (existingGroupInvitationIds.length > 0) {
                            return models.GroupInvitation.query(function updateExistingGroupInvitationsQuery(q) {
                                q.select()
                                    .from('groupinvitations')
                                    .whereIn('groupinvitations.id', existingGroupInvitationIds)
                                    .update(updates);
                            })
                                .fetchAll(sqlOptions)
                                .tap(next);
                        } else {
                            return next();
                        }
                    }

                    function createMultipleGroupInvitations(sqlOptions, groupinvitations, next) {
                        if (groupinvitations.length > 0) {
                            return createSingleGroupInvitation(sqlOptions, groupinvitations, 0, [], next);
                        } else {
                            return next();
                        }
                    }

                    function createSingleGroupInvitation(sqlOptions, groupinvitations, index, createdInvitations, next) {
                        if (index >= groupinvitations.length) {
                            return next(createdInvitations);
                        }
                        return models.GroupInvitation.forge(groupinvitations[index])
                            .save(undefined, sqlOptions)
                            .tap(function recursivelyCreateSingleGroupInvitations(newGroupinvitation) {
                                createdInvitations.push(newGroupinvitation);
                                return createSingleGroupInvitation(sqlOptions, groupinvitations, index + 1, createdInvitations, next);
                            });
                    }

                    function createMultipleGroupInvitationUserClasses(sqlOptions, groupInvitationUserClasses, next) {
                        var invitationUserClasses = models.GroupInvitationUserClasses.forge(groupInvitationUserClasses);
                        return Promise.all(invitationUserClasses.invoke('save', null, sqlOptions))
                            .tap(next);
                    }

                    function sendEmail(token, to, inviter_user, message) {
                        if (to === null || to === undefined) {
                            throw new Error("Internal error, email recipient is not defined");
                        }
                        return new Promise(function sendInviteEmailPromise(resolve, reject) {
                            appLogic.sendInviteEmail(token, to, inviter_user, message);
                            resolve();
                        });
                    }
                })
            }
        }
    },
    '/:group_id/users/:user_id': {
        'get': { // get basic group member info
            auth: ['group owner', 'or', 'privileged group member'], // must be owner owner of group or group member
            route: function(req, res) {
                models.User.query(function(q) {
                    q.select(
                        'users.id as id',
                        'users.firstname as firstname',
                        'users.lastname as lastname',
                        'usergroups.grouppermission_id as grouppermission_id'
                    )
                        .innerJoin('usergroups', function() {
                            this.on('users.id', '=', 'usergroups.user_id');
                        })
                        .where('users.id', '=', req.params.user_id)
                        .andWhere('usergroups.group_id', '=', req.params.group_id)
                        .union(function() {
                            this.select(
                                Bookshelf.knex.raw(
                                    'users.id as id, users.firstname as firstname, users.lastname as lastname, -1 as grouppermission_id'
                                )
                            )
                                .from('users')
                                .innerJoin('groups', function() {
                                    this.on('users.id', '=', 'groups.user_id');
                                })
                                .where('groups.id', '=', req.params.group_id)
                                .andWhere('users.id', '=', req.params.user_id);
                        });
                })
                    .fetch()
                    .then(function(groupmembers) {
                        if (!groupmembers) {
                            res.status(403).json({error: true, data: {}});
                        } else {
                            res.json(groupmembers.toJSON());
                        }
                    })
                    .catch(function(err) {
                        error(req, res, err);
                    });
            }
        },
        'delete': { // remove user from group
            auth: ['group owner', 'or', 'privileged group member'], // privileged member or owner
            route: function(req, res) {
                deleteModel(
                    'UserGroup',
                    {
                        group_id: req.params.group_id,
                        user_id: req.params.user_id
                    },
                    req,
                    res,
                    'Successfully removed user from group'
                );
            }
        }
    },
    '/:group_id/users/:user_id/permissions': {
        'get': { // get a users group permissions
            auth: ['group owner', 'or', 'group member'] // owner/member
        }
    },
    '/:group_id/users/:user_id/classes/:class_id/permissions/:permission_id': {
        'post': { // add user with permission level AND user class
            auth: ['group owner', 'or', 'privileged group member'],
            route: function(req, res) {
                // is this route even needed?
                Bookshelf.transaction(function(t) {
                    models.Group.query(function(q) {
                        q.select()
                            .from('groups')
                            .where('groups.id', '=', req.params.group_id)
                            .innerJoin('grouppermissions', function() {
                                this.on('grouppermiissions.group_id', '=', 'groups.id');
                            })
                            // get only groups that the user is not a member of
                            .leftJoin('usergroups', function() {
                                this.on('usergroups.group_id', '=', 'groups.id')
                                    .where('usergroups.group_id', '=', null);
                            });
                    })
                        .fetch({
                            transacting: t
                        })
                        .then(function(group) {
                            if (group) {
                                models.UserGroup.forge({
                                    // no need to check that userid exists
                                    // sql should throw error if it doesnt exist
                                    user_id: req.params.user_id,
                                    group_id: req.params.group_id,
                                    grouppermission_id: req.params.permission_id
                                })
                                    .save({
                                        transacting: t
                                    })
                                    .then(function(model) {
                                        res.json({error: false, data: {message: 'Success'}});
                                    })
                                    .catch(function(err) {
                                        error(req, res, err);
                                    });
                            } else {
                                res.sendStatus(403);
                            }
                        })
                        .catch(function(err) {
                            error(req, res, err);
                        })
                });
            }
        }
    },
    '/:group_id/users/:user_id/permissions/:permission_id': {
        'post': { // add user with permission level to group
            auth: ['group owner', 'or', 'privileged group member'], // owner/privileged group member
            route: function(req, res) {
                Bookshelf.transaction(function (t) {
                    // make sure permission_id is part of group
                    model.GroupPermission.query(function (q) {
                        q.select()
                            .from('grouppermissions')
                            .innerJoin('groups', function () {
                                this.on('groups.groupsetting_id', '=', 'grouppermissions.groupsettings_id');
                            })
                            .where('grouppermissions.id', '=', req.params.permission_id);
                    })
                        .fetch({transacting: t})
                        .then(function (grouppermission) {
                            if (grouppermission) {
                                // grouppermission is tied to group
                                // ok to add user with that permission
                                // after we verify that they are not already a member
                                model.UserGroup.forge({
                                    user_id: req.params.user_id,
                                    group_id: req.params.group_id
                                })
                                    .fetch({transacting: t})
                                    .then(function (usergroup) {
                                        if (!usergroup) {
                                            // does not exist, create
                                            postModel(
                                                'UserGroup',
                                                {
                                                    user_id: req.params.user_id,
                                                    group_id: req.params.group_id,
                                                    grouppermission_id: req.params.permission_id
                                                },
                                                req,
                                                res,
                                                undefined,
                                                {
                                                    transacting: t
                                                }
                                            );
                                        } else {
                                            // exists, dont add
                                            // check if permission level is identical
                                            if (usergroup.get('grouppermission_id') == req.params.permission_id) {
                                                res.sendStatus(200);
                                            } else {
                                                // doesn't match
                                                // send error
                                                res.sendStatus(412); // precondition failed
                                            }
                                        }
                                    })
                                    .catch(function (err) {
                                        error(req, res, err);
                                    });
                            } else {
                                res.sendStatus(403);
                            }
                        })
                        .catch(function (err) {
                            error(req, res, err);
                        });
                });
            }
        },
        'patch': { // update a users permission set
            auth: ['group owner', 'or', 'privileged group member'], // owner/privileged group member
            route: function(req, res) {
                // TODO: Make this an inner join with an update
                Bookshelf.transaction(function (t) {
                    // make sure permission_id is part of group
                    model.GroupPermission.query(function (q) {
                        q.select()
                            .from('grouppermissions')
                            .innerJoin('groups', function () {
                                this.on('groups.groupsetting_id', '=', 'grouppermissions.groupsettings_id');
                            })
                            .where('grouppermissions.id', '=', req.params.permission_id);
                    })
                        .fetch({transacting: t})
                        .then(function (grouppermission) {
                            if (grouppermission) {
                                // grouppermission is tied to group
                                // ok to update the user with that permission
                                // after we verify that they are not already a member
                                model.UserGroup.forge({
                                    user_id: req.params.user_id,
                                    group_id: req.params.group_id
                                })
                                    .fetch({transacting: t})
                                    .then(function (usergroup) {
                                        if (!usergroup) {
                                            // does not exist, error
                                            res.sendStatus(412);
                                        } else {
                                            // exists, update
                                            // check if permission level is identical
                                            if (usergroup.get('grouppermission_id') == req.params.permission_id) {
                                                res.sendStatus(200);
                                            } else {
                                                // doesn't match
                                                // update it
                                                patchModel(
                                                    'UserGroup',
                                                    {
                                                        grouppermission_id: req.params.permission_id
                                                    },
                                                    req,
                                                    res,
                                                    undefined,
                                                    {
                                                        transacting: t
                                                    }
                                                );
                                            }
                                        }
                                    })
                                    .catch(function (err) {
                                        error(req, res, err);
                                    });
                            } else {
                                res.sendStatus(403);
                            }
                        })
                        .catch(function (err) {
                            error(req, res, err);
                        });
                });
            }
        }
    },
    '/:group_id/users/search/start/:start/end/:end': {
        'get': {
            auth: ['group owner', 'or', 'privileged group member'],
            route: function getGroupMembersLimit(req, res) {
                filterableSearchGroupMembersLimit(req, res);
            }
        },
        'post': {
            auth: ['group owner', 'or', 'privileged group member'],
            route: function searchGroupMembersLimi(req, res) {
                filterableSearchGroupMembersLimit(req, res);
            }
        }
    },
    '/:group_id/locations': {
        'get': { // get list of all locations in group
            auth: ['group owner or group member'], // group member/owner
            route: function groupLocationsGet(req, res) {
                var locationColumns = createSelectQueryForAllColumns('Location', 'locations');
                var locationColumnsWithUserPermission = _.clone(locationColumns);
                //locationColumnsWithUserPermission.push('userpermissions.subscribed as subscribed');
                return models.Location.query(function groupLocationsGetQuery(q) {
                    q.select(locationColumnsWithUserPermission)
                        .from('locations')
                        .where('locations.group_id', '=', req.params.group_id);
                })
                    .fetchAll({
                        withRelated: [
                            'sublocations',
                            {
                                'userpermissions': function(qb) {
                                    qb.columns('userpermissions.location_id', 'userpermissions.subscribed')
                                        .where('userpermissions.user_id', '=', req.user.id);
                                        //.andWhere('userpermissions.location_id', '=', ); // can't get this to work... client will just have to prune the result set
                                }
                            }
                        ]
                    })
                    .then(function groupLocationsGetSuccess(locations) {
                        res.json(locations.toJSON());
                    })
                    .catch(function groupLocationsGetError(err) {
                        error(req, res, err);
                    });
            }
        },
        'post': { // create new location in group
            auth: ['group owner', 'or', 'privileged group member'], // group owner/privileged member
            route: function(req, res) {
                postModel(
                    'Location',
                    {
                        group_id: req.params.group_id
                    },
                    req,
                    res
                )
            }
        }
    },
    '/:group_id/locations/:location_id': {
        'get': {
            auth: ['group member'],
            route: function(req, res) {
                simpleGetSingleModel(
                    'Location',
                    {
                        id: req.params.location_id,
                        group_id: req.params.group_id
                    },
                    req,
                    res
                );
            }
        },
        'patch': { // modify location
            auth: ['group owner', 'or', 'privileged group member'], // group owner/privileged member
            route: function(req, res) {
                patchModel(
                    'Location',
                    {
                        id: req.params.location_id,
                        group_id: req.params.group_id
                    },
                    req,
                    res,
                    'Location updated',
                    [
                        'id',
                        'group_id'
                    ]
                );
            }
        },
        'delete': { // remove location from group
            auth: ['group owner', 'or', 'privileged group member'], // group owner/privileged member
            route: function(req, res) {
                deleteModel(
                    'Location',
                    {
                        id: req.params.location_id,
                        group_id: req.params.group_id
                    },
                    req,
                    res,
                    'Location deleted'
                );
            }
        }
    },
    '/:group_id/areas': {
        'get': { // get all areas attached
            auth: ['group owner', 'or', 'group member'], // owner/member
            route: function(req, res) {
                simpleGetListModel(
                    'Area',
                    {
                        group_id: req.params.group_id
                    },
                    req,
                    res
                );
            }
        },
        'post': { // create an area
            auth: ['group owner', 'or', 'privileged group member'], // owner/privileged member
            route: function(req, res) {
                postModel(
                    'Area',
                    {
                        group_id: req.params.group_id
                    },
                    req,
                    res
                );
            }
        }
    },
    '/:group_id/areas/:area_id': {
        'delete': { // remove an area from this group
            auth: ['group owner', 'or', 'privileged group member'], // owner/privileged member
            route: function(req, res) {
                models.Area
                    .where({
                        id: req.params.area_id,
                        group_id: req.params.group_id
                    })
                    .destroy()
                    .then(function(model) {
                        if (model) {
                            res.json({error: false, data: {message: 'Success'}});
                        } else {
                            res.status(403);
                        }
                    })
                    .catch(function(err) {
                        error(req, res, err, 'Failed to delete Area');
                    });
            }
        }
    },
    '/:group_id/settings': {
        'get': { // get group settings
            auth: ['group owner or group member'],
            route: groupSettingsGet
        },
        'post': {
            auth: ['403', 'group owner', 'or', 'privileged group member'],
            route: function groupSettingsPost(req, res) {
                return models.GroupSettings.query(function groupSettingsPostQuery(q) {
                    q.select(
                        createSelectQueryForAllColumns('GroupSetting', 'groupsettings', ['id'])
                    )
                        .from('groupsettings')
                        .innerJoin('groups', function() {
                            this.on('groups.groupsetting_id', '=', 'groupsettings.id')
                                .andOn('groups.id', '=', parseInt(req.params.group));
                        })
                        .update(getPatchKeysWithoutBannedKeys(
                            'GroupSetting',
                            req.body
                        ));
                })
                    .fetch()
                    .then(function groupSettingsPostThen(groupsettings) {
                        return groupSettingsGet(req, res);
                    })
                    .catch(function groupSettingsPostError(err) {
                        error(req, res, err);
                    });

            }
        }
    },
    '/:group_id/permissions': {
        'get': { // get all permission sets
            auth: ['group owner or group member'], // owner/member
            route: function(req, res) {
                // group -> groupsetting -> grouppermission
                // Executing this transaction from a tests makes fixtures for next test deadlock
                models.GroupPermission.query(function(q) {
                    q.select()
                        .from('grouppermissions')
                        .innerJoin('groups', function() {
                            this.on('groups.groupsetting_id', '=', 'grouppermissions.groupsetting_id');
                        })
                        .where('groups.id', '=', req.params.group_id);
                })
                    .fetchAll({withRelated: ['groupsetting']})
                    .then(function (grouppermissions) {
                        // TODO: Return group settings id differently
                        res.json(grouppermissions);
                    })
                    .catch(function (err) {
                        error(req, res, err);
                    });
            }
        },
        'post': { // create a permission set
            auth: ['group owner', 'or', 'privileged group member'], // owner/privileged member
            route: function(req, res) {
                //Bookshelf.transaction(function (t) {
                    models.GroupSetting.query(function(q) {
                        q.select()
                            .from('groups')
                            .innerJoin('groupsettings', function() {
                                this.on('groupsettings.id', '=', 'groups.groupsetting_id');
                            })
                            .where('groups.id', '=', req.params.group_id);
                    })
                        //TODO Transacting
                        //.fetch({transacting: t})
                        .fetch()
                        .then(function (groupsetting) {
                            if (groupsetting) {
                                postModel(
                                    'GroupPermission',
                                    {
                                        groupsetting_id: groupsetting.get('id')
                                    },
                                    req,
                                    res,
                                    undefined
                                    //{transacting: t}
                                );
                            } else {
                                throw new Error("Group setting should exist for group " + req.params.group_id);
                            }
                        })
                        .catch(function (err) {
                            error(req, res, err);
                        });
                //});
            }
        }
    },
    '/:group_id/permissions/:permission_id': {
        'patch': { // update a group permission set
            auth: ['group owner', 'or', 'privileged group member'], // owner/privileged member
            route: function(req, res) {
                // verify that permission is part of group
                models.GroupPermission.query(function(q) {
                    q.select()
                        .from('grouppermissions')
                        .innerJoin('groups', function() {
                         this.on('groups.groupsetting_id', '=', 'grouppermissions.groupsetting_id');
                         })
                        .where('group_id', '=', req.params.group_id)
                        .where('grouppermissions.id', '=', req.params.permission_id)
                        .update(getPatchKeysWithoutBannedKeys(
                            'GroupPermission',
                            req.body,
                            [
                                'id',
                                'groupsetting_id'
                            ]
                        ));
                })
                    .fetch()
                    .then(function(model) {
                        if (model) {
                            res.json({error: false, data: {message: 'Success'}});
                        } else {
                            res.status(403);
                        }
                    })
                    .catch(function(err) {
                        error(req, res, err);
                    });
            }
        },
        'delete': { // remove a permission set
            auth: ['group owner', 'or', 'privileged group member'], // owner/privileged member
            route: function(req, res) {
                // make sure permission is part of the group
                models.GroupPermission.query(function(q) {
                    q.select()
                        .from('grouppermissions')
                        .innerJoin('groups', function() {
                            this.on('groups.groupsetting_id', '=', 'grouppermissions.groupsetting_id');
                        })
                        .where('group_id', '=', req.params.group_id)
                        .where('grouppermissions.id', '=', req.params.permission_id);
                })
                    .destroy()
                    .then(function(model) {
                        if (model) {
                            res.json({error: false, data: {message: 'Success'}});
                        } else {
                            res.status(403);
                        }
                    })
                    .catch(function(err) {
                        error(req, res, err);
                    });
            }
        }
    },
    '/:group_id/permissions/:permission_id/newpermission/:newpermission_id': {
        'delete': { // remove a permission set
            auth: ['group owner', 'or', 'privileged group member'], // owner/privileged member
            route: function(req, res) {
                // make sure permission is part of the group
                models.GroupPermission.query(function(q) {
                    q.select()
                        .from('GroupPermission')
                        .innerJoin('groups', function() {
                            this.on('groups.grouppermission_id', '=', 'grouppermissions.id');
                        })
                        .where('groups.id', '=', req.params.group_id);
                })
                    .destroy()
                    .then(function(model) {
                        if (model) {
                            res.json({error: false, data: {message: 'Success'}});
                        } else {
                            res.status(403);
                        }
                    })
                    .catch(function(err) {
                        error(req, res, err);
                    });
            }
        }
    }
};

function groupSettingsGet(req, res) {
    models.GroupSetting.query(function groupSettingsGetQuery(q) {
        q.select(
            createSelectQueryForAllColumns('GroupSetting', 'groupsettings', ['id'])
        )
            .from('groupsettings')
            .innerJoin('groups', function() {
                this.on('groups.groupsetting_id', '=', 'groupsettings.id');
            })
            .where('groups.id', '=', req.params.group_id);
    })
        .fetch()
        .then(function groupSettingsGetThen(groupsetting) {
            if (groupsetting) {
                res.json(groupsetting);
            } else {
                throw new Error("Group setting should exist for group " + req.params.group_id);
            }
        })
        .catch(function groupSettingsGetError(err) {
            error(req, res, err);
        });
}

function searchUsers(req, res, next) {
    var query = req.body.query;
    var likeQuery = null;
    if (query) {
        // force query to be a string
        query = "" + query.toLowerCase();
        likeQuery = "%" + query + "%";
    }

    function filter(q) {
        if (query) {
            return q.andWhere('users.firstname', 'like', likeQuery)
                .orWhere('users.lastname', 'like', likeQuery);
        } else {
            return q;
        }
    }

    models.User.query(function(q) {
        filter(
            q.select(
                'users.id as id',
                'users.firstname as firstname',
                'users.lastname as lastname',
                'usergroups.grouppermission_id as grouppermission_id'
            )
                .from('users')
                .innerJoin('usergroups', function () {
                    this.on('users.id', '=', 'usergroups.user_id');
                })
                .where('usergroups.group_id', '=', req.params.group_id)
        )
            .union(function () {
                filter(
                    this.select(
                        // doing this not raw and instead using bookshelf turns the -1 into a string
                        // this means that postgres will spit an error because column types cannot be mixed (int above, now string for group owners)
                        Bookshelf.knex.raw(
                            'users.id as id, users.firstname as firstname, users.lastname as lastname, -1 as grouppermission_id'
                        )
                    )
                        .from('users')
                        .innerJoin('groups', function () {
                            this.on('users.id', '=', 'groups.user_id');
                        })
                        .where('groups.id', '=', req.params.group_id)
                );
            });
    })
        .fetchAll()
        .then(function (groupmembers) {
            next(groupmembers.toJSON());
        })
        .catch(function (err) {
            error(req, res, err);
        });
}

function filterableSearchGroupMembersLimit(req, res) {
    var start = parseInt(req.params.start);
    var end = parseInt(req.params.end);
    if (start < 0) {
        start = 0;
    }

    if (end < 0) {
        end = 0;
    }

    if (end < start) {
        res.sendStatus(400);
    }

    searchUsers(req, res, function searchGroupMembersLimitCallback(json) {
        if (start > json.length) {
            start = json.length;
        }

        if (end > json.length) {
            end = json.length;
        }
        res.json({
            start: start,
            end: end,
            size: json.length,
            after: json.length - end,
            result: json.slice(start, end + 1)
        });
    });
}
