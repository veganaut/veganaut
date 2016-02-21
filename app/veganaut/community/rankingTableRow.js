angular.module('veganaut.app.community').directive('vgRankingTableRow', function() {
    'use strict';
    return {
        restrict: 'A',
        replace: true,
        scope: {
            row: '=vgRankingTableRow',
            trackingCategory: '@vgTrackingCategory'
        },
        controller: [function() {}],
        controllerAs: 'rankingTableRowVm',
        bindToController: true,
        templateUrl: '/veganaut/community/rankingTableRow.tpl.html'
    };
});
