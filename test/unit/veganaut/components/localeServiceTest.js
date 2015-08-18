'use strict';

/* global describe, beforeEach, it, expect, inject, jasmine */
describe('localeService.', function() {
    var $rootScope, $translate, localStorage, playerService, deferredMe;
    beforeEach(module('veganaut.app.main'));

    beforeEach(module(function($provide) {
        // Set up all the mock dependencies
        $translate = jasmine.createSpy('$translate');
        $translate.use = jasmine.createSpy('use');
        $translate.proposedLanguage = jasmine.createSpy('proposedLanguage');
        playerService = {
            getDeferredMe: jasmine.createSpy('getDeferredMe')
        };
        localStorage = {
            getItem: jasmine.createSpy('getItem'),
            setItem: jasmine.createSpy('setItem')
        };

        $provide.constant('i18nSettings', {
            defaultLocale: 'de',
            availableLocales: ['de', 'fr']
        });
        $provide.value('$translate', $translate);
        $provide.value('$window', {
            localStorage: localStorage
        });
        $provide.value('playerService', playerService);
    }));

    beforeEach(inject(function($q, _$rootScope_) {
        deferredMe = $q.defer();
        playerService.getDeferredMe.andReturn(deferredMe.promise);
        $rootScope = _$rootScope_;
    }));

    describe('locale loading.', function() {
        beforeEach(function() {
            localStorage.getItem.andReturn('fr');
        });

        it('loads the locale from local storage.', inject(function(localeService) { // jshint ignore:line
            // Load from local storage and set on $translate
            expect(localStorage.getItem).toHaveBeenCalledWith('veganautLocale');
            expect($translate.use).toHaveBeenCalledWith('fr');
        }));

        it('loads the locale from player.', inject(function(localeService) { // jshint ignore:line
            expect(playerService.getDeferredMe).toHaveBeenCalled();

            expect($translate.use.mostRecentCall.args[0]).not.toBe('de');

            deferredMe.resolve({
                locale: 'de'
            });
            $rootScope.$apply();
            expect($translate.use.mostRecentCall.args[0]).toBe('de');
        }));
    });

    describe('getLocale.', function() {
        it('returns the $translate.proposedLanguage if defined.', inject(function(localeService) {
            $translate.proposedLanguage.andReturn('de');
            $translate.use.andReturn('fr');
            expect(localeService.getLocale()).toBe('de');
        }));

        it('otherwise returns $translate.use.', inject(function(localeService) {
            $translate.proposedLanguage.andReturn(undefined);
            $translate.use.andReturn('fr');
            expect(localeService.getLocale()).toBe('fr');
        }));
    });

    // TODO: add tests for settings locale and updating player
});
