(function(module) {
    'use strict';

    module.controller('ChangeLocaleCtrl', ['$scope', 'i18nSettings', 'localeService',
        function($scope, i18nSettings, localeService) {
            $scope.availableLocales = i18nSettings.availableLocales;
            $scope.localeNames = i18nSettings.localeNames;
            $scope.currentLocale = localeService.getLocale();

            $scope.changeLocale = function(newLocale) {
                if (localeService.changeLocale(newLocale)) {
                    $scope.currentLocale = newLocale;
                }
            };
        }])
    ;
})(window.veganaut.userModule);
