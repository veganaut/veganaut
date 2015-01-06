(function(module) {
    'use strict';

    module.controller('ChangeLocaleCtrl', ['$scope', 'localeService',
        function($scope, localeService) {
            var CHANGE_MAP = {
                de: 'en',
                en: 'de'
            };

            $scope.changeLocale = function() {
                localeService.changeLocale(CHANGE_MAP[localeService.getLocale()]);
            };
        }])
    ;
})(window.veganaut.userModule);
