(function(module) {
    'use strict';

    module.directive('vgProductMission', function() {
        return {
            restrict: 'E',
            scope: {
                mission: '=vgMission',
                onFinishMission: '=vgOnFinishMission'
            },
            controller: ['$scope', 'missions', function($scope, missions) {
                // Watch missions that should complete as soon as the outcome is set / changed
                var that = this;
                if (that.mission instanceof missions.rateProduct ||
                    that.mission instanceof missions.setProductAvail)
                {
                    $scope.$watch(function() {
                        return that.mission.outcome;
                    }, function(newValue, oldValue) {
                        if (newValue !== oldValue && that.mission.hasValidOutcome()) {
                            that.onFinishMission(that.mission);
                        }
                    });
                }
            }],
            controllerAs: 'productMission',
            bindToController: true,
            templateUrl: '/veganaut/missions/productMission.tpl.html'
        };
    });
})(window.veganaut.missionsModule);
