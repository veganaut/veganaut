(function() {
    'use strict';

    /**
     * AngularPiwik class exposed to angular with the angularPiwik module.
     * @param $q
     * @param $window
     * @param $location
     * @param piwikDomain
     * @param siteId
     * @param enableTracking
     * @constructor
     */
    var AngularPiwik = function($q, $window, $location, piwikDomain, siteId, enableTracking) {
        /**
         * Reference to $q
         * @private
         */
        this._$q = $q;

        /**
         * The window object
         * @type {{}}
         * @private
         */
        this._$window = $window;

        /**
         * Reference to $location
         * @type {{}}
         * @private
         */
        this._$location = $location;

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
            //_paq.push(['trackPageView']); TODO: make it configurable whether this is done by default
            _paq.push(['enableLinkTracking']);
            _paq.push(['storeCustomVariablesInCookie']);

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
     * Tracks the given action.
     * Wrapper of the Piwik trackEvent method
     * @param {string} category Category of action
     * @param {string} action Short identifier of the action to be tracked
     * @param {string} [name] Name of the item that the action was done on
     * @param {number} [value] A numerical value to associate with the event
     */
    AngularPiwik.prototype.track = function(category, action, name, value) {
        // Don't do anything if not enabled
        if (!this._enabled) {
            return;
        }

        // Push to the tracking array
        this._$window._paq.push(['trackEvent', category, action, name, value]);
    };

    /**
     * Tracks a page view
     */
    AngularPiwik.prototype.trackPageView = function() {
        // Don't do anything if not enabled
        if (!this._enabled) {
            return;
        }

        // Set url to the correct one and track the page view
        this._$window._paq.push(['setCustomUrl', this._$location.absUrl()]);
        this._$window._paq.push(['trackPageView']);
    };

    /**
     * Wrapper of the Piwik setCustomVariable method.
     * Call this before trackPageView!
     * @param {number} index Variable index (between 1 - 5)
     * @param {string} name Name of the variable
     * @param {string} value Value to set
     * @param {string} scope 'visit' or 'page'
     */
    AngularPiwik.prototype.setCustomVariable = function(index, name, value, scope) {
        // Don't do anything if not enabled
        if (!this._enabled) {
            return;
        }

        // Push to Piwik
        this._$window._paq.push(['setCustomVariable', index, name, value, scope]);
    };

    /**
     * Wrapper of the Piwik getCustomVariable method.
     * @param {number} index Variable index (between 1 - 5)
     * @param {string} scope 'visit' or 'page'
     * @returns {promise}
     */
    AngularPiwik.prototype.getCustomVariable = function(index, scope) {
        var def = this._$q.defer();
        this._$window._paq.push([function() {
            def.resolve(this.getCustomVariable(index, scope));
        }]);
        return def.promise;
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

        this.$get = ['$q', '$window', '$location', function($q, $window, $location) {
            return new AngularPiwik($q, $window, $location, piwikDomain, siteId, enable);
        }];
    };

    /**
     * Piwik track filter
     * @memberof angularPiwik
     */
    var piwikFilter = function(piwik) {
        return function(input, category, action, name, value) {
            piwik.track(category, action, name, value);
        };
    };

    // Register the provider and filter
    angularPiwikModule.provider('angularPiwik', piwikProvider);
    angularPiwikModule.filter('track', ['angularPiwik', piwikFilter]);

    // Register a track function to root scope
    angularPiwikModule.run(['$rootScope', 'angularPiwik', function($rootScope, piwik) {
        // Need to wrap it, otherwise 'this' is not set correctly
        $rootScope.track = function(category, action, name, value) {
            piwik.track(category, action, name, value);
        };
    }]);
})();
