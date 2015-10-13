/* global protractor, describe, beforeEach, it, expect, browser, element, by */
'use strict';

var helpers = require('./helpers');

describe('location.', function() {
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

    describe('visit 3dosha as alice.', function() {
        beforeEach(function() {
            browser.get('/location/000000000000000000000006');
        });

        it('should show name and missions.', function() {
            expect(element(by.css('h1')).getText()).toMatch(/3dosha/, 'contains location name');

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

            expect(ptor.getCurrentUrl()).toMatch(/\/location\/000000000000000000000006/, 'Stays on the location page after submitting');
            expect(element.all(by.css('.alert-success')).count()).toBe(1, 'shows a success message');

            // TODO: add more tests, especially about whether the location info was
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
