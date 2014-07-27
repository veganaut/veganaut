(function(modelsModule) {
    'use strict';

    /**
     * Location Model
     *
     * @param {number} lat
     * @param {number} lng
     * @param {string} team
     * @param {string} title
     * @constructor
     */
    var Location = function(lat, lng, team, title) {
        this.lat = lat;
        this.lng = lng;
        this.team = team;
        this.title = title;

        this._defaultIconClassList = 'mapLocation team-' + this.team;

        this.icon = {
            type: 'div',
            iconSize: null, // Needs to be set to null so it can be specified in CSS
            className: this._defaultIconClassList
        };

        this._active = false;
    };

    /**
     * Sets the location as active or inactive
     * @param {boolean} [isActive=true]
     */
    Location.prototype.setActive = function(isActive) {
        if (typeof isActive === 'undefined') {
            isActive = true;
        }
        this._active = isActive;

        // Set the correct icon class
        this.icon.className = this._defaultIconClassList;
        if (this._active) {
            this.icon.className += ' active';
        }

    };

    /**
     * Whether the location is active
     * @returns {boolean}
     */
    Location.prototype.isActive = function() {
        return this._active;
    };


    modelsModule.value('Location', Location);
})(window.monkeyFace.modelsModule);
