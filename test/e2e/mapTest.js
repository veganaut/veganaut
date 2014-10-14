/* global protractor, describe, beforeEach, it, expect, browser, element, by */
'use strict';

var helpers = require('./helpers');

describe('map.', function() {
    var menuButton;
    var mapNavEntry;
    var ptor;

    beforeEach(function() {
        // Tell backend to reload the fixtures
        browser.get('/e2eBridge#/basic');

        // Go to the app
        // TODO: this completely reloads the angular app before every test, takes forever
        browser.get('/login');
        ptor = protractor.getInstance();
        helpers.bindProtractor(ptor);

        // Set the map center in Bern
        browser.executeScript('localStorage.setItem(\'veganautMapCenter\', \'{"lat":46.945,"lng":7.449,"zoom":13}\')');

        // Set the mapUser tour to be ended
        browser.executeScript('localStorage.setItem(\'mapUser_end\', \'yes\')');

        // TODO: not so great to logout before every test
        menuButton = element(by.css('button.menu-button'));
        menuButton.click();
        browser.sleep(helpers.MENU_DELAY);
        var logoutButton = element(by.css('button.nav-logout'));
        logoutButton.isPresent().then(function(isPresent) {
            if (isPresent) {
                logoutButton.click();
            }
            else {
                menuButton.click();
            }
        });

        // Login
        browser.get('/login');
        element(by.model('form.email')).sendKeys('foo@bar.baz');
        element(by.model('form.password')).sendKeys('foobar\n');
    });

    beforeEach(function() {
        menuButton.click();
        browser.sleep(helpers.MENU_DELAY);

        mapNavEntry = element(by.css('button.nav-map'));
    });

    it('should have a button to get to the map.', function() {
        expect(mapNavEntry.isPresent()).toBe(true, 'nav entry for map is present');
        mapNavEntry.click();
        expect(ptor.getCurrentUrl()).toMatch(/\//);
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
            expect(element.all(by.css('.map-location')).count()).toBeGreaterThan(0, 'has at least one location');
            expect(element.all(by.css('.map-location.team-team1')).count()).toBeGreaterThan(0, 'has at least one team1 location');
            expect(element.all(by.css('.map-location.team-team2')).count()).toBeGreaterThan(0, 'has at least one team2 location');
        });

        it('should toggle showing details when selecting a location.', function() {
            var location = element(by.css('.map-location.team-team1[title="Reformhaus Ruprecht"]'));
            location.click();

            var details = element(by.css('.location-details'));
            expect(details.isDisplayed()).toBe(true, 'details shown on first click');
            expect(location.getAttribute('class')).toMatch(/active/, 'location has .active class');
            // TODO: check more that details are displayed

            location.click();
            expect(details.isDisplayed()).toBe(false, 'details hidden on second click');
            expect(location.getAttribute('class')).toNotMatch(/active/, '.active class removed');
        });

        describe('add location.', function() {
            it('should be possible to add a new location.', function() {
                browser.sleep(helpers.MENU_DELAY); // Wait for menu to go away
                element(by.css('.add-location')).click();

                var form = element(by.css('form.location-form'));
                expect(form.isDisplayed()).toBe(true, 'shows the add location form when button is clicked');

                var next = form.element(by.css('.btn-add-location-next'));
                expect(next.isDisplayed()).toBe(true, 'shows next button');
                expect(next.isEnabled()).toBe(false, 'next button step 1 is disabled');

                element(by.model('newLocation.title')).sendKeys('New Place');
                expect(next.isEnabled()).toBe(true, 'next button step 1 is no longer disabled');
                next.click();

                expect(next.isEnabled()).toBe(false, 'next button step 2 is disabled');
                form.all(by.model('newLocation.type')).first().click();
                expect(next.isEnabled()).toBe(true, 'next button step 2 is no longer disabled');
                next.click();

                expect(next.isEnabled()).toBe(false, 'next button step 3 is disabled');
                // Click somewhere on the map
                element(by.css('.main-map')).click();
                expect(next.isEnabled()).toBe(true, 'next button step 3 is no longer disabled');
                next.click();

                expect(element.all(by.css('.alert-success')).count()).toBe(1, 'should have a success message');

                // TODO: test that new place is on the map
            });
        });
    });
});
