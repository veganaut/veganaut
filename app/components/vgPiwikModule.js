(function() {
    'use strict';

    /**
     * AngularPiwik class exposed to angular with the angularPiwik module.
     * @param $window
     * @param piwikDomain
     * @param siteId
     * @param enableTracking
     * @constructor
     */
    var AngularPiwik = function($window, piwikDomain, siteId, enableTracking) {
        /**
         * The window object
         * @type {Object}
         * @private
         */
        this._$window = $window;

        // Make sure the piwik _paq array exists
        this._$window._paq = this._$window._paq || [];

        /**
         * Whether to track any events
         * @type {boolean}
         * @private
         */
        this._enabled = enableTracking;

        // Check if we should include the tracking code
        if (this._enabled === true && typeof piwikDomain !== 'undefined' && typeof siteId !== 'undefined') {
            // Set up piwik
            var _paq = this._$window._paq;
            _paq.push(['trackPageView']);
            _paq.push(['enableLinkTracking']);

            // Slightly angularised piwik tracking code
            var doc = $window.document;
            var url = (('https:' === doc.location.protocol) ? 'https' : 'http') + '://' + piwikDomain + '/';
            _paq.push(['setTrackerUrl', url + 'piwik.php']);
            _paq.push(['setSiteId', '' + siteId]);
            var script = doc.createElement('script');
            script.type = 'text/javascript';
            script.defer = true;
            script.async = true;
            script.src = url + 'piwik.js';
            var existingScript = doc.getElementsByTagName('script')[0];
            existingScript.parentNode.insertBefore(script, existingScript);
        }
    };

    /**
     * Tracks the given action
     * @param {string} action Short identifier of the action to be tracked
     */
    AngularPiwik.prototype.track = function(action) {
        // Don't do anything if not enabled
        if (!this._enabled) {
            return;
        }

        // Push to the tracking array
        this._$window._paq.push([
            'trackEvent',
            this._$window.document.title,
            action
        ]);
    };


    /**
     * Angular Piwik Analytics Module: track events and page views to Piwik analytics
     *
     * The angularPiwik provider can be configured with the server settings. If
     * piwikDomain and siteId is given and tracking is enabled, then the Piwik
     * tracking code is generated and included.
     *
     * @example
     * // Use the 'track' filter to track an action for example on a ng-click.
     * // The filter takes the action as argument: a short string, e.g. edit/abort task
     * <button ng-click="task.anyFunc() | track:'action'">Track It</button>
     *
     * @example
     * // Use the track() method on the $rootScope from anywhere in the template.
     * // Again with the above argument:
     * <a ng-click="track('link')">link</a>
     *
     * @namespace angularPiwik
     */
    var angularPiwikModule = angular.module('veganaut.angularPiwik', []);

    /**
     * Piwik tracking provider
     * @memberof angularPiwik
     */
    var piwikProvider = function() {
        // Configuration values
        var enable = true;
        var piwikDomain;
        var siteId;

        /**
         * Set whether to enable any tracking to Piwik
         * @param shouldEnable {boolean}
         */
        this.enableTracking = function(shouldEnable) {
            enable = !!shouldEnable;
        };

        /**
         * Set the domain of the piwik server, e.g. 'piwik.example.com'
         * @param domain {string}
         */
        this.setPiwikDomain = function(domain) {
            piwikDomain = domain;
        };

        /**
         * Set the piwik server site id, e.g. 5
         * @param id {number}
         */
        this.setSiteId = function(id) {
            siteId = id;
        };

        this.$get = ['$window', function($window) {
            return new AngularPiwik($window, piwikDomain, siteId, enable);
        }];
    };

    /**
     * Piwik track filter
     * @memberof angularPiwik
     */
    var piwikFilter = function(piwik) {
        return function(input, action) {
            piwik.track(action);
        };
    };

    // Register the provider and filter
    angularPiwikModule.provider('angularPiwik', piwikProvider);
    angularPiwikModule.filter('track', ['angularPiwik', piwikFilter]);

    // Register a track function to root scope
    angularPiwikModule.run(['$rootScope', 'angularPiwik', function($rootScope, piwik) {
        // Need to wrap it, otherwise 'this' is not set correctly
        $rootScope.track = function(action) {
            piwik.track(action);
        };
    }]);
})();
