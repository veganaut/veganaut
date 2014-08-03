(function(directivesModule) {
    'use strict';

    directivesModule.directive('vgLocation', [function() {
        return {
            restrict: 'E',
            scope: {
                loc: '=location'
            },
            templateUrl: 'veganaut/map/vgLocation.tpl.html'
        };
    }]);

    directivesModule.directive('vgLocationTypeBadge', [function() {
        return {
            restrict: 'E',
            scope: {
                loc: '=location'
            },
            templateUrl: 'veganaut/map/vgLocationTypeBadge.tpl.html'
        };
    }]);
})(window.monkeyFace.directivesModule);
