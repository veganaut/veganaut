(function(module) {
    'use strict';

    module.controller('PersonCtrl', ['$scope', '$routeParams', 'backendService',
        function($scope, $routeParams, backendService) {
            if (!backendService.isLoggedIn()) {
                $scope.goToView('/register');
            }

            var personId = $routeParams.personId;
            backendService.getPerson(personId).then(function(person) {
                $scope.person = person;
            });
        }
    ]);
})(window.veganaut.userModule);
