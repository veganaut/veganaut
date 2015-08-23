/* global protractor, describe, beforeEach, it, expect, element, by */
'use strict';

var helpers = require('./helpers');
var elements = helpers.elements;

describe('profile.', function() {
    var ptor;

    beforeEach(function() {
        // Tell backend to reload the fixtures
        helpers.loadFixtures();

        // Go to the app
        helpers.loadApp('/');
        ptor = protractor.getInstance();

        // TODO: not so great to logout before every test
        helpers.logoutIfLoggedIn();
        helpers.login();
    });

    describe('visit profile.', function() {
        it('should have a page that shows the profile.', function() {
            elements.menuButton.click();

            var profileNavEntry = element(by.css('button.nav-profile'));
            expect(profileNavEntry.isPresent()).toBe(true, 'nav entry for profile is present');
            profileNavEntry.click();
            expect(ptor.getCurrentUrl()).toMatch(/\/me/);

            var profileText = element(by.css('.profile')).getText();
            expect(profileText).toContain('Alice Alison');
            expect(profileText).toContain('foo@bar.baz');
            expect(profileText).toContain('Completed Missions');
            expect(profileText).toContain('Pioneer');
            expect(profileText).toContain('Diplomat');
            expect(profileText).toContain('Evaluator');
            expect(profileText).toContain('Gourmet');
        });
    });

    describe('edit profile.', function() {
        var editProfile;

        beforeEach(function() {
            elements.menuButton.click();
            element(by.css('button.nav-profile')).click();

            editProfile = element(by.css('button.edit-profile'));
        });

        it('should be possible to edit the profile.', function() {
            expect(editProfile.isPresent()).toBe(true, 'should have an edit profile button');
            editProfile.click();

            expect(element(by.css('form.edit-profile-form')).isDisplayed()).toBe(true, 'should show edit profile form');
        });
    });
});
