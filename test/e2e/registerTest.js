/* global protractor, describe, beforeEach, it, expect, browser, element, by */
'use strict';

var helpers = require('./helpers');
var elements = helpers.elements;

describe('register.', function() {
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

    it('should have a link to the register form.', function() {
        elements.menuButton.click();
        var button = element.all(by.css('.nav-register'));
        expect(button.count()).toBe(1);

        button.first().click();
        expect(ptor.getCurrentUrl()).toMatch(/\/register/);
    });

    it('should be possible to register as a new user.', function() {
        browser.get('/register');

        element(by.model('form.email')).sendKeys('cody@testerburger.com');
        element(by.model('form.fullName')).sendKeys('Cody Testerburger');
        element(by.model('form.nickname')).sendKeys('The Cody');
        element(by.model('form.password')).sendKeys('so secure brah');
        element(by.model('form.passwordRepeat')).sendKeys('so secure brah\n');
        expect(ptor.getCurrentUrl()).toMatch(/\//);

        // Check if there's an alert and if it can be closed
        // TODO: this doesn't really belong in this test, should be a separate file
        var alerts = element.all(by.css('.alert-success'));
        expect(alerts.count()).toBe(1, 'should have a success message');
        element.all(by.css('.alert-success button.close')).first().click();
        expect(alerts.count()).toBe(0, 'can close alert');


        // Social graph is not active at the moment
//        // Should show a social graph with me and two dummies and no connections
//        expect(ptor.getCurrentUrl()).toMatch(/\/socialGraph/);
//        expect(element.all(by.css('social-graph .node')).count()).toBe(3, 'total nodes');
//        expect(element.all(by.css('social-graph .link')).count()).toBe(0, 'total links');
    });
});
