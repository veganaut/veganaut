/* global protractor, describe, beforeEach, it, expect, browser, element, by */
'use strict';

var helpers = require('./helpers');

describe('map.', function() {
    var menuButton;
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

    describe('visit map.', function() {
        it('should have a page that shows the map.', function() {
            menuButton.click();
            browser.sleep(helpers.MENU_DELAY);

            var mapNavEntry = element(by.css('button.navMap'));
            expect(mapNavEntry.isPresent()).toBe(true, 'nav entry for map is present');
            mapNavEntry.click();
            expect(ptor.getCurrentUrl()).toMatch(/\/map/);

            var map = element(by.css('.leaflet-container'));
            expect(map.isPresent()).toBe(true, 'leaflet map was created');
        });
    });
});
