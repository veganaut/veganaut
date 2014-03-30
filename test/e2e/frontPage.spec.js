/* global protractor, describe, beforeEach, it, expect, browser, element, by */
'use strict';

describe('frontPage', function() {
    var ptor;

    beforeEach(function() {
        // Tell backend to reload the fixtures
        browser.get('test/e2e/bridge.html#/basic');

        // Go to the app
        // TODO: this completely reloads the angular app before every test, takes forever
        browser.get('app/index.html');
        ptor = protractor.getInstance();
    });

    it('should show the match score on the front page', function() {
        expect(element(by.css('.matchScoreDisplay')).isPresent()).toBe(true, 'has match score display');

        expect(element.all(by.css('.matchScoreDisplay .blueScore')).count()).toBe(4, 'four blue scores');
        expect(element.all(by.css('.matchScoreDisplay .greenScore')).count()).toBe(4, 'four green scores');

        // TODO: extend this
    });
});
