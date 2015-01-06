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
                loc: '=location'
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
