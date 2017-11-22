(function() {
    'use strict';

    /**
     * Directive to show a summary of the products available at a location.
     * The number of products that are shown can be set with the limitTo parameter.
     * @returns {directive}
     * @deprecated Use locationProductSummaryComponent in veganaut/components
     * @todo Remove with v1.0.0
     *
     * @example
     * <vg-location-product-summary
     *  vg-location="location"
     *  vg-limit-to="3">
     * </vg-location-product-summary>
     */
    var locationProductSummaryDirective = function() {
        return {
            restrict: 'E',
            scope: {
                // The location for which to show a summary list of products
                location: '=vgLocation',

                // Maximum number of products to show
                limitTo: '=vgLimitTo'
            },

            controller: [function() {
            }],
            controllerAs: 'locationProductSummaryVm',
            bindToController: true,
            templateUrl: '/veganaut/location/locationProductSummary.tpl.html'
        };
    };

    // Expose as directive
    angular.module('veganaut.app.location')
        .directive('vgLocationProductSummary', [locationProductSummaryDirective])
    ;
})();
