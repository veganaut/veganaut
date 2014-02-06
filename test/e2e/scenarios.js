'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */
/* global describe, beforeEach, it, expect, browser, element, input, sleep */
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
                    sleep(0.5);
                    expect(element('social-graph svg circle').count()).toBeGreaterThan(1);
                    expect(element('social-graph svg line').count()).toBeGreaterThan(1);

                    // Should have multiple dummmy nodes
                    expect(element('social-graph svg circle.dummy').count()).toBeGreaterThan(1);
                });

                it('should go to /activity when clicking dummy node twice', function() {
                    var someDummy = element('social-graph svg circle.dummy:first');

                    // On the first click, stay on socialGrpah
                    someDummy.click();
                    expect(browser().location().url()).toBe('/socialGraph');

                    // On the second click, go to activity
                    someDummy.click();
                    expect(browser().location().url()).toBe('/activity');
                });
            });

            describe('activity', function() {
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
});
