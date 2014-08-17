(function(module) {
    'use strict';

    // TODO: temporary hack to have a unique id, will be provided by backend
    var lastId = 0;

    /**
     * Location Model
     *
     * @param {number} lat
     * @param {number} lng
     * @param {string} team
     * @param {string} title
     * @param {string} type
     * @constructor
     */
    var Location = function(lat, lng, team, title, type) {
        lastId += 1;
        this.id = lastId;
        this.lat = lat;
        this.lng = lng;
        this.team = team;
        this.title = title;
        this.type = type;

        this._defaultIconClassList = 'mapLocation team-' + this.team;

        this.icon = {
            type: 'div',
            iconSize: null, // Needs to be set to null so it can be specified in CSS
            className: this._defaultIconClassList
        };

        this._active = false;
    };

    /**
     * The possible types of locations
     * @type {{gastronomy: string, retail: string, event: string, private: string}}
     */
    Location.TYPES = {
        gastronomy: 'gastronomy',
        retail: 'retail',
        event: 'event',
        'private': 'private'
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


    module.value('Location', Location);
})(window.veganaut.mapModule);
