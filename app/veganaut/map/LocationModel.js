(function(module) {
    'use strict';

    /**
     * Location Model
     *
     * @param {string} id
     * @param {string} team
     * @param {number} lat
     * @param {number} lng
     * @param {string} title
     * @param {string} type
     * @param {{}} [points={}]
     * @param {number} availablePoints
     * @param {Date} nextVisitBonusDate
     * @constructor
     */
    var Location = function(id, team, lat, lng, title, type, points, availablePoints, nextVisitBonusDate) {
        this.id = id;
        this.team = team;
        this.lat = lat;
        this.lng = lng;
        this.title = title;
        this.type = type;
        this.points = points || {};
        this.availablePoints = availablePoints || 0;
        this.nextVisitBonusDate = nextVisitBonusDate;

        this._defaultIconClassList = 'map-location team-' + this.team;

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
        retail: 'retail'
    };

    /**
     * Creates a new Location object from the given JSON data
     * @param json
     * @returns {Location}
     */
    Location.fromJson = function(json) {
        // TODO: this is getting ridiculous
        return new Location(
            json.id,
            json.team,
            json.lat,
            json.lng,
            json.name,
            json.type,
            json.points,
            json.availablePoints,
            new Date(json.nextVisitBonusDate)
        );
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

    /**
     * Returns an array of all the points starting with the highest:
     * { team: 'color', points: 100 }
     * @returns {{}}
     */
    Location.prototype.getSortedPoints = function() {
        // TODO: should be possible to clear the memoiziation
        this.sortedPoints = this.sortedPoints || _.chain(this.points)
            .map(function(value, key) {
                return { team: key, points: value };
            })
            .sortBy('points')
            .reverse()
            .value()
        ;
        return this.sortedPoints;
    };

    /**
     * Gets the number of points of the second best team
     * @returns {number}
     */
    Location.prototype.getRunnerUpPoints = function() {
        var sorted = this.getSortedPoints();
        if (sorted.length > 1) {
            return sorted[1].points;
        }
        return 0;
    };

    /**
     * Gets the difference in points of the given team to the best team (negative),
     * or if the given team is the best team, the difference to the runner up (positive)
     * @param team
     * @returns {number}
     */
    Location.prototype.getRelevantPointDifference = function(team) {
        if (this.team === team) {
            return this.points[team] - this.getRunnerUpPoints();
        }
        return (this.points[team] || 0) - (this.points[this.team] || 0);
    };

    /**
     * Returns whether the user can get a visit bonus at this location
     * @returns {boolean}
     */
    Location.prototype.canGetVisitBonus = function() {
        // Calculate the diff to the nextVisitBonusDate and consider it ok if it's in up to a minute
        var untilNextVisitBonusDate = this.nextVisitBonusDate - new Date();
        return (untilNextVisitBonusDate < 60000);
    };


    module.value('Location', Location);
})(window.veganaut.mapModule);
