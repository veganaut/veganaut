(function(module) {
    'use strict';

    module.directive('vgRankingTableRow', function() {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                row: '=vgRankingTableRow',
                trackingCategory: '@vgTrackingCategory'
            },
            templateUrl: '/veganaut/community/vgRankingTableRow.tpl.html'
        };
    });
})(window.veganaut.communityModule);
