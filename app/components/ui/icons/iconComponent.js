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
            templateUrl: 'components/ui/icons/iconComponent.html'
        };

        return component;
    }

    /**
     * List of icons that can be easily coloured because they only
     * have paths with one fill colour.
     * @type {string[]}
     */
    var COLOURABLE_ICONS = [
        'chevron-big-down',
        'edit',
        'pen'
    ];

    function IconComponentController() {
        var $ctrl = this;

        $ctrl.isColourable = function() {
            return (COLOURABLE_ICONS.indexOf($ctrl.name) >= 0);
        };
    }
})();
