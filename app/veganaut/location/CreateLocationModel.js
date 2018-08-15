angular.module('veganaut.app.location').factory('CreateLocation', [
    'Location', 'angularPiwik',
    function(Location, angularPiwik) {
        'use strict';
        /**
         * Model for creating a new Veganaut location
         *
         * @param {Leaflet.Map} map
         * @constructor
         */
        var CreateLocation = function(map) {
            /**
             * The location that is being created
             * @type {Location}
             */
            this.newLocation = new Location();
            this.newLocation.setEditing(true);

            /**
             * Current step of the create location process
             * @type {number}
             */
            this.step = 1;

            /**
             * Map on which the location is created.
             * @type {Leaflet.Map}
             */
            this.map = map;

            /**
             * Whether the create location form is minimised
             * @type {boolean}
             */
            this.isMinimised = false;
        };

        /**
         * Whether we are currently placing a location on the map
         * @returns {boolean}
         */
        CreateLocation.prototype.isPlacingLocation = function() {
            return (this.step === 3);
        };

        /**
         * Goes to the next step if the current step is valid and there is a next step.
         */
        CreateLocation.prototype.nextStep = function() {
            if (this.stepIsValid() && !this.isLastStep()) {
                this.step += 1;
                this.isMinimised = false;
                this.newLocation.updateMarker();
                angularPiwik.track('map.addLocation', 'nextStep', this.step); // TODO: don't use 3rd arg
            }
        };

        /**
         * Goes one step back (if there is a previous step)
         */
        CreateLocation.prototype.previousStep = function() {
            if (this.step > 1) {
                this.step -= 1;
                this.isMinimised = false;
                this.newLocation.updateMarker();
                angularPiwik.track('map.addLocation', 'previousStep', this.step); // TODO: don't use 3rd arg
            }
        };

        /**
         * Checks whether the current step is valid
         * @returns {boolean}
         */
        CreateLocation.prototype.stepIsValid = function() {
            var loc = this.newLocation;
            switch (this.step) {
            case 1:
                return (angular.isString(loc.type) && loc.type.length > 0);
            case 2:
                return (angular.isString(loc.name) && loc.name.length > 0);
            case 3:
                return (angular.isNumber(loc.lat) && angular.isNumber(loc.lng));
            default:
                return false;
            }
        };

        /**
         * Checks whether the current step is the last step
         * @returns {boolean}
         */
        CreateLocation.prototype.isLastStep = function() {
            return (this.step === 3);
        };

        /**
         * Sets the given coordinates as the lat/lng of the location
         * that is being created.
         * @param {number} lat
         * @param {number} lng
         */
        CreateLocation.prototype.setNewLocationCoordinates = function(lat, lng) {
            // Set the coordinates
            this.newLocation.setLatLng(lat, lng);

            // Minimise the component
            this.isMinimised = true;

            // Zoom in all the way to make sure users place it precisely
            // TODO: duplication with EditLocationCtrl, could move this to a LocationModel method
            var maxZoom = this.map.getMaxZoom();
            var zoomTo = [lat, lng];
            if (this.map.getZoom() < maxZoom ||
                !this.map.getBounds().contains(zoomTo))
            {
                this.map.setView(zoomTo, maxZoom);
            }
        };

        return CreateLocation;
    }
]);
