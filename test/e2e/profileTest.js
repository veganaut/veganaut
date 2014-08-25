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
        browser.get('app/index.html#/login');
        element(by.model('form.email')).sendKeys('foo@bar.baz');
        element(by.model('form.password')).sendKeys('foobar\n');
    });

    describe('visit profile.', function() {
        it('should have a page that shows the profile.', function() {
            menuButton.click();
            browser.sleep(helpers.MENU_DELAY);

            var profileNavEntry = element(by.css('button.new-profile'));
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
            element(by.css('button.new-profile')).click();

            editProfile = element(by.css('button.edit-profile'));
        });

        it('should be possible to edit the profile.', function() {
            expect(editProfile.isPresent()).toBe(true, 'should have an edit profile button');
            editProfile.click();

            expect(element(by.css('form.edit-profile-form')).isDisplayed()).toBe(true, 'should show edit profile form');
        });
    });
});
