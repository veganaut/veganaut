(function() {
    'use strict';

    /* Directives */
    var monkeyFaceDirectives = angular.module('monkeyFace.directives', []);

    monkeyFaceDirectives.directive('appVersion', ['version', function(version) {
        return function(scope, elm /*, attrs*/) {
            elm.text(version);
        };
    }]);
})();
