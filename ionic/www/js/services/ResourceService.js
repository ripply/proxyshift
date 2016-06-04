angular.module('scheduling-app.services')
    .service('ResourceService', [
        '$rootScope',
        '$controller',
        'GENERAL_EVENTS',
        'UsersModel',
        'LocationsModel',
        'GroupsModel',
        'ShiftsModel',
        function($rootScope,
                 $controller,
                 GENERAL_EVENTS,
                 UsersModel,
                 LocationsModel,
                 GroupsModel,
                 ShiftsModel
        ) {
            function updateUserInfo(callback, argument) {
                $rootScope.$emit(GENERAL_EVENTS.UPDATES.USERINFO.UPDATENEEDED);
                if (callback) {
                    callback(argument);
                }
            }

            this.getGroupSettings = function getGroupSettings(group_id, success, error) {
                andThen(
                    GroupsModel.settings({
                        group_id: group_id
                    }),
                    success,
                    error
                );
            };

            this.saveGroupSettings = function saveGroupSettings(group_id, settings, success, error) {
                andThen(
                    GroupsModel.updateSettings({
                            group_id: group_id
                        },
                        settings
                    ),
                    success,
                    error
                );
            };

            this.updateSettings = function updateSettings(settings, success, error) {
                andThen(
                    UsersModel.updateSettings({},
                        settings
                    ),
                    success,
                    error
                );
            };

            this.resetPassword = function resetPassword(usernameOrEmail, success, error) {
                andThen(
                    UsersModel.passwordReset({
                        username: usernameOrEmail
                    }),
                    success,
                    error
                );
            };

            this.getLocationsSlice = function getLocationsSlice(start, end, success, error) {
                andThen(
                    LocationsModel.listStagger({
                        start: start,
                        end: end
                    }),
                    success,
                    error
                );
            };

            this.getLocationsSearchSlice = function getLocationsSearchSlice(query, start, end, success, error) {
                andThen(
                    LocationsModel.listSearchStagger({
                        start: start,
                        end: end
                    }, {
                        query: query
                    }),
                    success,
                    error
                );
            };

            this.getLocation = function getLocation(group_id, location_id, success, error) {
                andThen(
                    GroupsModel.location({
                        group_id: group_id,
                        location_id: location_id
                    }),
                    success,
                    error
                );
            };

            this.createLocation = function createLocation(group_id, timezone, title, state, city, address, zipcode, phonenumber, success, error) {
                andThen(
                    GroupModel.createLocation({
                        group_id: group_id
                    }, {
                        title: title,
                        state: state,
                        city: city,
                        address: address,
                        zipcode: zipcode,
                        phonenumber: phonenumber
                    }),
                    function createLocationSuccess(result) {
                        // userinfo has location information
                        updateUserInfo(success, result);
                    },
                    error
                );
            };

            this.editLocation = function editLocation(group_id, location_id, timezone, title, state, city, address, zipcode, phonenumber, success, error) {
                andThen(
                    GroupsModel.updateLocation({
                        group_id: group_id,
                        location_id: location_id
                    }, {
                        title: title,
                        state: state,
                        city: city,
                        address: address,
                        zipcode: zipcode,
                        phonenumber: phonenumber
                    }),
                    function editLocationSuccess(result) {
                        // userinfo has location information
                        updateUserInfo(success, result);
                    },
                    error
                );
            };

            this.deleteLocation = function deleteLocation(group_id, location_id, success, error) {
                andThen(
                    GroupsModel.removeLocation({
                        group_id: group_id,
                        location_id: location_id
                    }),
                    function deleteLocationSuccess(result) {
                        // userinfo has location information
                        updateUserInfo(success, result);
                    },
                    error
                );
            };

            this.createSublocation = function createSublocation(location_id, title, description, success, error) {
                andThen(
                    LocationsModel.createSublocation({
                        location_id: location_id
                    }, {
                        title: title,
                        description: description
                    }),
                    function createSublocationSuccess(result) {
                        // userinfo has location information
                        // TODO: UPDATE USERINFO
                        //updateUserInfo(success, result);
                    },
                    error
                );
            };

            this.editSublocation = function editSublocation(location_id, sublocation_id, title, description, success, error) {
                andThen(
                    LocationsModel.updateSublocation({
                        location_id: location_id
                    }, {
                        title: title,
                        description: description
                    }),
                    function editSublocationSuccess(result) {
                        // userinfo has location information
                        // TODO: UPDATE USERINFO
                        //updateUserInfo(success, result);
                    },
                    error
                );
            };

            this.deleteSublocation = function deleteSublocation(location_id, sublocation_id, success, error) {
                andThen(
                    LocationsModel.removeSublocation({
                        location_id: location_id
                    }),
                    function deleteSublocationSuccess(result) {
                        // userinfo has location information
                        // TODO: UPDATE USERINFO
                        //updateUserInfo(success, result);
                    },
                    error
                );
            };

            this.getUsersAtLocation = function getUsersAtLocation(location_id, success, error) {
                andThen(
                    LocationsModel.users({
                        location_id: location_id
                    }),
                    success,
                    error
                )
            };

            this.getAllJobs = function getAllJobs(success, error) {
                andThen(
                    GroupsModel.allClasses(),
                    success,
                    error
                );
            };

            this.getJobsAtGroup = function getJobsAtGroup(group_id, success, error) {
                andThen(
                    GroupsModel.classes({
                        group_id: group_id
                    }),
                    success,
                    error
                );
            };

            this.createType = function createType(group_id, title, description, cansendnotification, requiremeanagerapproval, grouppermission_id, success, error) {
                andThen(
                    GroupsModel.createClass({
                        group_id: group_id
                    }, {
                        title: title,
                        description: description,
                        cansendnotification: cansendnotification,
                        requiremanagerapproval: requiremeanagerapproval,
                        grouppermission_id: grouppermission_id
                    }),
                    function createTypeSuccess(result) {
                        updateUserInfo(success, result);
                    },
                    error
                );
            };

            this.editType = function editType(group_id, type_id, title, description, cansendnotification, requiremeanagerapproval, grouppermission_id, success, error) {
                andThen(
                    GroupsModel.updateClass({
                        group_id: group_id,
                        class_id: type_id
                    }, {
                        title: title,
                        description: description,
                        cansendnotification: cansendnotification,
                        requiremanagerapproval: requiremeanagerapproval,
                        grouppermission_id: grouppermission_id
                    }),
                    function editTypeSuccess(result) {
                        updateUserInfo(success, result);
                    },
                    error
                );
            };

            this.deleteType = function deleteType(group_id, type_id, success, error) {
                andThen(
                    GroupsModel.removeClass({
                        group_id: group_id,
                        class_id: type_id
                    }),
                    function deleteTypeSuccess(result) {
                        updateUserInfo(success, result);
                    },
                    error
                );
            };

            this.getGroupPermissions = function getGroupPermissions(group_id, success, error) {
                andThen(
                    GroupsModel.permissions({
                        group_id: group_id
                    }),
                    success,
                    error
                )
            };

            this.getGroupMembers = function getGroupMembers(group_id, success, error) {
                andThen(
                    GroupsModel.users({
                        group_id: group_id
                    }),
                    success,
                    error
                );
            };

            this.getGroupMembersSlice = function getGroupMembersSlice(group_id, start, end, success, error) {
                andThen(
                    GroupsModel.usersStagger({
                        group_id: group_id,
                        start: start,
                        end: end
                    }),
                    success,
                    error
                );
            };

            this.getGroupMembersSliceSearch = function getGroupMembersSliceSearch(group_id, start, end, query, success, error) {
                andThen(
                    GroupsModel.searchUsersStagger({
                        group_id: group_id,
                        start: start,
                        end: end,
                    }, {
                        query: query
                    }),
                    success,
                    error
                );
            };

            this.getGroupMember = function getGroupMember(group_id, user_id, success, error) {
                andThen(
                    GroupsModel.user({
                        group_id: group_id,
                        user_id: user_id
                    }),
                    success,
                    error
                )
            };

            this.inviteUsersToGroup = function inviteUsersToGroup(group_id, grouppermission_id, userclasses, emails, message, success, error) {
                if (!(userclasses instanceof Array)) {
                    userclasses = [userclasses];
                }
                if (!(emails instanceof Array)) {
                    emails = [emails];
                }
                andThen(
                    GroupsModel.inviteUser({
                        group_id: group_id
                    }, {
                        emails: emails,
                        grouppermission_id: grouppermission_id,
                        userclasses: userclasses,
                        message: message
                    }),
                    success,
                    error
                );
            };

            this.createMultipleShifts = function createMultipleShifts(shifts, success, error) {
                andThen(
                    ShiftsModel.create(shifts),
                    success,
                    error
                );
            };

            this.registerForShift = function registerForShift(shift_id, success, error) {
                andThen(
                    ShiftsModel.register({
                        shift_id: shift_id
                    }),
                    success,
                    error
                );
            };

            this.unregisterForShift = function unregisterForShift(shift_id, reason, success, error) {
                andThen(
                    ShiftsModel.unregister({
                        shift_id: shift_id
                    }, {
                        reason: reason
                    }),
                    success,
                    error
                );
            };

            this.ignoreShift = function ignoreShift(shift_id, success, error) {
                andThen(
                    ShiftsModel.ignore({
                        shift_id: shift_id
                    }),
                    success,
                    error
                );
            };

            this.unIgnoreShift = function unIgnoreShift(shift_id, success, error) {
                andThen(
                    ShiftsModel.unignore({
                        shift_id: shift_id
                    }),
                    success,
                    error
                );
            };

            this.getShift = function getShift(shift_id, success, error) {
                andThen(
                    ShiftsModel.get({
                        shift_id: shift_id
                    }),
                    success,
                    error
                );
            };

            this.removeShift = function removeShift(shift_id, success, error) {
                andThen(
                    ShiftsModel.remove({
                        shift_id: shift_id
                    }),
                    success,
                    error
                );
            };

            this.approveShiftApplication = function approveShiftApplication(shiftapplication_id, success, error) {
                andThen(
                    ShiftsModel.approve({
                        shiftapplication_id: shiftapplication_id
                    }),
                    success,
                    error
                );
            };

            this.declineShiftApplication = function declineShiftApplication(shiftapplication_id, reason, success, error) {
                andThen(
                    ShiftsModel.decline({
                        shiftapplication_id: shiftapplication_id
                    }, {
                        reason: reason
                    }),
                    success,
                    error
                );
            };

            function andThen(promise, success, error) {
                if (promise.hasOwnProperty("$promise")) {
                    promise = promise.$promise;
                }
                promise.then(function resourceServiceSuccess(result) {
                    if (success) {
                        success(result);
                    }
                }, function resourceServiceError(response) {
                    if (error) {
                        error(response);
                    }
                });
            }

        }]
);
