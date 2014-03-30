(function(controllersModule) {
    'use strict';

    controllersModule.controller('ReferenceCodeCtrl', ['$scope', 'backend', 'alertProvider',
        function($scope, backend, alertProvider) {
            $scope.submitReferenceCode = function() {
                $scope.menuShown = false;
                backend.submitReferenceCode($scope.form.referenceCode)
                    .success(function() {
                        alertProvider.addAlert('Successfully submitted reference code', 'success');

                        // Reset form
                        $scope.form.referenceCode = '';

                        // Publish that the graph data has changed
                        $scope.$root.$emit('monkey.socialGraph.dataChanged');

                        // Show the graph
                        $scope.goToView('socialGraph');
                    })
                    .error(function(data) {
                        alertProvider.addAlert('Could not submit reference code: ' + data.error, 'danger');
                    })
                ;
            };
        }
    ]);
})(window.monkeyFace.controllersModule);
