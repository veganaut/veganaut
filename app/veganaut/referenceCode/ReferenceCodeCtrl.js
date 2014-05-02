(function(controllersModule) {
    'use strict';

    controllersModule.controller('ReferenceCodeCtrl', ['$scope', 'backendService', 'alertService',
        function($scope, backendService, alertService) {
            $scope.submitReferenceCode = function() {
                $scope.menuShown = false;
                backendService.submitReferenceCode($scope.form.referenceCode)
                    .success(function() {
                        alertService.addAlert('Successfully submitted reference code', 'success');

                        // Reset form
                        $scope.form.referenceCode = '';

                        // Publish that the graph data has changed
                        $scope.$root.$emit('monkey.socialGraph.dataChanged');

                        // Show the graph
                        $scope.goToView('socialGraph');
                    })
                    .error(function(data) {
                        alertService.addAlert('Could not submit reference code: ' + data.error, 'danger');
                    })
                ;
            };
        }
    ]);
})(window.monkeyFace.controllersModule);
