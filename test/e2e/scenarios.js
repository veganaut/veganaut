'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */
/* global describe, beforeEach, it, expect, browser, element */
describe('my app', function() {
    beforeEach(function() {
        browser().navigateTo('/app/index.html');
    });

    it('should automatically redirect to /socialGraph when location hash/fragment is empty', function() {
        expect(browser().location().url()).toBe('/socialGraph');
    });

    describe('socialGraph', function() {
        beforeEach(function() {
            browser().navigateTo('#/socialGraph');
        });

        it('should render socialGraph when navigating to /socialGraph', function() {
            expect(element('social-graph').count()).toMatch(1);
            expect(element('social-graph svg').count()).toMatch(1);
        });
    });

    describe('activity', function() {
        beforeEach(function() {
            browser().navigateTo('#/activity');
        });

        it('should redirect to /socialGraph when navigating directly to /activity', function() {
            expect(browser().location().url()).toBe('/socialGraph');
        });
    });

    describe('login', function() {
        beforeEach(function() {
            browser().navigateTo('#/login');
        });

        it('should render login form when navigating to /login', function() {
            expect(element('[ng-view] form').count()).toBe(1);
            expect(element('[ng-view] form input[type=password]').count()).toBe(1);
        });
    });
});
