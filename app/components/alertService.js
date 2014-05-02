(function(servicesModule) {
    'use strict';

    // TODO: docu & tests
    servicesModule.provider('alertService', function() {
        var alerts = [];

        this.$get = function() {
            return {
                getAlerts: function() {
                    return alerts;
                },
                addAlert: function(message, type) {
                    alerts.push({
                        message: message,
                        type: type || 'info'
                    });
                },
                removeAllAlerts: function() {
                    alerts = [];
                },
                removeAlert: function(alert) {
                    for (var i = 0; i < alerts.length; i++) {
                        if (alerts[i] === alert) {
                            alerts.splice(i, 1);
                            break;
                        }
                    }
                }
            };
        };
    });
})(window.monkeyFace.servicesModule);
