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

    it('getUrl returns the correct URL.', function() {
        var loc = new Location({id: 'test1234'});
        expect(loc.getUrl()).toBe('/location/test1234', 'correct url');
        expect(loc.getUrl(true)).toBe('/location/test1234/edit', 'correct edit url');
    });

    describe('getRoundedQuality.', function() {
        it('returns correct default value.', function() {
            var loc = new Location();
            expect(loc.getRoundedQuality()).toBe(0);
        });

        it('rounds correctly.', function() {
            var loc = new Location({ quality: { average: 1.2 } });
            expect(loc.getRoundedQuality()).toBe(1, 'rounds down');
            loc = new Location({ quality: { average: 2.5 } });
            expect(loc.getRoundedQuality()).toBe(3, 'rounds up');
        });

        it('returns value between 0 and 5.', function() {
            var loc = new Location({ quality: { average: 7.3 } });
            expect(loc.getRoundedQuality()).toBe(5, 'max 5');
            loc = new Location({ quality: { average: -3.2 } });
            expect(loc.getRoundedQuality()).toBe(0, 'min 0');

        });
    });

    describe('setActive and isActive.', function() {
        it('returns correct default value.', function() {
            var loc = new Location();
            expect(loc.isActive()).toBe(false);
        });

        it('can be activated.', function() {
            var loc = new Location();
            loc.setActive();
            expect(loc.isActive()).toBe(true, 'default is to set active');

            loc = new Location();
            loc.setActive(true);
            expect(loc.isActive()).toBe(true, 'can explicitly set active');
        });

        it('can be activated and deactivated.', function() {
            var loc = new Location();
            loc.setActive();
            expect(loc.isActive()).toBe(true, 'set active');
            loc.setActive(false);
            expect(loc.isActive()).toBe(false, 'set inactive');
        });
    });

    describe('icon.', function() {
        it('sets correct default value.', function() {
            var loc = new Location();
            var icon = loc.icon;
            expect(typeof icon).toBe('object', 'is an object');
            expect(icon.type).toBe('div', 'correct type');
            expect(icon.iconSize).toBe(null, 'correct iconSize');
            expect(typeof icon.html).toBe('string', 'correct html type');
            expect(icon.className).toMatch(/map-location/, 'className contains "map-location"');
        });

        it('updates icon className when changing active state.', function() {
            var loc = new Location();
            var icon = loc.icon;
            expect(icon.className).toNotMatch(/active/, 'does not have "active" class');
            loc.setActive();
            expect(icon.className).toMatch(/active/, 'has "active" class when setting active');
            loc.setActive(false);
            expect(icon.className).toNotMatch(/active/, '"active" class removed when setting inactive');
        });
    });
});
