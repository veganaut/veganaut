(function() {
    'use strict';

    /**
     * Controller for simple modals (uibModal) that dismiss and closing functionality.
     * Can be used together with vgDismissModalButton.
     */
    var filterModalCtrl = [
        '$modalInstance',
        function ($modalInstance) {
            var $ctrl = this;

            /**
             * Dismiss the modal (modal will return an error)
             * @param {string} [reason] Optional reason for dimissing the modal
             */
            $ctrl.onDismiss = function(reason) {
                $modalInstance.dismiss(reason);
            };


            /**
             * Closes the modal (modal will return successfully)
             * @param {*} [result] Optional result of the modal
             */
            $ctrl.onClose = function(result) {
                $modalInstance.close(result);
            };
        }
    ];

    // Expose controller
    angular.module('veganaut.ui')
        .controller('vgSimpleModalCtrl', filterModalCtrl)
    ;
})();
