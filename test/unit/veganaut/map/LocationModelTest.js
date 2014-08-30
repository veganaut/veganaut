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

    it('knows when you can make a visitBonus mission.', function() {
        var loc = new Location(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
            new Date()
        );
        expect(typeof loc.canGetVisitBonus).toBe('function', 'has a canGetVisitBonus method');
        expect(loc.canGetVisitBonus()).toBe(true, 'can get visit bonus if nextVisitBonusDate is now');

        loc = new Location(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
            new Date(Date.now() - 1000 * 3600)
        );
        expect(loc.canGetVisitBonus()).toBe(true, 'can get visit bonus if nextVisitBonusDate is in the past');

        loc = new Location(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
            new Date(Date.now() + 1000 * 3600)
        );
        expect(loc.canGetVisitBonus()).toBe(false, 'cannot get visit bonus if nextVisitBonusDate is in the future');
    });
});
