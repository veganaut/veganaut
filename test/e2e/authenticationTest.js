/* global protractor, describe, beforeEach, it, expect, browser, element, by */
'use strict';

var helpers = require('./helpers');

describe('authentication.', function() {
    var ptor;

    beforeEach(function() {
        // Tell backend to reload the fixtures
        helpers.loadFixtures();

        // Go to the app
        helpers.loadApp('/login');
        ptor = protractor.getInstance();

        // TODO: not so great to logout before every test
        helpers.logoutIfLoggedIn();
    });

    it('should redirect to /login for pages needing authentication.', function() {
        browser.get('/socialGraph');
        expect(ptor.getCurrentUrl()).toMatch(/\/login/);

        browser.get('/createActivity');
        expect(ptor.getCurrentUrl()).toMatch(/\/login/);
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
                expect(ptor.getCurrentUrl()).toMatch(/\/map#0\.0000000,0\.0000000,2$/, 'should redirect to the map after login');
            });

            it('should mark the current player\'s team.', function() {
                expect(element(by.css('body.player-team1')).isPresent()).toBe(true);
            });
        });
    });
});
