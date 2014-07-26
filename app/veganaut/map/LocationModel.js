(function(modelsModule) {
    'use strict';

    /**
     * Defines the available icons for the map markers
     * @type {{}}
     */
    var icons = {
        blue: {
            type: 'div',
            iconSize: null, // Will be set in CSS,
            className: 'blueMarker'
        },
        green: {
            type: 'div',
            iconSize: null,
            className: 'greenMarker'
        }
    };

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
        this.icon = icons[team];
    };


    modelsModule.value('Location', Location);
})(window.monkeyFace.modelsModule);
