/* global protractor, describe, beforeEach, it, expect, browser, element, by */
'use strict';

var helpers = require('./helpers');

describe('map.', function() {
    var menuButton;
    var mapNavEntry;
    var ptor;

    beforeEach(function() {
        // Go to the app
        // TODO: this completely reloads the angular app before every test, takes forever
        browser.get('app/index.html#/');
        ptor = protractor.getInstance();

        // TODO: not so great to logout before every test
        menuButton = element(by.css('button.menuButton'));
        menuButton.click();
        browser.sleep(helpers.MENU_DELAY);
        var logoutButton = element(by.css('button.navLogout'));
        logoutButton.isPresent().then(function(isPresent) {
            if (isPresent) {
                logoutButton.click();
            }
            else {
                menuButton.click();
            }
        });

        // Login
        browser.get('app/index.html#/login');
        element(by.model('form.email')).sendKeys('foo@bar.baz');
        element(by.model('form.password')).sendKeys('foobar\n');
    });

    beforeEach(function() {
        menuButton.click();
        browser.sleep(helpers.MENU_DELAY);

        mapNavEntry = element(by.css('button.navMap'));
    });

    it('should have a button to get to the map.', function() {
        expect(mapNavEntry.isPresent()).toBe(true, 'nav entry for map is present');
        mapNavEntry.click();
        expect(ptor.getCurrentUrl()).toMatch(/\/map/);
    });

    describe('visit map.', function() {
        beforeEach(function() {
            mapNavEntry.click();
        });

        it('should have a page that shows the map.', function() {
            var map = element(by.css('.leaflet-container'));
            expect(map.isPresent()).toBe(true, 'leaflet map was created');
        });

        it('should show some locations on the map.', function() {
            expect(element.all(by.css('.mapLocation')).count()).toBeGreaterThan(0, 'has at least one location');
            expect(element.all(by.css('.mapLocation.team-blue')).count()).toBeGreaterThan(0, 'has at least one blue location');
            expect(element.all(by.css('.mapLocation.team-green')).count()).toBeGreaterThan(0, 'has at least one green location');
        });

        it('should toggle showing details when selecting a location.', function() {
            var location = element(by.css('.mapLocation.team-blue'));
            location.click();

            var details = element(by.css('.locationDetails'));
            expect(details.isDisplayed()).toBe(true, 'details shown on first click');
            expect(location.getAttribute('class')).toMatch(/active/, 'location has .active class');
            // TODO: check more that details are displayed

            location.click();
            expect(details.isDisplayed()).toBe(false, 'details hidden on second click');
            expect(location.getAttribute('class')).toNotMatch(/active/, '.active class removed');
        });
    });
});
