(function() {
    'use strict';

    /**
     * Simple component that renders a button to get to get to the filter modal.
     * @type {{}}
     */
    var filterButtonComponent = {
        controller: 'vgFilterButtonCtrl',
        templateUrl: '/veganaut/filter/filterButton.tpl.html'
    };

    var filterButtonCtrl = [
        'locationFilterService',
        function(locationFilterService) {
            var $ctrl = this;

            // Expose the filter service
            $ctrl.locationFilterService = locationFilterService;
        }
    ];

    // Expose as directive
    angular.module('veganaut.app.filter')
        .controller('vgFilterButtonCtrl', filterButtonCtrl)
        .component('vgFilterButton', filterButtonComponent)
    ;
})();
