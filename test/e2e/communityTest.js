/* global describe, beforeEach, it, expect, browser, element, by */
'use strict';

var helpers = require('./helpers');
var elements = helpers.elements;

describe('community.', function() {
    var loadFixtures = true;

    beforeEach(function() {
        // Only load fixtures if explicitly told
        if (loadFixtures) {
            // Tell backend to reload the fixtures
            helpers.loadFixtures();
            loadFixtures = false;

            // Go to the app
            helpers.loadApp('/login');
        }

        helpers.loginIfLoggedOut();
    });

    it('should have a menu entry for community.', function() {
        elements.menuButton.click();

        var communityNavEntry = element(by.css('button.nav-community'));
        expect(communityNavEntry.isPresent()).toBe(true, 'nav entry for community is present');
        communityNavEntry.click();
        expect(browser.getCurrentUrl()).toMatch(/\/community/);
    });

    // TODO: extend to test the rankings and the impact of doing missions more precisely
    describe('visit community.', function() {
        beforeEach(function() {
            helpers.goToIfNotAlreadyThere('/community');
        });

        it('should have owned location ranking.', function() {
            var ranking = element(by.css('.ranking--location-owners'));
            expect(ranking.isPresent()).toBe(true, 'has ranking table');

            expect(ranking.getText()).toContain('Alice', 'Alice should be shown in the ranking');
        });

        it('should have owned location ranking.', function() {
            var ranking = element(by.css('.ranking--missions'));
            expect(ranking.isPresent()).toBe(true, 'has ranking table');

            expect(ranking.getText()).toContain('Alice', 'Alice should be shown in the ranking');
        });

        it('should be able to visit profile of a player from the community.', function() {
            var personLink = element.all(by.css('a.person-score')).first();
            personLink.click();

            expect(browser.getCurrentUrl()).toMatch(/\/veganaut/);

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
