/* global protractor, describe, beforeEach, it, expect, browser, element, by */
'use strict';

var helpers = require('./helpers');
var elements = helpers.elements;

describe('community.', function() {
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

    describe('visit community.', function() {
        it('should have a page that shows the scores.', function() {
            elements.menuButton.click();

            var communityNavEntry = element(by.css('button.nav-community'));
            expect(communityNavEntry.isPresent()).toBe(true, 'nav entry for community is present');
            communityNavEntry.click();
            expect(ptor.getCurrentUrl()).toMatch(/\/community/);

            var scoreLink = element.all(by.css('a.player-score')).first();
            scoreLink.click();

            expect(ptor.getCurrentUrl()).toMatch(/\/veganaut/);

            var profileText = element(by.css('.profile')).getText();
            expect(profileText).toContain('Nickname');
            expect(profileText).toContain('Completed Missions');
            expect(profileText).toContain('Pioneer');
            expect(profileText).toContain('Diplomat');
            expect(profileText).toContain('Evaluator');
            expect(profileText).toContain('Gourmet');
        });
    });

    describe('visit profile of another player.', function() {
        it('should be able to visit profile of a player from the community.', function() {
            browser.get('/community');

            var personLink = element.all(by.css('a.player-score')).first();
            personLink.click();

            expect(ptor.getCurrentUrl()).toMatch(/\/veganaut/);

            var profileText = element(by.css('.profile')).getText();
            expect(profileText).toContain('Nickname');
            expect(profileText).toContain('Completed Missions');
            expect(profileText).toContain('Pioneer');
            expect(profileText).toContain('Diplomat');
            expect(profileText).toContain('Evaluator');
            expect(profileText).toContain('Gourmet');
        });
    });
});
