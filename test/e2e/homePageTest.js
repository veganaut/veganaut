/* global protractor, describe, beforeEach, it, expect, element, by */
'use strict';

var helpers = require('./helpers');

describe('homePage.', function() {
    var ptor;

    beforeEach(function() {
        // Tell backend to reload the fixtures
        helpers.loadFixtures();

        // Go to the app
        helpers.loadApp('/');
        ptor = protractor.getInstance();

        // TODO: not so great to logout before every test
        helpers.logoutIfLoggedIn();
    });

    it('should redirect to / when location hash is empty.', function() {
        expect(ptor.getCurrentUrl()).toMatch(/\/$/);
    });

    it('should have a register and login button.', function() {
        expect(element(by.css('button.btn-register')).isPresent()).toBe(true, 'has a register button');
        expect(element(by.css('button.navbar-btn-login')).isPresent()).toBe(true, 'has a login button');
    });
});
