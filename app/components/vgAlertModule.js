(function() {
    'use strict';

    /**
     * Simple Module for handling alert messages. Provides a service to add and
     * remove alerts and directives to show these alerts.
     *
     * @type {module}
     */
    var alertModule = angular.module('veganaut.alert', ['ui.bootstrap']);

    /**
     * Default time for which an alert is shown
     * @type {number}
     */
    var DEFAULT_ALERT_TIMEOUT = 5000;


    /**
     * Simple object to represent an alert message
     *
     * @param {AlertService} alertService Reference to the service this alert belongs to
     * @param {string} message
     * @param {string} type
     * @constructor
     */
    var Alert = function(alertService, message, type) {
        this._alertService = alertService;
        this.message = message;
        this.type = type;
    };

    /**
     * Removes this alert from the list of alerts
     */
    Alert.prototype.remove = function() {
        this._alertService.removeAlert(this);
    };


    /**
     * Main service of the alertModule that manages to alert messages.
     * @param $interval
     * @constructor
     */
    var AlertService = function($interval) {
        /**
         * Angular $interval service
         * @type {*}
         * @private
         */
        this._$interval = $interval;

        /**
         * Stores all the alerts handled by this service.
         * Mapping of alert group name to arrays of alerts
         *
         * @type {{}}
         * @private
         */
        this._alerts = {};
    };

    /**
     * Returns the array of alerts
     * @param {string} [group='']
     * @returns {Array}
     */
    AlertService.prototype.getAlerts = function(group) {
        // Default group is empty
        group = group || '';

        // Check if this group exists already
        if (typeof this._alerts[group] === 'undefined') {
            this._alerts[group] = [];
        }
        return this._alerts[group];
    };

    /**
     * Add a new alert with the given message. By default the alert will be removed after
     * some time. Change the timeout to false or to another number to change that behaviour.
     *
     * @param {string} message
     * @param {string} [type='info'] One of 'danger', 'warning', 'info' or 'success'
     * @param {string} [group='']
     * @param {boolean|number} [timeout=DEFAULT_ALERT_TIMEOUT] Whether to hide remove the
     *      alert after the given time in ms
     */
    AlertService.prototype.addAlert = function(message, type, group, timeout) {
        var alert = new Alert(this, message, type || 'info');
        this.getAlerts(group).push(alert);

        // If it should be removed automatically, set the timeout
        if (timeout !== false) {
            if (!angular.isNumber(timeout)) {
                timeout = DEFAULT_ALERT_TIMEOUT;
            }

            // Why are we using $interval? Because of protractor.
            // It waits for $timeouts but not for $intervals. And we don't want
            // it to wait, otherwise it will never find the alerts
            this._$interval(function() {
                alert.remove();
            }, timeout, 1);
        }
    };

    /**
     * Remove all alerts
     */
    AlertService.prototype.removeAllAlerts = function() {
        // Go through all the alert groups and empty them
        for (var group in this._alerts) {
            if (this._alerts.hasOwnProperty(group)) {
                var alerts = this._alerts[group];
                // Remove all elements from the array. Not overwriting with a new empty array
                // because we want to keep the object.
                alerts.splice(0, alerts.length);
            }
        }
    };

    /**
     * Removes the given alert from the list of alerts
     *
     * @param alert
     */
    AlertService.prototype.removeAlert = function(alert) {
        // Go through all the alert groups to find the given alert
        for (var group in this._alerts) {
            if (this._alerts.hasOwnProperty(group)) {
                var alerts = this._alerts[group];
                var index = alerts.indexOf(alert);
                if (index >= 0) {
                    alerts.splice(index, 1);
                    break;
                }
            }
        }
    };

    // Expose as angular service
    alertModule.factory('alertService', ['$interval', function($interval) {
        return new AlertService($interval);
    }]);


    /**
     * Directive for displaying the alerts
     * @param alertService
     * @returns {directive}
     *
     * @example
     * // Renders a list of the alerts in the default group
     * <vg-alert-display></vg-alert-display>
     *
     * @example
     * // Renders a list of the alerts in the "sideBar" group
     * <vg-alert-display group="sideBar"></vg-alert-display>
     */
    var alertDisplayDirective = function(alertService) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                group: '@'
            },
            controller: ['$scope', function($scope) {
                // Get the alerts of the given group
                $scope.alerts = alertService.getAlerts($scope.group);
            }],
            template: '<alert ng-repeat="alert in alerts" type="{{ alert.type }}" close="alert.remove()">{{ alert.message }}</alert>'
        };
    };

    // Expose as directive
    alertModule.directive('vgAlertDisplay', ['alertService', alertDisplayDirective]);
})();
