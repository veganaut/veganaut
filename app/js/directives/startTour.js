(function(directivesModule) {
    'use strict';

    directivesModule.directive('startTour', ['tourProvider', function(tourProvider) {

        return {
            restrict: 'A',
            scope: {
                startTour: '@'
            },
            link: function(scope) {
                var tourName = scope.startTour;
                tourProvider.startTour(tourName);
            }
        };
    }]);
})(window.monkeyFace.directivesModule);
