(function(directivesModule) {
    'use strict';

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
