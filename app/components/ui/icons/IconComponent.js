(function() {
    'use strict';

    angular
        .module('veganaut.ui')
        .component('vgIcon', iconComponent());

    function iconComponent() {
        var component = {
            bindings: {
                name: '<vgName',
                label: '<?vgLabel'
            },
            controller: IconComponentController,
            controllerAs: 'vm',
            templateUrl: 'components/ui/icons/iconComponent.html'
        };

        return component;
    }

    // Inject dependencies
    // iconComponentController.$inject = ['exampleService'];

    function IconComponentController() {
        var vm = this;

        vm.iconPath = null;

        vm.$onInit = function() {
            vm.iconPath = '/components/ui/icons/assets/' + vm.name + '.svg';
        };
    }
})();