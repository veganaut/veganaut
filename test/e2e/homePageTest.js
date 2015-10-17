/* global describe, beforeEach, it, expect, browser, element, by */
'use strict';

var helpers = require('./helpers');

describe('homePage.', function() {
    beforeEach(function() {
        // Tell backend to reload the fixtures
        helpers.loadFixtures();

        // Go to the app
        helpers.loadApp('/');

        // TODO: not so great to logout before every test
        helpers.logoutIfLoggedIn();
    });

    it('should redirect to / when location hash is empty.', function() {
        expect(browser.getCurrentUrl()).toMatch(/\/$/);
    });

    it('should have a register and login button.', function() {
        expect(element(by.css('button.btn-register')).isPresent()).toBe(true, 'has a register button');
        expect(element(by.css('button.navbar-btn-login')).isPresent()).toBe(true, 'has a login button');
    });
});
