(function(module) {
    'use strict';

    // TODO: Move directives to veganaut/components in separate files

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
})(window.veganaut.mainModule);
