/* global protractor, describe, beforeEach, it, expect, element, by */
'use strict';

var helpers = require('./helpers');

describe('frontPage.', function() {
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
        expect(element(by.css('button.front-register-btn')).isPresent()).toBe(true, 'has a register button');
        expect(element(by.css('button.navbar-btn-login')).isPresent()).toBe(true, 'has a login button');
    });

    // TODO: temporarily disabled all tours
    xit('should show the intro tour on the front page.', function() { // jshint ignore:line
        ptor.sleep(500);
        var tour = element(by.css('.tour-introBeta'));
        expect(tour.isPresent()).toBe(true, 'has tour-introBeta');
        expect(tour.isDisplayed()).toBe(true, 'tour-introBeta is displayed');

        var endButton = element(by.css('.tour-introBeta .btn[data-role="end"]'));
        expect(endButton.isPresent()).toBe(true, 'has end tour button');

        endButton.click();
        ptor.sleep(100); // This is probably needed because of a transition to hide the element
        expect(tour.isPresent()).toBe(false, 'tour-introBeta hides after clicking on end');
    });
});
