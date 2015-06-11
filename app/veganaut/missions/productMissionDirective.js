(function(module) {
    'use strict';

    module.directive('vgProductMission', function() {
        return {
            restrict: 'E',
            scope: {
                mission: '=vgMission'
            },
            controller: ['$scope', 'missions', function($scope, missions) {
                var that = this;

                that.finishMission = function() {
                    // TODO: this should of course not use the LocationDetailsCtrl method
                    $scope.$parent.finishMission(that.mission);
                };

                if (that.mission instanceof missions.rateOptions) {
                    $scope.$watch(function() {
                        return that.mission.outcome;
                    }, function(newValue, oldValue) {
                        if (newValue !== oldValue && that.mission.hasValidOutcome()) {
                            that.finishMission();
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
