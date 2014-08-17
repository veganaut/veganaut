(function(module) {
    'use strict';

    module.directive('startTour', ['tourService', function(tourService) {

        return {
            restrict: 'A',
            scope: {
                startTour: '@'
            },
            link: function(scope) {
                var tourName = scope.startTour;
                tourService.startTour(tourName);
            }
        };
    }]);
})(window.veganaut.mainModule);
