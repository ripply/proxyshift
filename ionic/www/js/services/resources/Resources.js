"use strict";

var module = angular.module('scheduling-app.resources', [
    'ngResource',
    'scheduling-app.config'
]);

var GET = 'GET',
    POST = 'POST',
    PATCH = 'PATCH',
    PUT = 'PUT',
    DELETE = 'DELETE';

angular.forEach({
    'Users': function(url) {
        var base = url + '/users/:user_id';
        return {
            route: base,
            params: {
                user_id: '@user_id'
            },
            actions: {

                userinfo: {
                    method: GET,
                    url: url + '/userinfo'
                },
                settings: {
                    method: GET,
                    url: url + '/users/settings'
                },
                updateSettings: {
                    method: POST,
                    url: url + '/users/settings'
                },
                create: {
                    method: POST,
                    url: url + '/users'
                },
                deleteYourAccount: {
                    method: DELETE,
                    url: url + '/users'
                },
                passwordReset: {
                    method: POST,
                    url: url + '/users/passwordreset'
                },
                user: {
                    method: GET
                },
                update: {
                    method: PATCH
                },
                deleteAccount: {
                    method: DELETE
                }
            }
        }
    },
    'Shifts': function(url) {
        var base = url + '/shifts/:shift_id';
        return {
            route: base,
            params: {
                shift_id: '@shift_id',
                shiftapplication_id: '@shiftapplication_id'
            },
            actions: {
                get: {
                    method: GET,
                    url: base
                },
                patch: {
                    method: PATCH,
                    url: base
                },
                remove: {
                    method: DELETE,
                    url: base
                },
                all: {
                    method: GET,
                    url: url + '/shifts/all',
                    isArray: true
                },
                allNoIgnored: {
                    method: GET,
                    url: url + '/shifts/noignored/all',
                    isArray: true
                },
                allWithDividers: { // DUMMY
                    method: GET,
                    url: url + '/shifts/all',
                    isArray: true
                },
                allNoIgnoredWithDividers: { // DUMMY
                    method: GET,
                    url: url + '/shifts/noignored/all/dividers',
                    isArray: true
                },
                allAppliedOnly: {
                    method: GET,
                    url: url + '/shifts/all/appliedonly',
                    isArray: true
                },
                allNoIgnoredAppliedOnly: {
                    method: GET,
                    url: url + '/shifts/noignored/all/appliedonly',
                    isArray: true
                },
                expiredMyShifts: {
                    method: GET,
                    url: url + '/shifts/expired/all/appliedonly',
                    isArray: true
                },
                allAppliedOnlyWithDividers: { // DUMMY
                    method: GET,
                    url: url + '/shifts/all/appliedonly',
                    isArray: true
                },
                allNoIgnoredAppliedOnlyWithDividers: { // DUMMY
                    method: GET,
                    url: url + '/shifts/noignored/all/appliedonly',
                    isArray: true
                },
                new: {
                    method: GET,
                    url: url + '/shifts/new',
                    isArray: true
                },
                create: {
                    method: POST,
                    url: url + '/shifts/create',
                    isArray: true
                },
                managing: {
                    method: GET,
                    url: url + '/shifts/managing',
                    isArray: true
                },
                expiredManagingPending: {
                    method: GET,
                    url: url + '/shifts/expired/pending/managing',
                    isArray: true
                },
                expiredManagingNoApplications: {
                    method: GET,
                    url: url + '/shifts/expired/noapplications/managing',
                    isArray: true
                },
                expiredManagingApproved: {
                    method: GET,
                    url: url + '/shifts/expired/approved/managing',
                    isArray: true
                },
                mine: {
                    method: GET,
                    url: url + '/shifts/mine',
                    isArray: true
                },
                mineNoIgnored: {
                    method: GET,
                    url: url + '/shifts/noignored/mine',
                    isArray: true
                },
                expiredMine: {
                    method: GET,
                    url: url + '/shifts/expired/mine',
                    isArray: true
                },
                applications: {
                    method: GET,
                    url: url + '/shifts/application/:shiftapplication_id',
                    isArray: true
                },
                approve: {
                    method: POST,
                    url: url + '/shifts/application/:shiftapplication_id'
                },
                decline: {
                    method: PATCH,
                    url: url + '/shifts/application/:shiftapplication_id'
                },
                notify: {
                    method: POST,
                    url: base + '/notify'
                },
                register: {
                    method: POST,
                    url: base + '/register'
                },
                unregister: {
                    method: PUT,
                    url: base + '/register'
                },
                cancel: {
                    method: POST,
                    url: base + '/cancel'
                },
                uncancel: {
                    method: DELETE,
                    url: base + '/cancel'
                },
                ignored: {
                    method: GET,
                    url: base + '/ignore',
                    isArray: true
                },
                ignore: {
                    method: POST,
                    url: base + '/ignore'
                },
                unignore: {
                    method: DELETE,
                    url: base + '/ignore'
                }
            }
        }
    },
    'Groups': function(url) {
        var base = url + '/groups/:group_id';
        return {
            route: base,
            params: {
                group_id: '@group_id',
                class_id: '@class_id',
                user_id: '@user_id',
                permission_id: '@permission_id',
                start: '@start',
                end: '@end',
                location_id: '@location_id',
                area_id: '@area_id'
            },
            actions: {
                list: {
                    method: GET,
                        isArray: true
                },
                create: {
                    method: POST
                },
                get: {
                    method: GET
                },
                update: {
                    method: PATCH
                },
                remove: {
                    method: DELETE
                },
                classes: {
                    method: GET,
                    url: base + '/classes',
                    isArray: true
                },
                allClasses: {
                    method: GET,
                    url: url + '/groups/allclasses',
                    isArray: true
                },
                createClass: {
                    method: POST,
                    url: base + '/classes'
                },
                class: {
                    method: GET,
                    url: base + '/classes/:class_id'
                },
                updateClass: {
                    method: PATCH,
                    url: base + '/classes/:class_id'
                },
                removeClass: {
                    method: DELETE,
                    url: base + '/classes/:class_id'
                },
                users: {
                    method: GET,
                    url: base + '/users',
                    isArray: true
                },
                searchUsers: {
                    method: POST,
                    url: base + '/users',
                    isArray: true
                },
                inviteUser: {
                    method: POST,
                    url: base + '/users/invite'
                },
                user: {
                    method: GET,
                    url: base + '/users/:user_id'
                },
                uninviteUser: {
                    method: POST,
                    url: base + '/users/:user_id'
                },
                inviteUserWithPermissionAndClass: {
                    method: POST,
                    url: base + '/users/:user_id/classes/:class_id/permissions/:permission_id'
                },
                inviteUserWithPermission: {
                    method: POST,
                    url: base + '/users/:user_id/permissions/:permission_id'
                },
                updateUsersPermissions: {
                    method: PATCH,
                    url: base + '/users/:user_id/permissions/:permission_id'
                },
                usersStagger: {
                    method: GET,
                    url: base + '/users/search/start/:start/end/:end'
                },
                searchUsersStagger: {
                    method: POST,
                    url: base + '/users/search/start/:start/end/:end'
                },
                locations: {
                    method: GET,
                    url: base + '/locations',
                    isArray: true
                },
                createLocation: {
                    method: POST,
                    url: base + '/locations'
                },
                location: {
                    method: GET,
                    url: base + '/locations/:location_id'
                },
                updateLocation: {
                    method: PATCH,
                    url: base + '/locations/:location_id'
                },
                removeLocation: {
                    method: DELETE,
                    url: base + '/locations/:location_id'
                },
                areas: {
                    method: GET,
                    url: base + '/areas',
                    isArray: true
                },
                createArea: {
                    method: POST,
                    url: base + '/areas'
                },
                removeArea: {
                    method: DELETE,
                    url: base + '/areas/:area_id'
                },
                settings: {
                    method: GET,
                    url: base + '/settings'
                },
                updateSettings: {
                    method: POST,
                    url: base + '/settings'
                },
                permissions: {
                    method: GET,
                    url: base + '/permissions',
                    isArray: true
                },
                createPermission: {
                    method: POST,
                    url: base + '/permissions'
                },
                permission: {
                    method: GET,
                    url: base + '/permissions/:permission_id'
                },
                removePermission: {
                    method: DELETE,
                    url: base + '/permissions/:permission_id'
                },
                removePermissionConvertToOtherPermssion: {
                    method: DELETE,
                    url: base + '/permissions/:permission_id/newpermission/:newpermission_id'
                },
                userClassSubscribe: {
                    method: POST,
                    url: base + '/classes/:class_id/subscribe'
                },
                userClassUnsubscribe: {
                    method: DELETE,
                    url: base + '/classes/:class_id/subscribe'
                }
            }
        }
    },
    'Locations': function(url) {
        var locations = '/locations';
        var base = url + locations + '/:location_id';
        return {
            route: base,
            params: {
                location_id: '@location_id',
                sublocation_id: '@sublocation_id',
                groupuserclass_id: '@groupuserclass_id'
            },
            actions: {
                list: {
                    method: GET,
                    url: url + locations,
                    isArray: true
                },
                subscribe: {
                    method: POST,
                    url: base + '/subscribe'
                },
                unsubscribe: {
                    method: DELETE,
                    url: base + '/subscribe'
                },
                sublocationSubscribe: {
                    method: POST,
                    url: base + '/sublocation/:sublocation_id/subscribe'
                },
                sublocationUnsubscribe: {
                    method: DELETE,
                    url: base + '/sublocation/:sublocation_id/subscribe'
                },
                users: {
                    method: GET,
                    url: base + '/users',
                    isArray: true
                },
                managingShifts: {
                    method: GET,
                    url: base + '/shifts/managing',
                    isArray: true
                },
                shifts: {
                    method: GET,
                    url: base + '/shifts',
                    isArray: true
                },
                createShift: {
                    method: GET,
                    url: base + '/shifts/after/:after/before/:before',
                    isArray: true
                },
                shiftsForClass: {
                    method: GET,
                    url: base + '/shifts/:groupuserclass_id',
                    isArray: true
                },
                sublocations: {
                    method: GET,
                    url: base + '/sublocations',
                    isArray: true
                },
                createSublocation: {
                    method: POST,
                    url: base + '/sublocations'
                },
                createSublocationShift: {
                    method: GET,
                    url: base + '/sublocations/:sublocation_id/shifts/groupuserclass/:groupuserclass_id/start/:start/end/:end',
                    isArray: true
                },
                sublocation: {
                    method: GET,
                    url: base + '/sublocations/:sublocation_id'
                },
                updateSublocation: {
                    method: PATCH,
                    url: base + '/sublocations/:sublocation_id'
                },
                removeSublocation: {
                    method: DELETE,
                    url: base + '/sublocations/:sublocation_id'
                },
                manageJob: {
                    method: POST,
                    url: base + '/manage/:groupuserclass_id'
                },
                unmanageJob: {
                    method: DELETE,
                    url: base + '/manage/:groupuserclass_id'
                },
                manageJobAtSublocation: {
                    method: POST,
                    url: base + '/sublocation/:sublocation_id/manage/:groupuserclass_id'
                },
                unmanageJobAtSublocation: {
                    method: DELETE,
                    url: base + '/sublocation/:sublocation_id/manage/:groupuserclass_id'
                },
                listStagger: {
                    method: GET,
                    url: url + locations + '/search/start/:start/end/:end'
                },
                listSearchStagger: {
                    method: POST,
                    url: url + locations + '/search/start/:start/end/:end'
                }
            }
        }
    }
}, function(definition, modelName) {
    module
        .service(modelName + 'Model', [
            '$rootScope',
            '$resource',
            'GENERAL_CONFIG',
            function ($rootScope,
                      $resource,
                      GENERAL_CONFIG) {
                var url = GENERAL_CONFIG.APP_URL + GENERAL_CONFIG.APP_URL_API;
                var urlDefinition = definition(url);
                return $resource(
                    urlDefinition.route,
                    urlDefinition.params,
                    urlDefinition.actions
                );
            }
        ]
    );
});
