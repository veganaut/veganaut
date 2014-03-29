(function(directivesModule) {
    'use strict';
    directivesModule.directive('stopPropagation', function () {
        return {
            restrict: 'A',
            link: function (scope, element) {
                element.bind('click', function (event) {
                    event.stopPropagation();
                });
            }
        };
    });
})(window.monkeyFace.directivesModule);