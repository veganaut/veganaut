(function(directivesModule) {
    'use strict';

    // TODO: not really sure how to treat tiny directives like this that are basically just a template

    directivesModule.directive('vgTeamBadge', [function() {
        return {
            restrict: 'E',
            scope: {
                team: '='
            },
            templateUrl: 'veganaut/components/vgTeamBadge.tpl.html'
        };
    }]);
})(window.monkeyFace.directivesModule);
