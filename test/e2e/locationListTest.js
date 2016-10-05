/* global describe, beforeEach, it, expect, browser, element, by */
'use strict';

var helpers = require('./helpers');

describe('location list accessed from map.', function() {
    var loadFixtures = true;
    var locationListButton;
    var mapLat = 46.96;
    var mapLng = 7.44;
    var mapUrl = '/map#zoom:13,coords:' + mapLat.toFixed(7) + '-' + mapLng.toFixed(7);

    beforeEach(function() {
        // Only load fixtures if explicitly told
        if (loadFixtures) {
            // Tell backend to reload the fixtures
            helpers.loadFixtures();
            loadFixtures = false;

            // Go to the app
            helpers.loadApp(mapUrl);
        }

        locationListButton = element(by.css('.btn-location-list'));
    });

    it('should have a button to get to the location list.', function() {
        expect(locationListButton.isPresent()).toBe(true, 'button present');
    });

    it('should go to the location list.', function() {
        locationListButton.click();
        browser.getCurrentUrl().then(function(url) {
            // Get the URL parameters and verify them
            var match = url.match(/\/locations\/\?coords=([0-9\.]+),([0-9\.]+)&radius=([0-9]+)$/);
            expect(match).not.toBe(null, 'loaded correct url');
            var lat = parseFloat(match[1]);
            var lng = parseFloat(match[2]);
            var radius = parseInt(match[3], 10);
            expect(Math.abs(lat - mapLat)).toBeLessThan(0.01, 'selected lat close to map lat');
            expect(Math.abs(lng - mapLng)).toBeLessThan(0.01, 'selected lng close to map lng');
            expect(radius).toBeLessThan(50000, 'selected not too big radius');
            expect(radius).toBeGreaterThan(1000, 'selected not too small radius');

            expect(element(by.css('.btn-map')).isPresent()).toBe(true, 'has a button back to the map');

            var locations = element.all(by.css('.location-list__location'));
            expect(locations.count()).toBe(4, 'shows all four locations');

            var description = element(by.css('.location-list__description'));
            expect(description.isPresent()).toBe(true, 'list description present');
            var descriptionText = description.getText();
            expect(descriptionText).toContain('Bern', 'description mentions Bern');
            var displayRadius = (radius / 1000).toFixed(1) + 'km';
            expect(descriptionText).toContain(displayRadius, 'description radius');

            // Find specific location
            locations.filter(function(elem) {
                return elem.getText().then(function(text) {
                    return (text === 'Reformhaus Ruprecht');
                });
            }).then(function(filtered) {
                var ruprecht = filtered[0];
                expect(ruprecht.isPresent()).toBe(true, 'found Ruprecht');

                // Open the location
                ruprecht.click();
                browser.sleep(100); // Wait for location to update
                expect(ruprecht.getText()).toContain('Bio shop with many vegan options.', 'loaded location description');
                var products = ruprecht.element(by.css('vg-location-product-summary'));
                expect(products.getText()).toContain('tofu', 'showing products');
                expect(products.element(by.css('vg-average-rating')).isPresent()).toBe(true, 'shows rating');
            });
        });
    });
});
