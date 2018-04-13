(function() {
    'use strict';

    angular
        .module('veganaut.ui')
        .component('vgIcon', iconComponent());

    function iconComponent() {
        var component = {
            bindings: {
                name: '<vgName'
            },
            controller: IconComponentController,
            controllerAs: '$ctrl',
            templateUrl: 'components/ui/icons/iconComponent.html'
        };

        return component;
    }

    function IconComponentController() {
    }
})();
