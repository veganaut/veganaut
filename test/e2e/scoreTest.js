/* global protractor, describe, beforeEach, it, expect, element, by */
'use strict';

var helpers = require('./helpers');
var elements = helpers.elements;

describe('score.', function() {
    var ptor;

    beforeEach(function() {
        // Tell backend to reload the fixtures
        helpers.loadFixtures();

        // Go to the app
        helpers.loadApp('/');
        ptor = protractor.getInstance();

        // TODO: not so great to logout before every test
        helpers.logoutIfLoggedIn();
        helpers.login();
    });

    describe('visit score.', function() {
        it('should have a page that shows the score.', function() {
            elements.menuButton.click();

            var scoreNavEntry = element(by.css('button.nav-score'));
            expect(scoreNavEntry.isPresent()).toBe(true, 'nav entry for score is present');
            scoreNavEntry.click();
            expect(ptor.getCurrentUrl()).toMatch(/\/score/);

            var scoreLink = element(by.css('a.color-team2'));
            scoreLink.click();

            //expect(ptor.getCurrentUrl()).toMatch(/\/veganaut/);

            var profileText = element(by.css('.profile')).getText();
            expect(profileText).toContain('Nickname');
            expect(profileText).toContain('Team');
            expect(profileText).toContain('Completed Missions');
            expect(profileText).toContain('Pioneer');
            expect(profileText).toContain('Diplomat');
            expect(profileText).toContain('Evaluator');
            expect(profileText).toContain('Gourmet');
        });
    });
});
