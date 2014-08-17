(function(module) {
    'use strict';

    // TODO: not really sure how to treat tiny directives like this that are basically just a template

    module.directive('vgTeamBadge', [function() {
        return {
            restrict: 'E',
            scope: {
                team: '='
            },
            templateUrl: 'veganaut/components/vgTeamBadge.tpl.html'
        };
    }]);
})(window.veganaut.mainModule);
