(function(servicesModule) {
    'use strict';

    /**
     * TODO: shouldn't need a provider for this
     * But how else do hand around the node that was selected
     * from the graph to the form?
     * activityLinkTargetProvider
     */
    servicesModule.provider('activityLinkTargetProvider', function() {
        var target;

        this.$get = function() {
            return {
                get: function() {
                    return target;
                },
                set: function(newTarget) {
                    target = newTarget;
                }
            };
        };
    });
})(window.monkeyFace.servicesModule);
