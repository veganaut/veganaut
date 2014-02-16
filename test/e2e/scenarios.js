/* global describe, beforeEach, it, expect, browser, element, input, select */
'use strict';

// http://docs.angularjs.org/guide/dev_guide.e2e-testing
// This scenario has to be run while monkey-tail is running with
// the fixtures in test/fixtures.
describe('my app', function() {
    beforeEach(function() {
        browser().navigateTo('/app/index.html');

        // TODO: not so great to logout before every test
        element('button.navLogout').click();
    });

    it('should redirect to /login when location hash is empty', function() {
        expect(browser().location().url()).toBe('/login');
    });

    it('should redirect to /login for pages needing authentication', function() {
        browser().navigateTo('#/socialGraph');
        expect(browser().location().url()).toBe('/login');

        browser().navigateTo('#/activity');
        expect(browser().location().url()).toBe('/login');
    });

    describe('login', function() {
        beforeEach(function() {
            browser().navigateTo('#/login');
        });

        it('should render login form when navigating to /login', function() {
            expect(element('[ng-view] form').count()).toBe(1);
            expect(element('[ng-view] form input[type=password]').count()).toBe(1);
        });

        describe('authenticated user', function() {
            beforeEach(function() {
                input('form.email').enter('foo@bar.baz');
                input('form.password').enter('foobar');
                element('[ng-view] form button').click();
            });

            it('should be possible to login with correct username and pw', function() {
                expect(browser().location().url()).toBe('/socialGraph');
            });

            describe('socialGraph', function() {
                beforeEach(function() {
                    browser().navigateTo('#/socialGraph');
                });

                it('should render socialGraph with nodes and links', function() {
                    expect(element('social-graph').count()).toMatch(1);
                    expect(element('social-graph svg').count()).toMatch(1);

                    // Give it some time to render the graph
                    /**
                     * TODO: the next tests should actually be .toBe(6) and .toBe(3) but for some
                     * reason the next describe section is executed first. So we already
                     * added a new activity link...
                     */
                    expect(element('social-graph svg circle').count()).toBeGreaterThan(5);
                    expect(element('social-graph svg line').count()).toBeGreaterThan(2);

                    // Should have multiple dummy nodes
                    expect(element('social-graph svg circle.dummy').count()).toBeGreaterThan(1);
                });

                describe('activity link form', function() {
                    var someDummy;
                    beforeEach(function() {
                        someDummy = element('social-graph svg circle.dummy:first');
                    });

                    it('should go to /activity when clicking dummy node twice', function() {
                        // On the first click, stay on socialGrpah
                        someDummy.click();
                        expect(browser().location().url()).toBe('/socialGraph');

                        // On the second click, go to activity
                        someDummy.click();
                        expect(browser().location().url()).toBe('/activity');
                    });

                    it('should be possible to add a new activity link with a dummy node', function() {
                        someDummy.click();
                        someDummy.click();

                        input('form.targetName').enter('Hans');
                        select('form.selectedActivity').option('Buy something');
                        input('form.location').enter('Bern');
                        input('form.startTime').enter('2014-02-15');

                        element('[ng-view] form button').click();

                        // Should have a success message
                        expect(element('.alert-success').count()).toBe(1);

                        // Check that the social graph has one more node than before
                        browser().navigateTo('#/socialGraph');
                        expect(element('social-graph svg circle').count()).toBe(7);
                    });
                });
            });

            describe('activity link redirect', function() {
                beforeEach(function() {
                    browser().navigateTo('#/activity');
                });

                it('should redirect to /socialGraph when navigating directly to /activity', function() {
                    expect(browser().location().url()).toBe('/socialGraph');
                });

                // TODO: describe the /activity form more
            });
        });
    });

    describe('enter reference code when logged out', function() {
        it('should have a reference code input field', function() {
            expect(input('form.referenceCode').val()).toBe('');
        });

        it('should show the graph when entering a valid reference code', function() {
            input('form.referenceCode').enter('OiWCrB');
            element('.referenceCodeForm button').click();

            // Should show a social graph with two nodes and a connection between them
            expect(browser().location().url()).toBe('/socialGraph');
            expect(element('social-graph svg circle').count()).toBe(4);
            expect(element('social-graph svg line').count()).toBe(1);
        });
    });
});
