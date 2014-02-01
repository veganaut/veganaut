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


        it('should render socialGraph when user navigates to /socialGraph', function() {
            expect(element('[ng-view] h2:first').text()).
                toMatch(/Your graph/);
        });

    });


    describe('activity', function() {

        beforeEach(function() {
            browser().navigateTo('#/activity');
        });


        it('should render activity when user navigates to /activity', function() {
            expect(element('[ng-view] h2:first').text()).
                toMatch(/Start an activity with/);
        });

    });
});
