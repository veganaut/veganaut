/* global describe, beforeEach, it, expect, browser, element, by */
'use strict';

var helpers = require('./helpers');
var elements = helpers.elements;

describe('register.', function() {
    beforeEach(function() {
        // Tell backend to reload the fixtures
        helpers.loadFixtures();

        // Go to the app
        helpers.loadApp('/');

        // TODO: not so great to logout before every test
        helpers.logoutIfLoggedIn();
    });

    it('should have a link to the register form.', function() {
        elements.menuButton.click();
        var button = element.all(by.css('.nav-register'));
        expect(button.count()).toBe(1);

        button.first().click();
        expect(browser.getCurrentUrl()).toMatch(/\/register/);
    });

    it('should be possible to register as a new user.', function() {
        browser.get('/register');

        var emailInput = element(by.model('registerVm.form.email'));
        emailInput.sendKeys('cody@testerburger.com');
        browser.sleep(350); // wait for debounce TODO: find another way to do that

        // Submit form by sending an EOL
        emailInput.sendKeys('\n');
        expect(browser.getCurrentUrl()).toMatch(/\//);

        // Check if there's an alert and if it can be closed
        // TODO: this doesn't really belong in this test, should be a separate file
        var alerts = element.all(by.css('.alert-success'));
        expect(alerts.count()).toBe(1, 'should have a success message');
        element.all(by.css('.alert-success button.close')).first().click();
        expect(alerts.count()).toBe(0, 'can close alert');
    });
});
