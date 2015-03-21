(function(module) {
    'use strict';

    // TODO: not really sure how to treat tiny directives and filters like this

    module.directive('vgTeamPointsDisplay', [function() {
        return {
            restrict: 'E',
            scope: {
                location: '='
            },
            templateUrl: '/veganaut/map/vgTeamPointsDisplay.tpl.html'
        };
    }]);

    module.directive('vgMissionPoints', [function() {
        return {
            restrict: 'E',
            scope: {
                points: '='
            },
            templateUrl: '/veganaut/map/vgMissionPoints.tpl.html'
        };
    }]);

    module.directive('vgLocationTypeBadge', [function() {
        return {
            restrict: 'E',
            scope: {
                loc: '=location',
                onlyIcon: '='
            },
            templateUrl: '/veganaut/map/vgLocationTypeBadge.tpl.html'
        };
    }]);

    module.directive('vgTeamName', [function() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                team: '='
            },
            template: '<span class="color-{{ team }}" ng-bind="\'team.\' + team | translate"></span>'
        };
    }]);

    module.directive('vgLocationQualityIcon', [function() {
        return {
            restrict: 'E',
            scope: {
                location: '='
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
                $scope.range = [];
                for (var i = 1; i <= maxRating; i++) {
                    $scope.range.push(i);
                }
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
