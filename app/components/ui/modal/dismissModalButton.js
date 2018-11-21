(function() {
    'use strict';

    /**
     * Simple component that renders an "x" button to close a uibModal.
     * @type {{}}
     */
    var dismissModalButtonComponent = {
        bindings: {
            'onDismiss': '&vgOnDismiss',
            'text': '@?vgText'
        },
        templateUrl: '/components/ui/modal/dismissModalButton.tpl.html'
    };

    // Expose as directive
    angular.module('veganaut.ui')
        .component('vgDismissModalButton', dismissModalButtonComponent)
    ;
})();
