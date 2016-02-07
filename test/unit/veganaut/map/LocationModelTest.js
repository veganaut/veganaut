'use strict';

/* global describe, beforeEach, it, expect, inject */
describe('LocationModel.', function() {
    var Location, playerService;
    beforeEach(module('veganaut.app.map'));

    beforeEach(module(function($provide) {
        // Set up all the mock dependencies
        playerService = {
            getImmediateMe: jasmine.createSpy('getImmediateMe'),
            getDeferredMe: jasmine.createSpy('getDeferredMe')
                .andReturn({
                    then: function() {
                    }
                })
        };

        $provide.value('playerService', playerService);
    }));

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

    describe('setDisabled and isDisabled.', function() {
        it('returns correct default value.', function() {
            var loc = new Location();
            expect(typeof loc.isDisabled).toBe('function', 'isDisabled is a function');
            expect(typeof loc.setDisabled).toBe('function', 'setDisabled is a function');
            expect(loc.isDisabled()).toBe(false);
        });

        it('can be set to hidden.', function() {
            var loc = new Location();
            loc.setDisabled();
            expect(loc.isDisabled()).toBe(true, 'default is to set hidden');

            loc = new Location();
            loc.setDisabled(true);
            expect(loc.isDisabled()).toBe(true, 'can explicitly set hidden');
        });

        it('can be hidden and shown.', function() {
            var loc = new Location();
            loc.setDisabled();
            expect(loc.isDisabled()).toBe(true, 'set hidden');
            loc.setDisabled(false);
            expect(loc.isDisabled()).toBe(false, 'set shown');
        });
    });

    describe('markerDefinition.', function() {
        it('has a marker definition.', function() {
            var loc = new Location();
            var markerDefinition = loc.getMarkerDefinition();
            expect(typeof markerDefinition).toBe('object', 'markerDefinition is an object');

            expect(typeof markerDefinition.icon).toBe('object', 'icon is an object');
            expect(markerDefinition.icon.iconSize).toBe(null, 'correct iconSize');
            expect(typeof markerDefinition.icon.html).toBe('string', 'correct html type');
            expect(markerDefinition.icon.className).toMatch(/\bmarker\b/, 'className contains "marker"');
        });

        it('added the location name to the marker definition.', function() {
            var loc = new Location({
                name: 'test name'
            });
            expect(loc.getMarkerDefinition().base.title).toBe('test name');
        });

        it('updates marker icon className when changing active state.', function() {
            var loc = new Location();
            var classRegex = /\bmarker--active\b/;
            expect(loc.getMarkerDefinition().icon.className).not.toMatch(classRegex, 'does not have active class');
            loc.setActive();
            expect(loc.getMarkerDefinition().icon.className).toMatch(classRegex, 'has active class when setting active');
            loc.setActive(false);
            expect(loc.getMarkerDefinition().icon.className).not.toMatch(classRegex, 'active class removed when setting inactive');
        });

        it('updates marker icon className when changing disabled state.', function() {
            var loc = new Location();
            var disabledClass = /\bmarker--disabled\b/;
            var enabledClass = /\bmarker--enabled\b/;
            expect(loc.getMarkerDefinition().icon.className).not.toMatch(disabledClass, 'does not have the disabled class');
            expect(loc.getMarkerDefinition().icon.className).toMatch(enabledClass, 'has the enabled class');
            loc.setDisabled();
            expect(loc.getMarkerDefinition().icon.className).toMatch(disabledClass, 'has the disabled class when setting disabled');
            expect(loc.getMarkerDefinition().icon.className).not.toMatch(enabledClass, 'does not have the enabled class when setting disabled');
            loc.setDisabled(false);
            expect(loc.getMarkerDefinition().icon.className).not.toMatch(disabledClass, 'disabled class removed when setting enabled');
            expect(loc.getMarkerDefinition().icon.className).toMatch(enabledClass, 'enabled class added when setting enabled');
        });
    });

    describe('setLatLng.', function() {
        it('method is defined.', function() {
            var loc = new Location();
            expect(typeof loc.setLatLng).toBe('function');
        });

        it('updates lat/lng of location and of marker.', function() {
            var loc = new Location({
                lat: 1,
                lng: 2
            });
            loc.setLatLng(3, 4);
            expect(loc.lat).toBe(3, 'set correct lat');
            expect(loc.lng).toBe(4, 'set correct lng');
            var markerLatLng = loc.getMarkerDefinition().latLng;
            expect(markerLatLng[0]).toBe(3, 'set correct marker lat');
            expect(markerLatLng[1]).toBe(4, 'set correct marker lng');
        });
    });

    describe('getProductById.', function() {
        it('has method', function() {
            var loc = new Location();
            expect(typeof loc.getProductById).toBe('function', 'getProductById is a function');
            expect(typeof loc.getProductById('something')).toBe('undefined', 'returns undefined by default');
        });

        it('returns products by id', function() {
            var prod1 = {
                id: '123',
                name: 'thing'
            };
            var loc = new Location({
                products: [prod1]
            });

            expect(loc.getProductById('123')).toBe(prod1, 'finds product by id');
            expect(typeof loc.getProductById(123)).toBe('undefined', 'does strict matches');
            expect(typeof loc.getProductById('1234')).toBe('undefined', 'really checks id');
        });

        it('returns correct product with multiple products', function() {
            var prod1 = {
                id: '123',
                name: 'thing'
            };
            var prod2 = {
                id: '456',
                name: 'other'
            };
            var loc = new Location({
                products: [prod1, prod2]
            });

            expect(loc.getProductById('123')).toBe(prod1, 'finds prod1');
            expect(loc.getProductById('456')).toBe(prod2, 'finds prod2');
        });
    });

    describe('sanitiseLink.', function() {
        var loc;
        beforeEach(function() {
            loc = new Location();
        });

        it('method exists', function() {
            expect(typeof loc.sanitiseLink).toBe('function');
        });

        it('does not modify a valid link', function() {
            loc.link = 'http://example.com';
            loc.sanitiseLink();
            expect(loc.link).toBe('http://example.com', 'http link not modified');

            loc.link = 'https://www.bla.ch';
            loc.sanitiseLink();
            expect(loc.link).toBe('https://www.bla.ch', 'https link not modified');
        });

        it('adds http:// if not already there', function() {
            loc.link = 'example.com';
            loc.sanitiseLink();
            expect(loc.link).toBe('http://example.com', 'test 1');

            loc.link = 'a';
            loc.sanitiseLink();
            expect(loc.link).toBe('http://a', 'test 2');

            loc.link = 'ablahttp://';
            loc.sanitiseLink();
            expect(loc.link).toBe('http://ablahttp://', 'test 3');
        });

        it('does not modify empty link', function() {
            // Don't set any value
            loc.sanitiseLink();
            expect(typeof loc.link).toBe('undefined', 'test 1');

            loc.link = '';
            loc.sanitiseLink();
            expect(loc.link).toBe('', 'test 2');
        });
    });

    describe('getIconClassForType static method.', function() {
        it('method exists', function() {
            expect(typeof Location.getIconClassForType).toBe('function');
        });

        it('returns false if no type given', function() {
            expect(Location.getIconClassForType()).toBe(false);
        });

        it('returns false if type is invalid', function() {
            expect(Location.getIconClassForType('bla')).toBe(false);
        });

        it('returns the correct icon per type', function() {
            expect(Location.getIconClassForType('gastronomy')).toBe('glyphicon glyphicon-cutlery');
            expect(Location.getIconClassForType('retail')).toBe('glyphicon glyphicon-shopping-cart');
        });
    });
});
