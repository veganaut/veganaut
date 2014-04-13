/* global protractor, describe, beforeEach, it, expect, browser, element, by */
'use strict';

describe('scenarios', function() {
    var MENU_DELAY = 100;
    var GRAPH_DELAY = 800;
    var menuButton;
    var ptor;

    /**
     * Helper for selecting an item in a drop down by text
     * Taken from https://coderwall.com/p/tjx5zg
     * @param selector
     * @param item
     */
    function selectOption(selector, item) {
        var selectList, desiredOption;

        selectList = ptor.findElement(selector);
        selectList.click();

        selectList.findElements(by.tagName('option'))
            .then(function findMatchingOption(options) {
                options.some(function(option) {
                    option.getText().then(function(text) {
                        if (item === text) {
                            desiredOption = option;
                            return true;
                        }
                    });
                });
            })
            .then(function() {
                if (desiredOption) {
                    desiredOption.click();
                }
            })
        ;
    }

    beforeEach(function() {
        // Tell backend to reload the fixtures
        browser.get('test/e2e/bridge.html#/basic');

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

    it('should redirect to /login for pages needing authentication', function() {
        browser.get('app/index.html#/socialGraph');
        expect(ptor.getCurrentUrl()).toMatch(/\/login/);

        browser.get('app/index.html#/activity');
        expect(ptor.getCurrentUrl()).toMatch(/\/login/);
    });

    describe('login', function() {
        beforeEach(function() {
            browser.get('app/index.html#/login');
        });

        it('should render login form when navigating to /login', function() {
            expect(element(by.css('[ng-view] form')).isPresent()).toBe(true);
            expect(element(by.css('[ng-view] form input[type=password]')).isPresent()).toBe(true);
        });

        describe('authenticated user', function() {
            beforeEach(function() {
                element(by.model('form.email')).sendKeys('foo@bar.baz');
                element(by.model('form.password')).sendKeys('foobar\n');
            });

            it('should be possible to login with correct username and pw', function() {
                expect(ptor.getCurrentUrl()).toMatch(/\/socialGraph/);
            });

            it('should mark the current player\'s team', function() {
                expect(element(by.css('body.bluePlayer')).isPresent()).toBe(true);
            });

            describe('socialGraph', function() {
                beforeEach(function() {
                    browser.get('app/index.html#/socialGraph');
                });

                it('should render socialGraph with nodes and links', function() {
                    expect(element(by.css('social-graph')).isPresent()).toBe(true);
                    expect(element(by.css('social-graph svg')).isPresent()).toBe(true);

                    // Check that the graph has the correct elements
                    expect(element.all(by.css('social-graph .node.relation-me')).count()).toBe(1, 'me node');
                    expect(element.all(by.css('social-graph .node.relation-friend')).count()).toBe(3, 'friend node');
                    expect(element.all(by.css('social-graph .node.relation-friendOfFriend')).count()).toBe(1, 'friendOfFriend node');
                    expect(element.all(by.css('social-graph .node.type-maybe')).count()).toBe(2, 'maybe node');
                    expect(element.all(by.css('social-graph .node.type-baby')).count()).toBe(1, 'baby node');
                    expect(element.all(by.css('social-graph .node.type-user')).count()).toBe(2, 'user node');
                    expect(element.all(by.css('social-graph .node.type-dummy')).count()).toBe(2, 'dummy node');

                    expect(element.all(by.css('social-graph .link')).count()).toBe(4, 'total links');
                    expect(element.all(by.css('social-graph .link.hasCompletedActivities')).count()).toBe(2, 'completed links');
                    // TODO: describe other link types
                });

                it('nodes should have teams', function() {
                    // Check that the graph has the correct elements
                    expect(element(by.css('social-graph .node.team-blue')).isPresent()).toBe(true);
                    expect(element(by.css('social-graph .node.team-green')).isPresent()).toBe(true);
                });

                describe('activity link form', function() {
                    var someDummy;
                    var inviteButton;
                    beforeEach(function() {
                        var dummies = element.all(by.css('social-graph .node.type-dummy'));
                        expect(dummies.count()).toBeGreaterThan(0, 'should have at least one dummy');
                        someDummy = dummies.first();
                        inviteButton = element(by.css('button.addActivity'));
                    });

                    it('should deselect node when clicking dummy node twice', function() {
                        ptor.sleep(GRAPH_DELAY);
                        someDummy.click();
                        expect(ptor.getCurrentUrl()).toMatch(/\/socialGraph/);
                        expect(element.all(by.css('social-graph .node.selected')).count()).toBe(1, 'Dummy Node should be selected');

                        // On the second click, go to activity
                        someDummy.click();
                        expect(element.all(by.css('social-graph .node.selected')).count()).toBe(0, 'Dummy Node should be deselected');
                        expect(ptor.getCurrentUrl()).toMatch(/\/socialGraph/,'We should now still be on SocialGraph Page');
                    });

                    it('should go to /activity when selecting dummy node and click invite', function() {
                        // On the first click, stay on socialGraph
                        ptor.sleep(GRAPH_DELAY);
                        someDummy.click();
                        expect(ptor.getCurrentUrl()).toMatch(/\/socialGraph/);

                        expect(element.all(by.css('social-graph .node.selected')).count()).toBe(1,'Dummy Node should be selected');
                        // On the click addActivity Button, go to activity
                        inviteButton.click();
                        expect(ptor.getCurrentUrl()).toMatch(/\/activity/, 'We should now be on Activity Page');
                    });

                    it('should be possible to add a new activity link with a dummy node', function() {
                        // Verify the number of nodes before adding new activity link
                        ptor.sleep(GRAPH_DELAY);
                        expect(element.all(by.css('social-graph .node')).count()).toBe(7, 'total nodes');
                        expect(element.all(by.css('social-graph .node.type-maybe')).count()).toBe(2, 'maybe nodes');

                        // Browse to the activity link form
                        someDummy.click();
                        // On the click addActivity Button, go to activity
                        inviteButton.click();

                        selectOption(by.model('form.selectedActivity'), 'Buy something vegan for ...');
                        element(by.model('form.targetName')).sendKeys('Hans\n');

                        // Should have a success message
                        expect(element.all(by.css('.alert-success')).count()).toBe(1);

                        // Check that the social graph has one more node than before
                        browser.get('app/index.html#/socialGraph');
                        expect(element.all(by.css('social-graph .node')).count()).toBe(8, 'total nodes after');
                        expect(element.all(by.css('social-graph .node.type-maybe')).count()).toBe(3, 'maybe nodes after');

                        // Should show the new open activity link
                        browser.get('app/index.html#/openActivities');
                        expect(element(by.css('.referenceCodeList')).getText()).toContain('Hans');
                    });
                });
            });

            describe('list of open activity links', function() {
                beforeEach(function() {
                    browser.get('app/index.html#/openActivities');
                });

                it('shows the list of open activities when browsing to /openActivities', function() {
                    expect(ptor.getCurrentUrl()).toMatch(/\/openActivities/);

                    expect(element.all(by.css('.referenceCodeList li')).count()).toBeGreaterThan(0);

                    // Should have the reference code that is unused
                    expect(element(by.css('.referenceCodeList')).getText()).toContain('OiWCrB');
                });
            });

            describe('activity link redirect', function() {
                beforeEach(function() {
                    browser.get('app/index.html#/activity');
                });

                it('should redirect to /socialGraph when navigating directly to /activity', function() {
                    expect(ptor.getCurrentUrl()).toMatch(/\/socialGraph/);
                });

                // TODO: describe the /activity form more
            });
        });
    });

    describe('register', function() {
        it('should have a link to the register form', function() {
            menuButton.click();
            browser.sleep(MENU_DELAY);
            var button = element.all(by.css('.navRegister'));
            expect(button.count()).toBe(1);

            button.first().click();
            expect(ptor.getCurrentUrl()).toMatch(/\/register/);
        });

        it('should be possible to register as a new user', function() {
            browser.get('app/index.html#/register');

            element(by.model('form.email')).sendKeys('cody@testerburger.com');
            element(by.model('form.fullName')).sendKeys('Cody Testerburger');
            selectOption(by.model('form.role'), 'Scout');
            element(by.model('form.password')).sendKeys('so secure brah');
            element(by.model('form.passwordRepeat')).sendKeys('so secure brah\n');
            expect(element.all(by.css('.alert-success')).count()).toBe(1, 'should have a success message');

            // Should show a social graph with me and two dummies and no connections
            expect(ptor.getCurrentUrl()).toMatch(/\/socialGraph/);
            expect(element.all(by.css('social-graph .node')).count()).toBe(3, 'total nodes');
            expect(element.all(by.css('social-graph .link')).count()).toBe(0, 'total links');
        });
    });
});
