"use strict";
angular.module('scheduling-app.services')
    .service('UserInfoService', [
        '$rootScope',
        'GENERAL_EVENTS',
        function($rootScope,
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

            this.getLocationList = function() {
                return locations;
            };

            this.getGroupList = function() {
                return groups;
            };

            var groups = {};
            var locations = {};
            var areas = {};

            this.updateUserInfo = function() {
                var userinfo = $rootScope.userinfo;

                // empty groups/locations/areas maps
                angular.forEach([
                    groups,
                    locations,
                    areas
                ], function(object) {
                    for (var key in object) {
                        delete object[key];
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
                        }
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
                }
            };
        }
    ]);
