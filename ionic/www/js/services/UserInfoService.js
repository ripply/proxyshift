"use strict";
angular.module('scheduling-app.services')
    .service('UserInfoService', [
        '$rootScope',
        'localStorageService',
        'GENERAL_EVENTS',
        function($rootScope,
                 localStorageService,
                 GENERAL_EVENTS
        ) {
            var MEMBER = 0;
            var PRIVILEGED = 1;

            this.MEMBER = MEMBER;
            this.PRIVILEGED = PRIVILEGED;

            var groupTypes = {
                memberOfGroups: MEMBER,
                privilegedMemberOfGroups: PRIVILEGED,
                ownedGroups: PRIVILEGED
            };

            var locationTypes = {
                memberOfLocations: MEMBER,
                privilegedMemberOfLocations: PRIVILEGED
            };

            var areaTypes = {
                areas: MEMBER
            };

            var userClassTypes = {
                userClasses: MEMBER
            };

            var showIgnoredShifts = getShowIgnoredShifts();

            this.getShowIgnoredShifts = getShowIgnoredShifts;

            function getShowIgnoredShifts() {
                if (showIgnoredShifts === undefined) {
                    showIgnoredShifts = localStorageService.get('showIgnoredShifts');
                    if (showIgnoredShifts === undefined || showIgnoredShifts === null) {
                        showIgnoredShifts = false;
                    }
                }
                return showIgnoredShifts;
            };

            this.setShowIgnoredShifts = setShowIgnoredShifts;

            function setShowIgnoredShifts(show) {
                showIgnoredShifts = show;
                if (localStorageService.isSupported) {
                    localStorageService.set('showIgnoredShifts', show);
                }
            };

            this.onUserInfoUpdate = function(scope, fn) {
                scope.$on(GENERAL_EVENTS.UPDATES.USERINFO.PROCESSED, fn);
            };

            this.getLocationList = function() {
                return locations;
            };

            this.getGroupList = function() {
                return groups;
            };

            this.getUserClasses = function() {
                return userclasses;
            };

            this.getUserClass = function(groupuserclass_id) {
                return allUserclasses[groupuserclass_id];
            };

            this.getUserclassesFromGroup = getUserclassesFromGroup;

            function getUserclassesFromGroup(group_id) {
                var group = getGroup(group_id);
                if (group) {
                    return group.userClasses;
                }
            }

            this.getGroupPermissionById = getGroupPermissionById;

            function getGroupPermissionById(grouppermission_id) {
                var groupPermissions = $rootScope.userinfo.allGroupPermissions;
                for (var i = 0; i < groupPermissions.length; i++) {
                    var grouppermission = groupPermissions[i];
                    if (grouppermission.id == grouppermission_id) {
                        return grouppermission;
                    }
                }
            }

            this.getManagingUserclassesForLocation = function(location_id) {
                var group_id = getGroupIdForLocation(location_id);
                var groupUserclasses = getUserclassesFromGroup(group_id);
                var managingclassesForGroup = {};
                angular.forEach(groupUserclasses, function(groupuserclass) {
                    if (managingclasses.hasOwnProperty(groupuserclass.id)) {
                        managingclassesForGroup[groupuserclass.id] = groupuserclass;
                    }
                });
                return managingclassesForGroup;
            };

            this.addManagingUserclassToGroup = function(userclass_id) {
                if (userclasses.hasOwnProperty(userclass_id)) {
                    managingclasses[userclass_id] = userclasses[userclass_id];
                }
            };

            this.removeManagingUserclassToGroup = function(userclass_id) {
                if (managingclasses.hasOwnProperty(userclass_id)) {
                    delete managingclasses[userclass_id];
                }
            };

            this.getSubscribableUserclassesFromGroup = function(group_id) {
                var userclasses = this.getUserclassesFromGroup(group_id);
                var subscribableUserClasses = [];
                var permissionlevel = this.getGroupPermissionLevel(group_id);
                angular.forEach(userclasses, function(userclass) {
                    var grouppermission = getGroupPermissionById(userclass.grouppermission_id);
                    if (grouppermission && grouppermission.permissionlevel <= permissionlevel) {
                        subscribableUserClasses.push(userclass);
                    }
                });
                return subscribableUserClasses;
            };

            this.getGroupPermissionLevel = function(group_id) {
                var usergroups = $rootScope.userinfo.usergroups;
                if (this.isGroupOwner(group_id)) {
                    return 99999999;
                }

                for (var i = 0; i < usergroups.length; i++) {
                    var usergroup = usergroups[i];
                    var grouppermission_id = usergroup.grouppermission_id;
                    var grouppermission = getGroupPermissionById(grouppermission_id);
                    if (grouppermission) {
                        return grouppermission.permissionlevel;
                    }
                }
            };

            this.isGroupOwner = function(group_id) {
                var groups = $rootScope.userinfo.ownedGroups;
                if (groups) {
                    for (var i = 0; i < groups.length; i++) {
                        var group = groups[i];
                        if (group.id == group_id) {
                            return true;
                        }
                    }
                }
                return false;
            };

            this.getUserclassesFromLocation = function(location_id) {
                return getUserclassesFromLocationOrSublocation(location_id, undefined);
            };

            this.getUserclassesFromSublocation = function(sublocation_id) {
                return getUserclassesFromLocationOrSublocation(undefined, sublocation_id);
            };

            this.isPrivilegedGroupMember = function isPrivilegedGroupMember(group_id) {
                return isMemberOf('privilegedMemberOfGroups', group_id);
            };

            this.isPrivilegedMemberOfLocation = function isPrivilegedMemberOfLocation(location_id) {
                return isMemberOf('privilegedMemberOfLocations', location_id);
            };

            function isMemberOf(key, id) {
                var userinfo = $rootScope.userinfo;
                if (userinfo.hasOwnProperty(key) && userinfo[key] instanceof Array) {
                    var list = userinfo[key];
                    for (var i = 0; i < list.length; i++) {
                        if (list[i].id == id) {
                            return true;
                        }
                    }
                }
                return false;
            }

            this.getUserclassesFromLocationOrSublocation = getUserclassesFromLocationOrSublocation;

            function getUserclassesFromLocationOrSublocation(location_id, sublocation_id) {
                var group_id = getGroupIdForLocation(location_id, sublocation_id);
                if (group_id !== undefined) {
                    return groups[group_id].userclasses;
                }
            }

            function getGroupIdForLocation(locationid, sublocationid) {
                var group_ids = Object.keys(groups);
                for (var i = 0; i < group_ids.length; i++) {
                    var group_id = group_ids[i];
                    var group = groups[group_id];
                    if (group.hasOwnProperty('locations')) {
                        var locations = group.locations;
                        if (locationid !== undefined) {
                            // check for location id
                            if (locations.hasOwnProperty(locationid)) {
                                return group_id;
                            }
                        } else {
                            // check sublocations
                            var location_ids = Object.keys(locations);
                            for (var j = 0; j < location_ids.length; j++) {
                                var location_id = location_ids[j];
                                var location = locations[location_id];
                                if (location.hasOwnProperty('sublocations')) {
                                    var sublocations = location.sublocations;
                                    if (sublocations instanceof Array) {
                                        // sublocations are sent by server so not indexed by id
                                        for (var k = 0; k < sublocations.length; k++) {
                                            var sublocation = sublocations[k];
                                            if (sublocation.id == sublocationid) {
                                                return group_id;
                                            }
                                        }
                                    } else {
                                        if (sublocations.hasOwnProperty(sublocationid)) {
                                            return group_id;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            this.getLocation = function getLocation(location_id) {
                if (location_id === undefined || location_id === null) {
                    return undefined;
                }
                if (locations.hasOwnProperty(location_id)) {
                    return locations[location_id];
                }
            };

            this.getTimezoneAtLocation = function getTimezoneAtLocation(location_id) {
                var location = this.getLocation(location_id);
                if (location) {
                    return location.timezone.name;
                }
            };

            this.getGroup = getGroup;

            function getGroup(group_id) {
                if (group_id === undefined || group_id === null) {
                    return undefined;
                }
                if (groups.hasOwnProperty(group_id)) {
                    return groups[group_id];
                }
            }

            this.getSublocation = function getSublocation(sublocation_id) {
                if (sublocation_id === undefined || sublocation_id === null) {
                    return undefined;
                }
                var location_ids = Object.keys(locations);
                for (var i = 0; i < location_ids.length; i++) {
                    var location = locations[location_ids[i]];
                    if (location && location.sublocations) {
                        for (var j = 0; j < location.sublocations.length; j++) {
                            var sublocation = location.sublocations[j];
                            if (sublocation && sublocation.id == sublocation_id) {
                                return sublocation;
                            }
                        }
                    }
                }
            };

            this.getLocationsMemberOfForGroup = function getLocationsForGroup(group_id) {
                if (group_id === undefined || group_id === null) {
                    return undefined;
                }
                var resultSet = [];
                var location_ids = Object.keys(locations);
                for (var i = 0; i < location_ids.length; i++) {
                    var location = locations[location_ids[i]];
                    if (location.hasOwnProperty('group_id') && location.group_id == group_id) {
                        resultSet.push(location);
                    }
                }

                return resultSet;
            };

            this.getLocationForSublocation = function getLocationForSublocation(sublocation_id) {
                if (sublocation_id === undefined || sublocation_id === null) {
                    return undefined;
                }
                var location_ids = Object.keys(locations);
                for (var i = 0; i < location_ids.length; i++) {
                    var location = locations[location_ids[i]];
                    if (location && location.sublocations) {
                        for (var j = 0; j < location.sublocations.length; j++) {
                            var sublocation = location.sublocations[j];
                            if (sublocation && sublocation.id == sublocation_id) {
                                return location;
                            }
                        }
                    }
                }
            };

            this.getUserId = function getUserId() {
                return $rootScope.userinfo.id;
            };

            var groups = {};
            var locations = {};
            var areas = {};
            var userclasses = {};
            var allUserclasses = {};
            var managingclasses = {};

            this.updateUserInfo = function updateUserInfo() {
                var userinfo = $rootScope.userinfo;
                angular.forEach(managingclasses, function(value, key) {
                    delete managingclasses[key];
                });

                // empty groups/locations/areas maps
                angular.forEach([
                    groups,
                    locations,
                    areas,
                    userclasses
                ], function(object) {
                    for (var key in object) {
                        if (object.hasOwnProperty(key)) {
                            delete object[key];
                        }
                    }
                });

                if (userinfo) {
                    angular.forEach([
                        // first get full list of groups
                        {
                            source: groupTypes,
                            dest: groups
                        },
                        // then locations
                        {
                            source: locationTypes,
                            dest: locations
                        },
                        {
                            source: areaTypes,
                            dest: areas
                        },
                        {
                            source: userClassTypes,
                            dest: userclasses
                        }
                    ], function(sourceDest) {
                        var dest = sourceDest.dest;
                        var source = sourceDest.source;
                        angular.forEach(source, function(privilegeLevel, type) {
                            if (userinfo.hasOwnProperty(type)) {
                                var list = userinfo[type];
                                if (list) {
                                    angular.forEach(list, function (place) {
                                        var id = place.id;
                                        if (!dest.hasOwnProperty(id)) {
                                            dest[id] = place;
                                            // store privilege level
                                            place.privilege = privilegeLevel;
                                        }
                                    });
                                }
                            }
                        });
                    });
                    angular.forEach(groups, function(group, group_id) {
                        if (group.hasOwnProperty('locations')) {
                            angular.forEach(group.locations, function(location) {
                                var id = location.id;
                                if (!locations.hasOwnProperty(id)) {
                                    locations[id] = location;
                                }
                            });
                        }
                    });
                    // now we have locations and groups in their own maps
                    // add all locations to their respective groups
                    angular.forEach([
                        {
                            source: locations,
                            attribute: 'locations'
                        },
                        {
                            source: areas,
                            attribute: 'areas'
                        }/*,
                        {
                            source: userclasses,
                            attribute: 'userclasses'
                        }*/
                    ], function(sourceAttribute) {
                        var source = sourceAttribute.source;
                        var attribute = sourceAttribute.attribute;
                        angular.forEach(source, function(place, source_id) {
                            var group_id = place.group_id;
                            if (group_id && groups.hasOwnProperty(group_id)) {
                                var group = groups[group_id];
                                if (!group.hasOwnProperty(attribute)) {
                                    group[attribute] = {};
                                }
                                if (!group[attribute].hasOwnProperty(source_id)) {
                                    group[attribute][source_id] = place;
                                }
                            }
                        });
                    });
                    // now we have a map of group_id => groups.locations => location_id => location
                    var foundIds = [];
                    angular.forEach([
                        'memberOfGroups',
                        'privilegedMemberOfGroups'
                    ], function(sourceAttribute) {
                        angular.forEach(userinfo[sourceAttribute], function(value, key) {
                            if (value.hasOwnProperty('userClasses')) {
                                var groupUserclasses = value.userClasses;
                                angular.forEach(groupUserclasses, function (groupUserclass) {
                                    if (allUserclasses.hasOwnProperty(groupUserclass.id)) {
                                        angular.copy(allUserclasses[groupUserclass.id], groupUserclass);
                                    } else {
                                        allUserclasses[groupUserclass.id] = angular.copy(groupUserclass);
                                    }
                                })
                            }
                            if (value.hasOwnProperty('managingclassesatlocation')) {
                                angular.forEach(value.managingclassesatlocation, function(managingclassatlocation) {
                                    if (!managingclasses.hasOwnProperty(managingclassatlocation.id)) {
                                        managingclasses[managingclassatlocation.id] = angular.clone(managingclassatlocation);
                                    }
                                });
                            }
                        });
                    });
                    angular.forEach([
                        'memberOfLocations',
                        'privilegedMemberOfLocations'
                    ], function(sourceAttribute) {
                        angular.forEach(userinfo[sourceAttribute], function(value, key) {
                            if (value.hasOwnProperty('managingclassesatlocations')) {
                                angular.forEach(value.managingclassesatlocations, function(managingclassatlocation) {
                                    if (!managingclasses.hasOwnProperty(managingclassatlocation.groupuserclass_id)) {
                                        managingclasses[managingclassatlocation.groupuserclass_id] = angular.copy(managingclassatlocation);
                                    }
                                });
                            }
                        });
                    });
                }
                $rootScope.$emit(GENERAL_EVENTS.UPDATES.USERINFO.PROCESSED, userinfo);
            };
        }
    ]);
