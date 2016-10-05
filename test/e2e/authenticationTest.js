/* global describe, beforeEach, it, expect, browser, element, by */
'use strict';

var helpers = require('./helpers');

describe('authentication.', function() {
    beforeEach(function() {
        // Tell backend to reload the fixtures
        helpers.loadFixtures();

        // Go to the app
        helpers.loadApp('/login');

        // TODO: not so great to logout before every test
        helpers.logoutIfLoggedIn();
    });

    it('should redirect to /login for pages needing authentication.', function() {
        browser.get('/community');
        expect(browser.getCurrentUrl()).toMatch(/\/login/);

        browser.get('/me');
        expect(browser.getCurrentUrl()).toMatch(/\/login/);
    });

    describe('login.', function() {
        beforeEach(function() {
            browser.get('/login');
        });

        it('should render login form when navigating to /login.', function() {
            expect(element(by.css('[ng-view] form')).isPresent()).toBe(true);
            expect(element(by.css('[ng-view] form input[type=password]')).isPresent()).toBe(true);
        });

        describe('authenticated user.', function() {
            beforeEach(function() {
                element(by.model('form.email')).sendKeys('foo@bar.baz');
                element(by.model('form.password')).sendKeys('foobar\n');
            });

            it('should be possible to login with correct username and pw.', function() {
                expect(browser.getCurrentUrl()).toMatch(/\/map\//, 'should redirect to the map after login');
            });

            it('should mark the body as logged in.', function() {
                expect(element(by.css('body.logged-in')).isPresent()).toBe(true);
            });
        });
    });
});
