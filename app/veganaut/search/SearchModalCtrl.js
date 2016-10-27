(function() {
    'use strict';

    /**
     * Controller for the global search modal. Contains input field and
     * shows first results.
     */
    var searchModalCtrl = [
        'angularPiwik', '$modalInstance',
        function (angularPiwik, $modalInstance) {
            var vm = this;

            /**
             * Dismiss the modal the modal
             */
            vm.onDismiss = function() {
                $modalInstance.dismiss();
            };

            /**
             * Handles result selection: minimise and track.
             * Showing the result location on the map is done by
             * vgGeocodeSearchResults
             */
            vm.onResultSelect = function() {
                // Close the modal (not dismiss, it was used successfully)
                $modalInstance.close();
            };
        }
    ];

    // Expose controller
    angular.module('veganaut.app.search')
        .controller('vgSearchModalCtrl', searchModalCtrl)
    ;
})();
