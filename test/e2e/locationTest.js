/* global protractor, describe, beforeEach, it, expect, browser, element, by */
'use strict';

var helpers = require('./helpers');

describe('map.', function() {
    var menuButton;
    var ptor;

    beforeEach(function() {
        // Tell backend to reload the fixtures
        browser.get('/e2eBridge#/basic');

        // Go to the app
        // TODO: this completely reloads the angular app before every test, takes forever
        browser.get('/login');
        ptor = protractor.getInstance();
        helpers.bindProtractor(ptor);

        // TODO: not so great to logout before every test
        // TODO: dude, this code duplication in different tests is getting ridiculous
        menuButton = element(by.css('button.menu-button'));
        menuButton.click();
        browser.sleep(helpers.MENU_DELAY);
        var logoutButton = element(by.css('button.nav-logout'));
        logoutButton.isPresent().then(function(isPresent) {
            if (isPresent) {
                logoutButton.click();
            }
            else {
                menuButton.click();
            }
        });

        // Login
        browser.get('/login');
        element(by.model('form.email')).sendKeys('foo@bar.baz');
        element(by.model('form.password')).sendKeys('foobar\n');
    });

    describe('visit 3dosha as alice.', function() {
        beforeEach(function() {
            browser.get('/location/000000000000000000000006');
        });

        it('should show title and missions.', function() {
            expect(element(by.css('h1')).getText()).toMatch(/3dosha/, 'contains location title');

            expect(element.all(by.css('.mission')).count()).toBeGreaterThan(0, 'contains some missions');
            expect(element(by.css('.mission.mission-visitBonus')).isDisplayed()).toBe(true, 'visitBonus mission is available');
        });

        it('shows missions.', function() {
            var missions = element.all(by.css('.mission'));
            var beforeMissionCount;
            missions.count().then(function(count) {
                beforeMissionCount = count;
                expect(beforeMissionCount).toBeGreaterThan(0, 'shows some missions');
            });

            var visitMission = element(by.css('.mission-visitBonus'));
            expect(visitMission.isDisplayed()).toBe(true, 'shows bonus missions');

            var submitVisit = element(by.css('button.submit-visit'));
            expect(submitVisit.isEnabled()).toBe(false, 'Cannot submit visit before completing a mission');

            var hasOptionsMission = element(by.css('.mission-hasOptions'));
            hasOptionsMission.click();
            expect(element(by.css('.mission-hasOptions form')).isDisplayed()).toBe(true, 'shows mission form after click');

            var hasOptionsAnswer = element(by.css('.mission-hasOptions form *[btn-radio=true]'));
            expect(hasOptionsAnswer.getText()).toBe('Ja', 'correct mission outcome button found');

            var submitMission = element(by.css('.mission-hasOptions form button[type=submit]'));
            expect(submitMission.isEnabled()).toBe(false, 'Submit is not enabled before entering mission outcome');
            hasOptionsAnswer.click();
            expect(submitMission.isEnabled()).toBe(true, 'Submit is enabled after entering mission outcome');
            submitMission.click();
            missions.count().then(function(count) {
                expect(count).toBeGreaterThan(beforeMissionCount, 'shows more missions than before submitting');
            });

            expect(submitVisit.isEnabled()).toBe(true, 'Can submit visit after completing a mission');
            submitVisit.click();
            expect(ptor.getCurrentUrl()).toMatch(/\//, 'Redirects back to map after submitting visit');
            expect(element.all(by.css('.alert-success')).count()).toBe(1, 'shows a success message');
        });
    });

    describe('visit ruprecht as alice.', function() {
        it('should show title and missions.', function() {
            browser.get('/location/000000000000000000000007');
            expect(element(by.css('h1')).getText()).toMatch(/Ruprecht/, 'contains location title');

            expect(element.all(by.css('.mission')).count()).toBeGreaterThan(0, 'contains some missions');
        });
    });
});
