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
        var loc = new Location({});
        expect(loc instanceof Location).toBe(true, 'created a Location object');
    });

    it('getUrl returns the correct URL', function() {
        var loc = new Location({id: 'test1234'});
        expect(loc.getUrl()).toBe('/location/test1234', 'correct url');
        expect(loc.getUrl(true)).toBe('/location/test1234/edit', 'correct edit url');
    });
});
