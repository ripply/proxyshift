angular.module('scheduling-app.controllers')
    .controller('BaseNewShiftController', [
        '$scope',
        '$rootScope',
        '$stateParams',
        '$controller',
        'UserInfoService',
        function($scope,
                 $rootScope,
                 $stateParams,
                 $controller,
                 UserInfoService
        ) {
            $controller('BaseModelController', {$scope: $scope});

            var splitter = '|';
            var subsplitter = '$';

            $scope.decodeDates = function(dates) {
                return dates.split(splitter);
            };

            $scope.encodeDates = function(dates) {
                return dates.join(splitter);
            };

            $scope.encodeWhens = function(whens) {
                var encoded = [];
                angular.forEach(whens, function(when, date) {
                    encoded.push($scope.encodeWhen(when, date));
                });
                return encoded.join(splitter);
            };

            $scope.encodeWhen = function(when, date) {
                return [date, encodeDate(when.starttime), encodeDate(when.endtime), encodeDate(when.length), when.employees].join(subsplitter);
            };

            // ordering of this matters, not sure if iterating over a javascript object preserves ordering everywhere
            var whenDecodeData = [
                ['date', noop],
                ['starttime', decodeDate],
                ['endtime', decodeDate],
                ['length', decodeDate],
                ['employees', noop]
            ];

            $scope.decodeWhens = function(encodedWhens) {
                var splitEncodedWhens = encodedWhens.split(splitter);
                var decodedWhens = {};
                angular.forEach(splitEncodedWhens, function(encodedWhen) {
                    var when = $scope.decodeWhen(encodedWhen);
                    decodedWhens[when.date] = when;
                });

                return decodedWhens;
            };

            $scope.decodeWhen = function(encodedWhen) {
                var splitEncodedWhen = encodedWhen.split(subsplitter);
                var decodedWhen = {};
                var index = 0;
                angular.forEach(whenDecodeData, function(individualDecodeData) {
                    var key = individualDecodeData[0];
                    var decodeFunction = individualDecodeData[1];
                    if (splitEncodedWhen.length > index) {
                        if (decodeFunction) {
                            decodedWhen[key] = decodeFunction(splitEncodedWhen[index]);
                        }
                        index++;
                    }
                });

                return decodedWhen;
            };

            $scope.encodeWhere = function(group_id, location_id, sublocation_id) {
                return [group_id, location_id, sublocation_id].join(splitter);
            };

            $scope.decodeWhere = function(encodedWhere) {
                var splitEncodedWhere = encodedWhere.split(splitter);
                var decodedWhere = {};
                if (splitEncodedWhere.length > 0) {
                    decodedWhere.group_id = splitEncodedWhere[0];
                }
                if (splitEncodedWhere.length > 1) {
                    decodedWhere.location_id = splitEncodedWhere[1];
                }
                if (splitEncodedWhere.length > 2) {
                    decodedWhere.sublocation_id = splitEncodedWhere[2];
                }

                return decodedWhere;
            };

            $scope.encodeWho = function(who) {
                return who.id;
            };

            $scope.decodeWho = function(encodedWho) {
                return {
                    id: encodedWho
                };
            };

            $scope.getStartEndTime = function(location_id, date, start, end, length) {
                var timezone = UserInfoService.getTimezoneAtLocation(location_id);
                var startOfShift = moment(date).tz(timezone).startOf('day').add(moment(start).format('x'), 'ms');
                var endOfShift = moment(end).tz(timezone).startOf('day').add(moment(length).format('x'), 'ms');
                return {
                    start: startOfShift,
                    end: endOfShift
                };
            };

            $scope.decodeDescription = noop;

            $scope.encodeDescription = noop;

            function encodeDate(date) {
                try {
                    return moment(date).format('x');
                } catch (e) {
                    // do nothing
                }
            }

            function decodeDate(date) {
                try {
                    return moment(parseInt(date));
                } catch (e) {
                    // do nothing
                }
            }

            function noop(arg) {
                return arg;
            }
        }
    ]
);
