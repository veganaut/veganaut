(function() {
    'use strict';

    /**
     * AngularPiwik class exposed to angular with the angularPiwik module.
     * @param $q
     * @param $window
     * @param piwikDomain
     * @param siteId
     * @param enableTracking
     * @constructor
     */
    var AngularPiwik = function($q, $window, piwikDomain, siteId, enableTracking) {
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
            this._pushToPiwik(['enableLinkTracking']);
            this._pushToPiwik(['storeCustomVariablesInCookie']);

            // Slightly angularised piwik tracking code
            var doc = $window.document;
            this._pushToPiwik(['setTrackerUrl', piwikDomain + '/piwik.php']);
            this._pushToPiwik(['setSiteId', '' + siteId]);
            var script = doc.createElement('script');
            script.type = 'text/javascript';
            script.defer = true;
            script.async = true;
            script.src = piwikDomain + '/piwik.js';
            var existingScript = doc.getElementsByTagName('script')[0];
            existingScript.parentNode.insertBefore(script, existingScript);
        }
    };

    /**
     * Adds a call to a Piwik method to the global _paq array if tracking is enabled.
     * @param {[]} piwikCall
     * @private
     */
    AngularPiwik.prototype._pushToPiwik = function(piwikCall) {
        if (this._enabled) {
            this._$window._paq.push(piwikCall);
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
        this._pushToPiwik(['trackEvent', category, action, name, value]);
    };

    /**
     * Tracks a page view
     * @param {string} absUrl URL to set as custom URL
     * @param {string} pageTitle Title of the page to track
     */
    AngularPiwik.prototype.trackPageView = function(absUrl, pageTitle) {
        // Set url and page title to the correct one and track the page view
        this._pushToPiwik(['setCustomUrl', absUrl]);
        this._pushToPiwik(['setDocumentTitle', pageTitle]);
        this._pushToPiwik(['trackPageView']);
    };

    /**
     * Tracks a site search
     * @param {string} keyword
     * @param {string|boolean} [category=false]
     * @param {number|boolean} [searchCount=false]
     */
    AngularPiwik.prototype.trackSiteSearch = function(keyword, category, searchCount) {
        // Set default values
        if (!angular.isString(category)) {
            category = false;
        }
        if (!angular.isNumber(searchCount)) {
            searchCount = false;
        }
        this._pushToPiwik(['trackSiteSearch', keyword, category, searchCount]);
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
        this._pushToPiwik(['setCustomVariable', index, name, value, scope]);
    };

    /**
     * Wrapper of the Piwik getCustomVariable method.
     * @param {number} index Variable index (between 1 - 5)
     * @param {string} scope 'visit' or 'page'
     * @returns {promise}
     */
    AngularPiwik.prototype.getCustomVariable = function(index, scope) {
        var def = this._$q.defer();
        this._pushToPiwik([function() {
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
         * Set the domain of the piwik server, e.g. 'https://piwik.example.com'
         * (with protocol but without trailing slash)
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

        this.$get = ['$q', '$window', function($q, $window) {
            return new AngularPiwik($q, $window, piwikDomain, siteId, enable);
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
