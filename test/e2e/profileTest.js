/* global protractor, describe, beforeEach, it, expect, browser, element, by */
'use strict';

var helpers = require('./helpers');

describe('profile.', function() {
    var menuButton;
    var ptor;

    beforeEach(function() {
        // Tell backend to reload the fixtures
        browser.get('test/e2e/bridge.html#/basic');

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

    describe('visit profile.', function() {
        it('should have a page that shows the profile.', function() {
            menuButton.click();
            browser.sleep(helpers.MENU_DELAY);

            var profileNavEntry = element(by.css('button.navProfile'));
            expect(profileNavEntry.isPresent()).toBe(true, 'nav entry for profile is present');
            profileNavEntry.click();
            expect(ptor.getCurrentUrl()).toMatch(/\/me/);

            var profileText = element(by.css('.profile')).getText();
            expect(profileText).toContain('Alice Alison');
            expect(profileText).toContain('foo@bar.baz');
            expect(profileText).toContain('Veteran');
            expect(profileText).toContain('Blau');

            // TODO: add smarter checks that the profile is fine (such as is the balance displayed)
        });
    });

    describe('edit profile.', function() {
        var editProfile;

        beforeEach(function() {
            menuButton.click();
            browser.sleep(helpers.MENU_DELAY);
            element(by.css('button.navProfile')).click();

            editProfile = element(by.css('button.editProfile'));
        });

        it('should have an edit profile button.', function() {
            expect(editProfile.isPresent()).toBe(true);
        });
    });
});
