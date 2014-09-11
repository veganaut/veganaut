/* global protractor, describe, beforeEach, it, xit, expect, browser, element, by */
'use strict';

var helpers = require('./helpers');

describe('authentication.', function() {
    var ptor;

    beforeEach(function() {
        // Tell backend to reload the fixtures
        browser.get('/e2eBridge#/basic');

        // Go to the app
        // TODO: this completely reloads the angular app before every test, takes forever
        browser.get('/login');
        ptor = protractor.getInstance();
        helpers.bindProtractor(ptor);

        // TODO: not so great to logout before every test
        var menuButton = element(by.css('button.menu-button'));
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
    });

    // Social graph is not active at the moment
    xit('should redirect to /login for pages needing authentication.', function() {
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
                expect(ptor.getCurrentUrl()).toMatch(/\/map/, 'should redirect to map page after login');
            });

            it('should mark the current player\'s team.', function() {
                expect(element(by.css('body.player-team1')).isPresent()).toBe(true);
            });
        });
    });
});
