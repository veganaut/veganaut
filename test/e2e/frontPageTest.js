/* global protractor, describe, beforeEach, it, expect, browser, element, by */
'use strict';

describe('frontPage.', function() {
    var ptor;

    beforeEach(function() {
        // Tell backend to reload the fixtures
        browser.get('test/e2e/bridge.html#/basic');

        // Go to the app
        // TODO: this completely reloads the angular app before every test, takes forever
        browser.get('app/index.html');
        ptor = protractor.getInstance();
    });

    it('should redirect to / when location hash is empty.', function() {
        expect(ptor.getCurrentUrl()).toMatch(/#\/$/);
    });

    it('should have a register and login button.', function() {
        expect(element(by.css('button.frontRegisterBtn')).isPresent()).toBe(true, 'has a register button');
        expect(element(by.css('button.frontLoginBtn')).isPresent()).toBe(true, 'has a login button');
    });

    it('should show the intro tour on the front page.', function() {
        ptor.sleep(500);
        expect(element(by.css('.tour-intro')).isPresent()).toBe(true, 'has tour-intro');
    });
});
