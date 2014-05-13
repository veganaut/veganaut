/* global protractor, describe, beforeEach, it, expect, browser, element, by */
'use strict';

describe('referenceCodes', function() {
    var MENU_DELAY = 100;
    var menuButton;
    var ptor;

    beforeEach(function() {
        // Tell backend to reload the fixtures
        browser.get('test/e2e/bridge.html#/referenceCodes');

        // Go to the app
        // TODO: this completely reloads the angular app before every test, takes forever
        browser.get('app/index.html#/login');
        ptor = protractor.getInstance();

        // TODO: not so great to logout before every test
        menuButton = element(by.css('button.menuButton'));
        menuButton.click();
        browser.sleep(MENU_DELAY);
        var logoutButton = element(by.css('button.navLogout'));
        logoutButton.isDisplayed().then(function(isDisplayed) {
            if (isDisplayed) {
                logoutButton.click();
            }
            else {
                menuButton.click();
            }
        });
    });

    describe('enter reference code when logged out', function() {
        it('should have a page to enter the reference code', function() {
            menuButton.click();
            browser.sleep(MENU_DELAY);
            element(by.css('button.navRefCode')).click();
            expect(ptor.getCurrentUrl()).toMatch(/\/referenceCode/);

            var refInput = element(by.model('form.referenceCode'));
            expect(refInput.isPresent()).toBe(true);
            expect(refInput.getText()).toBe('');
        });

        it('should show the graph when entering a valid reference code', function() {
            menuButton.click();
            browser.sleep(MENU_DELAY);
            element(by.css('button.navRefCode')).click('bla');

            var refInput = element(by.model('form.referenceCode'));
            refInput.sendKeys('OiWCrB\n');

            // Should show the correct social graph
            expect(ptor.getCurrentUrl()).toMatch(/\/socialGraph/);
            expect(element.all(by.css('social-graph .node.relation-me')).count()).toBe(1, 'me node');
            expect(element.all(by.css('social-graph .node.relation-friend')).count()).toBe(1, 'friend node');
            expect(element.all(by.css('social-graph .node.relation-friendOfFriend')).count()).toBe(2, 'friendOfFriend node');
            expect(element.all(by.css('social-graph .node.type-maybe')).count()).toBe(0, 'maybe node');
            expect(element.all(by.css('social-graph .node.type-baby')).count()).toBe(2, 'baby node');
            expect(element.all(by.css('social-graph .node.type-user')).count()).toBe(2, 'user node');
            expect(element.all(by.css('social-graph .node.type-dummy')).count()).toBe(2, 'dummy node');

            expect(element.all(by.css('social-graph .link')).count()).toBe(3, 'total links');
        });
    });

    describe('enter reference code when logged in', function() {
        it('should be possible to enter reference code as logged in user', function() {
            // Login as Alice
            browser.get('app/index.html#/login');
            element(by.model('form.email')).sendKeys('foo@bar.baz');
            element(by.model('form.password')).sendKeys('foobar\n');

            var beforeCompletedLinks;
            element.all(by.css('social-graph .link.hasCompletedActivities')).count().then(function(count) {
                beforeCompletedLinks = count;
            });

            menuButton.click();
            browser.sleep(MENU_DELAY);
            element(by.css('button.navRefCode')).click();

            var refInput = element(by.model('form.referenceCode'));
            refInput.sendKeys('AK92oj\n'); // Bob called Alice Eve for this activityLink

            expect(element.all(by.css('.alert-success')).count()).toBe(1);
            element.all(by.css('social-graph .link.hasCompletedActivities')).count().then(function(count) {
                expect(count).toBe(beforeCompletedLinks + 1,
                    'should have one more completed link than before entering ref code'
                );
            });
            expect(element.all(by.css('social-graph .link.friendOfFriend')).count())
                .toBe(0, 'the friendOfFriend was actually me, so should not be shown anymore')
            ;

            // Logout and back in as Bob
            menuButton.click();
            browser.sleep(MENU_DELAY);
            element(by.css('button.navLogout')).click();
            browser.get('app/index.html#/login');
            element(by.model('form.email')).sendKeys('im@stoop.id');
            element(by.model('form.password')).sendKeys('bestpasswordever\n');

            expect(element.all(by.css('.referenceCodeList li')).count())
                .toBe(0, 'should have no more open activities')
            ;

            expect(element.all(by.css('social-graph .link.hasCompletedActivities')).count())
                .toBe(3, 'should have three completed links')
            ;

            expect(element.all(by.css('social-graph .link.open')).count())
                .toBe(0, 'should have zero open links')
            ;
        });
    });

    describe('enter reference code from new friend when logged in', function() {
        it('should be possible to enter reference code as logged in user', function() {
            // Login as Frank, he doesn't know anyone yet
            browser.get('app/index.html#/login');
            element(by.model('form.email')).sendKeys('frank@frank.fr');
            element(by.model('form.password')).sendKeys('frank\n');

            menuButton.click();
            browser.sleep(MENU_DELAY);
            element(by.css('button.navRefCode')).click();
            var refInput = element(by.model('form.referenceCode'));
            refInput.sendKeys('AK92oj\n'); // Bob called Frank Eve for this activityLink

            expect(element.all(by.css('.alert-success')).count())
                .toBe(1, 'a success message should be displayed')
            ;
            expect(element.all(by.css('social-graph .link')).count())
                .toBe(2, 'should see a total of two links')
            ;

            expect(element.all(by.css('social-graph .node.relation-friend')).count())
                .toBe(1, 'a new friend should have been added')
            ;


            // Logout and back in as Bob
            menuButton.click();
            browser.sleep(MENU_DELAY);
            element(by.css('button.navLogout')).click();
            browser.get('app/index.html#/login');
            element(by.model('form.email')).sendKeys('im@stoop.id');
            element(by.model('form.password')).sendKeys('bestpasswordever\n');

            menuButton.click();
            browser.sleep(MENU_DELAY);
            element(by.css('button.navActivities')).click();
            expect(element.all(by.css('.referenceCodeList li')).count())
                .toBe(0, 'should have no more open activities')
            ;

            menuButton.click();
            browser.sleep(MENU_DELAY);
            element(by.css('button.navGraph')).click();
            expect(element.all(by.css('social-graph .link.hasCompletedActivities')).count())
                .toBe(3, 'should have three completed links')
            ;
            expect(element.all(by.css('social-graph .node.type-user')).count())
                .toBe(3, 'should now have three users: me (bob), alice, frank')
            ;
            expect(element.all(by.css('social-graph .node.relation-friend.type-maybe')).count())
                .toBe(0, 'should have no more friend maybe nodes')
            ;
        });
    });
});
