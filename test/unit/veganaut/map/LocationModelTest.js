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
            expect(typeof loc.isActive).toBe('function', 'isActive is a function');
            expect(typeof loc.setActive).toBe('function', 'setActive is a function');
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

    describe('getSortedPoints.', function() {
        it('returns sensible default value', function() {
            var loc = new Location();
            expect(typeof loc.getSortedPoints).toBe('function', 'getSortedPoints is a function');
            var points = loc.getSortedPoints();
            expect(typeof points).toBe('object', 'is an array (object)');
            expect(points.length).toBe(0, 'is empty array');
        });

        it('returns points in correct format', function() {
            var loc = new Location({ points: {
                team1: 10
            }});
            var points = loc.getSortedPoints();
            expect(points.length).toBe(1, 'there is 1 point');
            expect(typeof points[0]).toBe('object', 'contains an object');
            expect(points[0].team).toBe('team1', 'object has the team set');
            expect(points[0].points).toBe(10, 'object has the points set');
        });

        it('returns sorted points', function() {
            var loc = new Location({ points: {
                team1: 10,
                team2: 30,
                team3: 20,
                team4: 5
            }});
            var points = loc.getSortedPoints();
            expect(points.length).toBe(4, 'there are 4 point objects');
            expect(points[0].team).toBe('team2', 'correct team in position 1');
            expect(points[1].team).toBe('team3', 'correct team in position 2');
            expect(points[2].team).toBe('team1', 'correct team in position 3');
            expect(points[3].team).toBe('team4', 'correct team in position 4');
            expect(points[0].points).toBe(30, 'correct points in position 1');
            expect(points[1].points).toBe(20, 'correct points in position 2');
            expect(points[2].points).toBe(10, 'correct points in position 3');
            expect(points[3].points).toBe( 5, 'correct points in position 4');
        });

        // TODO: test memoization?
    });
});
