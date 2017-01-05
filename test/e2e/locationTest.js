/* global describe, beforeEach, it, expect, browser, element, by */
'use strict';

var helpers = require('./helpers');

describe('location.', function() {
    beforeEach(function() {
        // Tell backend to reload the fixtures
        helpers.loadFixtures();

        // Go to the app
        helpers.loadApp('/');

        // TODO: not so great to logout before every test
        helpers.logoutIfLoggedIn();
        helpers.login();
    });

    describe('visit 3dosha as alice.', function() {
        beforeEach(function() {
            browser.get('/location/000000000000000000000006');
        });

        it('should show name, address and missions.', function() {
            expect(element(by.css('h1')).getText()).toMatch(/3dosha/, 'contains location name');

            var addressText = element(by.css('.location-address')).getText();
            expect(addressText).toContain('Moserstrasse 25', 'address contains the street');
            expect(addressText).toContain('3014 Bern, Switzerland', 'address contains the zip, city and country');

            expect(element.all(by.css('.mission')).count()).toBeGreaterThan(0, 'contains some missions');
            expect(element(by.css('.mission.mission-visitBonus')).isDisplayed()).toBe(true, 'visitBonus mission is available');
        });

        it('shows missions and can submit missions.', function() {
            expect(element.all(by.css('.mission')).count()).toBeGreaterThan(0, 'shows some missions');

            var visitMission = element(by.css('.mission-visitBonus'));
            expect(visitMission.isDisplayed()).toBe(true, 'shows bonus missions');

            var hasOptionsMission = element(by.css('.mission-hasOptions'));
            hasOptionsMission.click();
            expect(element(by.css('.mission-hasOptions form')).isDisplayed()).toBe(true, 'shows mission form after click');

            var hasOptionsAnswer = element.all(by.css('.mission-hasOptions form *[uib-btn-radio]')).first();
            expect(hasOptionsAnswer.getText()).toBe('Yes', 'correct mission outcome button found');

            var submitMission = element(by.css('.mission-hasOptions form button[type=submit]'));
            expect(submitMission.isEnabled()).toBe(false, 'Submit is not enabled before entering mission outcome');
            hasOptionsAnswer.click();
            expect(submitMission.isEnabled()).toBe(true, 'Submit is enabled after entering mission outcome');
            submitMission.click();

            expect(browser.getCurrentUrl()).toMatch(/\/location\/000000000000000000000006/, 'Stays on the location page after submitting');
            expect(element.all(by.css('.alert-success')).count()).toBe(1, 'shows a success message');

            // TODO: add more tests, especially about whether the location info was
        });

        it('shows tags and tag mission.', function() {
            var locationTags = element(by.css('.location-tags'));
            var allTags = locationTags.all(by.css('.tag'));
            var mission = locationTags.element(by.css('.mission-locationTags'));
            var missionButtons = mission.all(by.css('button'));
            var groupToggles = mission.all(by.css('.link-for-toggle'));
            var missionSubmit = mission.element(by.css('.btn-primary'));

            expect(locationTags.isDisplayed()).toBe(true, 'shows location tags section');
            expect(allTags.count()).toBe(0, 'no tags yet');
            expect(mission.isDisplayed()).toBe(false, 'does not show mission at first');
            locationTags.all(by.css('button')).first().click();
            expect(mission.isDisplayed()).toBe(true, 'shows mission after click');

            expect(missionSubmit.isEnabled()).toBe(false, 'mission submit not enabled when nothing is selected');

            // TODO: this filtering is slow, use something faster
            missionButtons.filter(function(elem) {
                return elem.getText().then(function(text) {
                    return (
                        text === 'Brunch' || text === 'Dinner'
                    );
                });
            }).then(function(filteredButtons) {
                expect(filteredButtons.length).toBe(2, 'found Brunch and Dinner tag button');
                filteredButtons[0].click();
                expect(missionSubmit.isEnabled()).toBe(true, 'submit button enabled after first selection');
                filteredButtons[1].click();
            });

            // Toggle all the groups
            groupToggles.click();

            missionButtons.filter(function(elem) {
                return elem.getText().then(function(text) {
                    return (
                        text === 'Meat alternatives'
                    );
                });
            }).then(function(filteredButtons) {
                expect(filteredButtons.length).toBe(1, 'found Meat alternatives tag button');
                filteredButtons[0].click();
            });

            missionSubmit.click();
            expect(allTags.count()).toBe(3, 'all tags displayed after mission submitted');
        });
    });

    describe('visit ruprecht as alice.', function() {
        it('should show name and missions.', function() {
            browser.get('/location/000000000000000000000007');
            expect(element(by.css('h1')).getText()).toMatch(/Ruprecht/, 'contains location name');

            expect(element.all(by.css('.mission')).count()).toBeGreaterThan(0, 'contains some missions');
        });
    });
});
