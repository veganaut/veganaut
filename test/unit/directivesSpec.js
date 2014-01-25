'use strict';

/* jasmine specs for directives go here */
/* global describe, beforeEach, it, expect, inject */
describe('directives', function() {
    beforeEach(module('monkeyFace.directives'));

    describe('app-version', function() {
        it('should print current version', function() {
            module(function($provide) {
                $provide.value('version', 'TEST_VER');
            });
            inject(function($compile, $rootScope) {
                var element = $compile('<span app-version></span>')($rootScope);
                expect(element.text()).toEqual('TEST_VER');
            });
        });
    });
});
