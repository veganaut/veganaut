(function(module) {
    'use strict';

    module.controller('PersonCtrl', ['$scope', '$routeParams', 'backendService',
        function($scope, $routeParams, backendService) {
            var personId = $routeParams.personId;
            backendService.getPerson(personId).success(function(person){
                if(person){
                    $scope.person = person;
                }
            });
        }
    ]);
})(window.veganaut.userModule);
