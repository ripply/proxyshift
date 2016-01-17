angular.module('scheduling-app.services')
    .service('ResourceService', [
        '$rootScope',
        '$controller',
        'Restangular',
        'GENERAL_EVENTS',
        function($rootScope,
                 $controller,
                 Restangular,
                 GENERAL_EVENTS
        ) {
            function updateUserInfo(callback, argument) {
                $rootScope.$emit(GENERAL_EVENTS.UPDATES.USERINFO.UPDATENEEDED);
                if (callback) {
                    callback(argument);
                }
            }

            this.getLocation = function getLocation(group_id, location_id, success, error) {
                andThen(
                    Restangular.one('groups', group_id)
                        .one('locations', location_id)
                        .get(),
                    success,
                    error
                );
            };

            this.createLocation = function createLocation(group_id, timezone, state, city, address, zipcode, phonenumber, success, error) {
                andThen(
                    Restangular.one('groups', group_id)
                        .all('locations')
                        .customPOST({
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

            this.editLocation = function editLocation(group_id, location_id, timezone, state, city, address, zipcode, phonenumber, success, error) {
                andThen(
                    Restangular.one('groups', group_id)
                        .one('locations', location_id)
                        .patch({
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
                    Restangular.one('groups', group_id)
                        .one('locations', location_id)
                        .remove(),
                    function deleteLocationSuccess(result) {
                        // userinfo has location information
                        updateUserInfo(success, result);
                    },
                    error
                );
            };

            this.createSublocation = function createSublocation(location_id, title, description, success, error) {
                andThen(
                    Restangular.one('locations', location_id)
                        .all('sublocations')
                        .customPOST({
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
                    Restangular.one('locations', location_id)
                        .one('sublocations', sublocation_id)
                        .patch({
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
                    Restangular.one('locations', location_id)
                        .one('sublocations', sublocation_id)
                        .remove(),
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
                    Restangular.one('locations', location_id)
                        .all('users')
                        .getList(),
                    success,
                    error
                )
            };

            this.getJobsAtGroup = function getJobsAtGroup(group_id, success, error) {
                andThen(
                    Restangular.one('groups', group_id)
                        .all('classes')
                        .getList(),
                    success,
                    error
                );
            };

            this.createType = function createType(group_id, title, description, cansendnotification, requiremeanagerapproval, grouppermission_id, success, error) {
                andThen(
                    Restangular.one('groups', group_id)
                        .all('classes')
                        .customPOST({
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
                    Restangular.one('groups', group_id)
                        .one('classes', type_id)
                        .patch({
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
                    Restangular.one('groups', group_id)
                        .one('classes', type_id)
                        .remove(),
                    function deleteTypeSuccess(result) {
                        updateUserInfo(success, result);
                    },
                    error
                );
            };

            this.getGroupPermissions = function getGroupPermissions(group_id, success, error) {
                andThen(
                    Restangular.one('groups', group_id)
                        .all('permissions')
                        .getList(),
                    success,
                    error
                )
            };

            this.getGroupMembers = function getGroupMembers(group_id, success, error) {
                andThen(
                    Restangular.one('groups', group_id)
                        .all('users')
                        .getList(),
                    success,
                    error
                );
            };

            this.getGroupMembersSlice = function getGroupMembersSlice(group_id, start, end, success, error) {
                andThen(
                    Restangular.one('groups', group_id)
                        .all('users')
                        .all('search')
                        .one('start', start)
                        .one('end', end)
                        .get(),
                    success,
                    error
                );
            };

            this.getGroupMembersSliceSearch = function getGroupMembersSliceSearch(group_id, start, end, query, success, error) {
                andThen(
                    Restangular.one('groups', group_id)
                        .all('users')
                        .all('search')
                        .one('start', start)
                        .one('end', end)
                        .customPOST({
                            query: query
                        }),
                    success,
                    error
                );
            };

            this.getGroupMember = function getGroupMember(group_id, user_id, success, error) {
                andThen(
                    Restangular.one('groups', group_id)
                        .one('users', user_id)
                        .get(),
                    success,
                    error
                )
            };

            function andThen(promise, success, error) {
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
