(function() {
    'use strict';

    angular
        .module('veganaut.app')
        .component('vgProductRating', productRatingComponent());

    function productRatingComponent() {
        return {
            bindings: {
                average: '<vgAverage',
                numRatings: '<vgNumRatings',
                maxRating: '@vgMaxRating'
            },
            controller: ProductRatingComponentController,
            templateUrl: '/veganaut/components/productRating/productRatingComponent.html'
        };
    }

    ProductRatingComponentController.$inject = [];
    function ProductRatingComponentController() {
        var $ctrl = this;

        var maxRating = $ctrl.maxRating || 5;

        // Prepare the icon array
        var icons = [];
        for (var i = 0; i < maxRating; i++) {
            icons.push({
                id: i
            });
        }

        /**
         * Returns the array of icons to be displayed
         * @returns {Array}
         */
        $ctrl.getIcons = function() {
            // Fill up the stars array with the right stars
            for (var i = 0; i < maxRating; i++) {
                // Check if this star should be active
                icons[i].iconName = 'star';
                icons[i].active = (i <= ($ctrl.average - 0.5));
                icons[i].noRating = false;

                // If the average is 0 (= no rating) make the last star a question mark
                if (i + 1 === maxRating && $ctrl.average === 0) {
                    icons[i].iconName = 'question-mark';
                    icons[i].noRating = true;
                }
            }
            return icons;
        };
    }
})();
