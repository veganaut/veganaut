/* global protractor, describe, beforeEach, it, expect, browser, element, by */
'use strict';

describe('frontPage.', function() {
    var ptor;

    beforeEach(function() {
        // Tell backend to reload the fixtures
        browser.get('/e2eBridge#/basic');

        // Go to the app
        // TODO: this completely reloads the angular app before every test, takes forever
        browser.get('app/index.html');
        ptor = protractor.getInstance();
    });

    it('should redirect to / when location hash is empty.', function() {
        expect(ptor.getCurrentUrl()).toMatch(/\/$/);
    });

    it('should have a register and login button.', function() {
        expect(element(by.css('button.front-register-btn')).isPresent()).toBe(true, 'has a register button');
        expect(element(by.css('button.front-login-btn')).isPresent()).toBe(true, 'has a login button');
    });

    it('should show the intro tour on the front page.', function() {
        ptor.sleep(500);
        var tour = element(by.css('.tour-intro'));
        expect(tour.isPresent()).toBe(true, 'has tour-intro');
        expect(tour.isDisplayed()).toBe(true, 'tour-intro is displayed');

        var endButton = element(by.css('.tour-intro .btn[data-role="end"]'));
        expect(endButton.isPresent()).toBe(true, 'has end tour button');

        endButton.click();
        expect(tour.isPresent()).toBe(false, 'tour-intro hides after clicking on end');
    });
});
