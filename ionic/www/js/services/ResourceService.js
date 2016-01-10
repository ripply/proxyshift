angular.module('scheduling-app.services')
    .service('ResourceService', [
        '$rootScope',
        '$controller',
        'Restangular',
        function($rootScope,
                 $controller,
                 Restangular
        ) {
            this.createLocation = function createLocation(group_id, state, city, address, zipcode, phonenumber, success, error) {
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
                    success,
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
                    success,
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
                    success,
                    error
                );
            };

            this.editType = function createType(group_id, type_id, title, description, cansendnotification, requiremeanagerapproval, grouppermission_id, success, error) {
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
                    success,
                    error
                );
            };

            this.deleteType = function deleteType(group_id, type_id, success, error) {
                andThen(
                    Restangular.one('groups', group_id)
                        .one('classes', type_id)
                        .remove(),
                    success,
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
