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
                    // TODO NOW: this should of course not use the LocationDetailsCtrl method, pass in a method that we'll call
                    $scope.$parent.finishMission(that.mission);
                };

                // Watch missions that should complete as soon as the outcome is set / changed
                if (that.mission instanceof missions.rateProduct ||
                    that.mission instanceof missions.setProductAvail)
                {
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
