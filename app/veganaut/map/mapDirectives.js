(function(module) {
    'use strict';

    // TODO: Move directives to veganaut/components in separate files

    module.directive('vgMissionPoints', [function() {
        return {
            restrict: 'E',
            scope: {
                points: '=vgPoints',
                completed: '=vgCompleted',
                hidePoints: '=vgHidePoints'
            },
            templateUrl: '/veganaut/map/vgMissionPoints.tpl.html'
        };
    }]);

    module.directive('vgLocationTypeBadge', [function() {
        return {
            restrict: 'E',
            scope: {
                loc: '=location'
            },
            templateUrl: '/veganaut/map/vgLocationTypeBadge.tpl.html'
        };
    }]);

    module.directive('vgLocationTypeIcon', [function() {
        return {
            restrict: 'E',
            scope: {
                type: '='
            },
            controller: ['$scope', 'Location', function($scope, Location) {
                this.getIconName = function() {
                    return Location.getIconNameForType($scope.type);
                };
            }],
            controllerAs: '$ctrl',
            template: '<vg-icon ng-if="$ctrl.getIconName()" vg-name="$ctrl.getIconName()"></vg-icon>'
        };
    }]);

    module.directive('vgLocationQualityIcon', [function() {
        return {
            restrict: 'E',
            scope: {
                location: '=',
                size: '='
            },
            templateUrl: '/veganaut/map/vgLocationQualityIcon.tpl.html'
        };
    }]);

    module.directive('vgLocationEffortIcon', [function() {
        return {
            restrict: 'E',
            scope: {
                location: '='
            },
            templateUrl: '/veganaut/map/vgLocationEffortIcon.tpl.html',
            controller: ['$scope', function($scope) {
                /**
                 * Returns the icon name matching an average effortValue
                 *
                 * @param effortAverage
                 * @returns iconName
                 */
                $scope.getEffortAverageIcon = function(effortAverage) {
                    var iconName;
                    if (effortAverage >= 0.75) {
                        iconName = 'wi-day-sunny';
                    }
                    else if (effortAverage >= 0) {
                        iconName = 'wi-day-cloudy';
                    }
                    else if (effortAverage >= -0.75) {
                        iconName = 'wi-cloudy';
                    }
                    else {
                        iconName = 'wi-thunderstorm';
                    }
                    return iconName;
                };
            }

            ]
        };
    }]);

    module.directive('vgAverageRating', [function() {
        return {
            restrict: 'E',
            scope: {
                average: '=',
                numRatings: '=',
                maxRating: '@'
            },
            templateUrl: '/veganaut/map/vgAverageRating.tpl.html',
            controller: ['$scope', function($scope) {
                var maxRating = $scope.maxRating || 5;

                // Prepare the stars array
                var stars = [];
                for (var i = 0; i < maxRating; i++) {
                    stars.push({
                        id: i,
                        state: 0 // New
                    });
                }

                /**
                 * Returns the array of stars (icons) to be displayed
                 * @returns {Array}
                 */
                $scope.getStars = function() {
                    // Fill up the stars array with the right stars
                    for (var i = 0; i < maxRating; i++) {
                        // Either an empty or full star
                        // Important: Don't access icon anymore and use state instead. icon is deprecated.
                        var icon = 'glyphicon-star-empty';
                        var state = 0;
                        if (i <= ($scope.average - 0.5)) {
                            icon = 'glyphicon-star';
                            state = 1;
                        }

                        // If the average is 0 (= no rating) make the middle star a question mark
                        if (i === Math.floor(maxRating/2) && $scope.average === 0) {
                            icon = 'glyphicon-question-sign';
                        }

                        // Set the icon
                        stars[i].icon = icon;
                        stars[i].state = state;
                    }
                    return stars;
                };
            }]
        };
    }]);

    module.filter('withSign', [function() {
        return function(value) {
            var sign = (value >= 0) ? '+' : '−'; // This is a minus sign, not a dash. Unicode, yeah
            return sign + Math.abs(value);
        };
    }]);
})(window.veganaut.mainModule);
