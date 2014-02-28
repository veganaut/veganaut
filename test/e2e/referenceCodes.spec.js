/* global protractor, describe, beforeEach, it, expect, browser, element, by */
'use strict';

describe('referenceCodes', function() {
    var ptor;

    beforeEach(function() {
        // Tell backend to reload the fixtures
        browser.get('test/e2e/bridge.html#/referenceCodes');

        // Go to the app
        // TODO: this completely reloads the angular app before every test, takes forever
        browser.get('app/index.html');
        ptor = protractor.getInstance();

        // TODO: not so great to logout before every test
        var logoutButton = element(by.css('button.navLogout'));
        logoutButton.isDisplayed().then(function(isDisplayed) {
            if (isDisplayed) {
                logoutButton.click();
            }
        });
    });

    describe('enter reference code when logged out', function() {
        var refInput;
        it('should have a reference code input field', function() {
            refInput = element(by.model('form.referenceCode'));
            expect(refInput.isPresent()).toBe(true);
            expect(refInput.getText()).toBe('');
        });

        it('should show the graph when entering a valid reference code', function() {
            refInput.sendKeys('OiWCrB\n');

            // Should show the correct social graph
            expect(ptor.getCurrentUrl()).toMatch(/\/socialGraph/);
            expect(element.all(by.css('social-graph svg .node.me')).count()).toBe(1);
            expect(element.all(by.css('social-graph svg .node.maybe')).count()).toBe(0);
            expect(element.all(by.css('social-graph svg .node.baby')).count()).toBe(0);
            expect(element.all(by.css('social-graph svg .node.user')).count()).toBe(1);
            expect(element.all(by.css('social-graph svg .node.dummy')).count()).toBe(2);
            expect(element.all(by.css('social-graph svg .node.friendOfFriend')).count()).toBe(2);

            expect(element.all(by.css('social-graph svg .link')).count()).toBe(3);
            expect(element.all(by.css('social-graph svg .link.completed')).count()).toBe(1);
            expect(element.all(by.css('social-graph svg .link.friendOfFriend')).count()).toBe(2);
        });
    });

    describe('enter reference code when logged in', function() {
        it('should be possible to enter reference code as logged in user', function() {
            // Login as Alice
            browser.get('app/index.html#/login');
            element(by.model('form.email')).sendKeys('foo@bar.baz');
            element(by.model('form.password')).sendKeys('foobar\n');

            var beforeCompletedLinks;
            element.all(by.css('social-graph svg .link.completed')).count().then(function(count) {
                beforeCompletedLinks = count;
            });

            var refInput = element(by.model('form.referenceCode'));
            refInput.sendKeys('AK92oj\n'); // Bob called Alice Eve for this activityLink

            expect(element.all(by.css('.alert-success')).count()).toBe(1);
            element.all(by.css('social-graph svg .link.completed')).count().then(function(count) {
                expect(count).toBe(beforeCompletedLinks + 1,
                    'should have one more completed link than before entering ref code'
                );
            });

            expect(element.all(by.css('social-graph svg .link.friendOfFriend')).count())
                .toBe(0, 'the friendOfFriend was actually me, so should not be shown anymore')
            ;

            // Logout and back in as Bob
            element(by.css('button.navLogout')).click();
            browser.get('app/index.html#/login');
            element(by.model('form.email')).sendKeys('im@stoop.id');
            element(by.model('form.password')).sendKeys('bestpasswordever\n');

            expect(element.all(by.css('.referenceCodeList li')).count())
                .toBe(0, 'should have no more open activities')
            ;

            expect(element.all(by.css('social-graph svg .link.completed')).count())
                .toBe(2, 'should have two completed links')
            ;

            expect(element.all(by.css('social-graph svg .link.open')).count())
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

            var refInput = element(by.model('form.referenceCode'));
            refInput.sendKeys('AK92oj\n'); // Bob called Frank Eve for this activityLink

            expect(element.all(by.css('.alert-success')).count()).toBe(1);
            expect(element.all(by.css('social-graph svg .link.completed')).count())
                .toBe(1, 'a new completed link should have been added')
            ;

            expect(element.all(by.css('social-graph svg .node.user')).count())
                .toBe(1, 'a new friend should have been added')
            ;


            // Logout and back in as Bob
            element(by.css('button.navLogout')).click();
            browser.get('app/index.html#/login');
            element(by.model('form.email')).sendKeys('im@stoop.id');
            element(by.model('form.password')).sendKeys('bestpasswordever\n');

            expect(element.all(by.css('.referenceCodeList li')).count())
                .toBe(0, 'should have no more open activities')
            ;

            expect(element.all(by.css('social-graph svg .link.completed')).count())
                .toBe(2, 'should have two completed links')
            ;

            expect(element.all(by.css('social-graph svg .node.user')).count())
                .toBe(2, 'should now know two users')
            ;

            expect(element.all(by.css('social-graph svg .node.maybe')).count())
                .toBe(0, 'should have no more maybe nodes')
            ;
        });
    });
});
