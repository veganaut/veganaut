/* global protractor, describe, beforeEach, it, expect, browser, element, by */
'use strict';

var helpers = require('./helpers');

describe('register.', function() {
    var ptor;

    beforeEach(function() {
        // Tell backend to reload the fixtures
        browser.get('test/e2e/bridge.html#/basic');

        // Go to the app
        browser.get('app/index.html#/');
        ptor = protractor.getInstance();

        // TODO: not so great to logout before every test
        var menuButton = element(by.css('button.menuButton'));
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
    });

    it('should have a link to the register form.', function() {
        element(by.css('button.menuButton')).click();
        browser.sleep(helpers.MENU_DELAY);
        var button = element.all(by.css('.navRegister'));
        expect(button.count()).toBe(1);

        button.first().click();
        expect(ptor.getCurrentUrl()).toMatch(/\/register/);
    });

    it('should be possible to register as a new user.', function() {
        browser.get('app/index.html#/register');

        element(by.model('form.email')).sendKeys('cody@testerburger.com');
        element(by.model('form.fullName')).sendKeys('Cody Testerburger');
        element(by.model('form.nickname')).sendKeys('The Cody');
        element(by.model('form.password')).sendKeys('so secure brah');
        element(by.model('form.passwordRepeat')).sendKeys('so secure brah\n');
        expect(element.all(by.css('.alert-success')).count()).toBe(1, 'should have a success message');

        // Should show a social graph with me and two dummies and no connections
        expect(ptor.getCurrentUrl()).toMatch(/\/socialGraph/);
        expect(element.all(by.css('social-graph .node')).count()).toBe(3, 'total nodes');
        expect(element.all(by.css('social-graph .link')).count()).toBe(0, 'total links');
    });
});
