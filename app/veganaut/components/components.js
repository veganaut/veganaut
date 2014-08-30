(function(module) {
    'use strict';

    // TODO: not really sure how to treat tiny directives and filters like this

    module.directive('vgScoreDiffBadge', [function() {
        return {
            restrict: 'E',
            scope: {
                team: '=',
                diff: '='
            },
            controller: ['$scope', function($scope) {
                $scope.getTooltip = function() {
                    return 'location.score.explanation.scoreDiff.' +
                        (($scope.diff >= 0) ? 'positive' : 'negative');
                };
            }],
            templateUrl: '/veganaut/components/vgScoreDiffBadge.tpl.html'
        };
    }]);

    module.directive('vgAvailablePointsBadge', [function() {
        return {
            restrict: 'E',
            scope: {
                available: '='
            },
            templateUrl: '/veganaut/components/vgAvailablePointsBadge.tpl.html'
        };
    }]);

    module.filter('withSign', [function() {
        return function(value) {
            var sign = (value >= 0) ? '+' : '−'; // This is a minus sign, not a dash. Unicode, yeah
            return sign + Math.abs(value);
        };
    }]);
})(window.veganaut.mainModule);
