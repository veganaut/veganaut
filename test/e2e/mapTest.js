/* global describe, beforeEach, it, expect, browser, element, by */
'use strict';

var helpers = require('./helpers');
var elements = helpers.elements;

describe('map page.', function() {
    var mapNavEntry;

    beforeEach(function() {
        // Tell backend to reload the fixtures
        helpers.loadFixtures();

        // Go to the app
        helpers.loadApp('/map');

        // TODO: not so great to logout before every test
        helpers.logoutIfLoggedIn();

        // Open the menu
        elements.menuButton.click();
        mapNavEntry = element(by.css('button.nav-map'));
    });

    it('should have a button to get to the map.', function() {
        expect(mapNavEntry.isPresent()).toBe(true, 'nav entry for map is present');
        mapNavEntry.click();
        expect(browser.getCurrentUrl()).toMatch(/\/map/);
    });

    it('should have a page that shows the map.', function() {
        mapNavEntry.click();
        var map = element(by.css('.leaflet-container'));
        expect(map.isPresent()).toBe(true, 'leaflet map was created');
    });
});

describe('map when logged out.', function() {
    beforeEach(function() {
        // Tell backend to reload the fixtures
        helpers.loadFixtures();

        // Go to the app
        helpers.loadApp('/map');

        // TODO: not so great to logout before every test
        helpers.logoutIfLoggedIn();

        browser.get('/map');
    });

    it('should show some locations on the map.', function() {
        expect(element.all(by.css('.marker')).count()).toBeGreaterThan(0, 'has at least one location');
        expect(element.all(by.css('.marker-cluster')).count()).toBeGreaterThan(0, 'has at least one marker cluster');
        expect(element.all(by.css('.marker.marker--type-retail')).count()).toBeGreaterThan(0, 'has at least one retail location');
        expect(element.all(by.css('.marker.marker--owner')).count()).toBe(0, 'has no location marked as being owned');
    });

    describe('map center loaded from local storage', function() {
        it('should load the center from local storage', function() {
            // Inject into local storage, reload the whole app (not on map page, because then it will take the url params)
            browser.executeScript('localStorage.setItem(\'veganautArea\',\'{"lat":47.1,"lng":8.2,"zoom":7}\')');
            browser.get('/');
            browser.refresh();
            browser.get('/map');

            expect(browser.getCurrentUrl()).toMatch(/\/map\/\?zoom=7&coords=47\.1000000,8\.2000000$/);

            element.all(by.css('.marker')).each(function(location) {
                expect(location.isDisplayed()).toBe(true, 'locations are visible');
            });
        });

        it('should load another center from local storage', function() {
            // Move to a part of the map where there's nothing
            browser.executeScript('localStorage.setItem(\'veganautArea\',\'{"lat":5,"lng":115,"zoom":10}\')');
            browser.get('/');
            browser.refresh();
            browser.get('/map');

            expect(browser.getCurrentUrl()).toMatch(/\/map\/\?zoom=10&coords=5\.0000000,115\.0000000$/);

            element.all(by.css('.marker')).each(function(location) {
                expect(location.isDisplayed()).toBe(false, 'locations are visible');
            });
        });
    });

    describe('map center live-loaded from URL', function() {
        it('should watch map center in URL', function() {
            browser.get('/map?zoom=7&coords=47.1,8.2');

            expect(browser.getCurrentUrl()).toMatch(/\/map\/\?zoom=7&coords=47\.1000000,8\.2000000$/);

            element.all(by.css('.marker')).each(function(location) {
                expect(location.isDisplayed()).toBe(true, 'locations are visible');
            });
        });

        it('should still watch map center in URL', function() {
            browser.get('/map?zoom=10&coords=5,115');

            expect(browser.getCurrentUrl()).toMatch(/\/map\/\?zoom=10&coords=5\.0000000,115\.0000000$/);

            element.all(by.css('.marker')).each(function(location) {
                expect(location.isDisplayed()).toBe(false, 'locations are visible');
            });
        });
    });

    describe('interaction with locations on the map', function() {
        it('should toggle showing details when selecting a location.', function() {
            browser.get('/map?zoom=13&coords=46.945,7.449');
            var location = element(by.css('.marker[title="Reformhaus Ruprecht"]'));
            location.click();

            var details = element(by.css('.location-details'));
            expect(details.isDisplayed()).toBe(true, 'details shown on first click');
            expect(location.getAttribute('class')).toMatch(/\bmarker--active\b/, 'location has .marker--active class');
            // TODO: check more that details are displayed

            location.click();
            expect(details.isDisplayed()).toBe(false, 'details hidden on second click');
            expect(location.getAttribute('class')).not.toMatch(/\bmarker--active\b/, '.marker--active class removed');
        });
    });

    describe('display of map locations.', function() {
        var allQuality0, allQuality3, allQuality4;
        var quality0, quality3, quality4;

        beforeEach(function() {
            allQuality0 = element.all(by.css('.marker.marker--quality-0'));
            allQuality3 = element.all(by.css('.marker.marker--quality-3'));
            allQuality4 = element.all(by.css('.marker.marker--quality-4'));
            quality0 = allQuality0.first();
            quality3 = allQuality3.first();
            quality4 = allQuality4.first();

            // Zoom enough in so we show all the location
            browser.get('/map?zoom=14&coords=46.945,7.449');
        });

        it('should qualify locations by quality', function() {
            expect(allQuality0.count()).toBeGreaterThan(0, 'has at least one quality 0 location');
            expect(allQuality3.count()).toBeGreaterThan(0, 'has at least one quality 3 location');
            expect(allQuality4.count()).toBeGreaterThan(0, 'has at least one quality 4 location');
        });

        it('higher quality locations should be bigger', function() {
            // TODO: could this be done nicer? Certainly. Did I find an easy way? No.
            quality0.getSize().then(function(size0) {
                quality3.getSize().then(function(size3) {
                    quality4.getSize().then(function(size4) {
                        expect(Math.abs(size0.height - size3.height)).toBeLessThan(0.0001, 'height of 0 is equal to that of 3');
                        expect(size3.height).toBeLessThan(size4.height, 'height of 3 is less than that of 4');
                        expect(Math.abs(size0.width - size3.width)).toBeLessThan(0.0001, 'width of 0 is equal to that of 3');
                        expect(size3.width).toBeLessThan(size4.width, 'width of 3 is less than that of 4');
                    });
                });
            });
        });

        it('higher quality locations should more opaque', function() {
            quality0.getCssValue('opacity').then(function(opacity0) {
                quality3.getCssValue('opacity').then(function(opacity3) {
                    quality4.getCssValue('opacity').then(function(opacity4) {
                        opacity0 = parseFloat(opacity0);
                        opacity3 = parseFloat(opacity3);
                        opacity4 = parseFloat(opacity4);
                        expect(Math.abs(opacity0 - opacity3)).toBeLessThan(0.0001, 'opacity of 0 is equal to that of 3');
                        expect(opacity3).toBeLessThan(opacity4, 'opacity of 3 is less than that of 4');
                    });
                });
            });
        });

        it('higher quality locations should be in front of others', function() {
            quality0.getCssValue('z-index').then(function(z0) {
                quality3.getCssValue('z-index').then(function(z3) {
                    quality4.getCssValue('z-index').then(function(z4) {
                        z0 = parseInt(z0, 10);
                        z3 = parseInt(z3, 10);
                        z4 = parseInt(z4, 10);
                        expect(Math.abs(z0 - z3)).toBeLessThan(1000, 'z-index of 0 is about equal to that of 3');
                        expect(z3).toBeLessThan(z4, 'z-index of 3 is less than that of 4');
                    });
                });
            });
        });
    });
});

describe('map when logged in.', function() {
    beforeEach(function() {
        // Tell backend to reload the fixtures
        helpers.loadFixtures();

        // Go to the app
        helpers.loadApp('/login');

        // TODO: not so great to logout before every test
        helpers.logoutIfLoggedIn();
        helpers.login();
    });

    describe('add location.', function() {
        it('should be possible to add a new location.', function() {
            browser.get('/map?zoom=13&coords=46.945,7.449');

            element(by.css('.create-location')).click();

            var form = element(by.css('form.location-form'));
            expect(form.isDisplayed()).toBe(true, 'shows the add location form when button is clicked');

            var next = form.element(by.css('.btn-create-location-next'));
            expect(next.isDisplayed()).toBe(true, 'shows next button');

            expect(next.isEnabled()).toBe(false, 'next button step 1 is disabled');
            form.all(by.model('createLocationFormVm.createLocation.newLocation.type')).first().click();
            expect(next.isEnabled()).toBe(true, 'next button step 1 is no longer disabled');
            next.click();

            expect(next.isEnabled()).toBe(false, 'next button step 2 is disabled');
            element(by.model('createLocationFormVm.createLocation.newLocation.name')).sendKeys('New Place');
            expect(next.isEnabled()).toBe(true, 'next button step 2 is no longer disabled');
            next.click();
            expect(next.isDisplayed()).toBe(false, 'no longer shows next button');

            var submit = form.element(by.css('.btn-create-location-submit'));
            expect(submit.isDisplayed()).toBe(true, 'shows submit button');
            expect(submit.isEnabled()).toBe(false, 'submit button is disabled');
            // Click somewhere on the map
            element(by.css('.main-map')).click();
            expect(submit.isEnabled()).toBe(true, 'submit button is no longer disabled');
            submit.click();

            expect(element.all(by.css('.alert-success')).count()).toBe(1, 'should have a success message');

            var locationPreview = element(by.css('.location-details'));
            expect(locationPreview.getText()).toContain('New Place');

            locationPreview.element(by.css('.location-visit-button')).click();
            expect(element(by.css('.location-address')).getText()).toContain('Bern', 'has an address in Bern');

            // TODO: test that new place is on the map
        });
    });
});
