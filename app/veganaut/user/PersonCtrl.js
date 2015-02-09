(function(module) {
    'use strict';

    module.controller('PersonCtrl', ['$scope', '$routeParams', 'backendService', 'alertService',
        function($scope, $routeParams, backendService, alertService) {
            var personId = $routeParams.personId;
            backendService.getPerson(personId).success(function(person){
                if(person){
                    $scope.person = person;
                }
            });
        }
    ]);
})(window.veganaut.userModule);
