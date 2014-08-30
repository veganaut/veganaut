'use strict';

/* global describe, beforeEach, it, expect, inject */
describe('LocationModel.', function() {
    var Location;
    beforeEach(module('veganaut.app.map'));

    beforeEach(inject(function(_Location_) {
        Location = _Location_;
    }));

    it('is defined.', function() {
        expect(Location).toBeDefined();
        expect(typeof Location).toBe('function');
    });

    it('can be created from json.', function() {
        expect(typeof Location.fromJson).toBe('function', 'fromJson is a static function');
        var loc = Location.fromJson({});
        expect(loc instanceof Location).toBe(true, 'returns a Location object');
    });
});
