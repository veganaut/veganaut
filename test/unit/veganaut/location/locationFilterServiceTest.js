'use strict';

/* global describe, beforeEach, it, expect, inject, jasmine */
describe('locationFilterService.', function() {
    var $location, $rootScope, $routeParams, $route, $uibModal;

    beforeEach(module('veganaut.angularPiwik', 'veganaut.app.location'));

    beforeEach(module(function($provide) {
        // Set up all the mock dependencies
        $location = {
            replace: jasmine.createSpy('$location.replace'),
            search: jasmine.createSpy('$location.search')
        };

        $routeParams = {};
        $route = {
            current: {
                vgRouteName: 'map',
                vgFilters: {
                    recent: true,
                    type: true
                }
            }
        };

        $uibModal = {
            open: jasmine.createSpy('$uibModal.open')
        };

        $provide.value('$location', $location);
        $provide.value('$routeParams', $routeParams);
        $provide.value('$route', $route);
        $provide.value('$uibModal', $uibModal);
    }));

    beforeEach(inject(function(_$rootScope_) {
        $rootScope = _$rootScope_;
        spyOn($rootScope, '$on').andCallThrough();
        spyOn($rootScope, '$broadcast').andCallThrough();
    }));

    describe('constructor.', function() {
        it('does not initialise in constructor.', inject(function(locationFilterService) {
            var lfs = locationFilterService;
            expect(typeof lfs.INACTIVE_FILTER_VALUE).toBe('object', 'INACTIVE_FILTER_VALUE');
            expect(typeof lfs.INACTIVE_FILTER_VALUE.type).toBe('undefined', 'INACTIVE_FILTER_VALUE.type');
            expect(typeof lfs.INACTIVE_FILTER_VALUE.recent).toBe('string', 'INACTIVE_FILTER_VALUE.recent');

            expect(typeof lfs.POSSIBLE_FILTERS).toBe('object', 'POSSIBLE_FILTERS');
            expect(angular.isArray(lfs.POSSIBLE_FILTERS.type)).toBe(true, 'POSSIBLE_FILTERS.type');
            expect(angular.isArray(lfs.POSSIBLE_FILTERS.recent)).toBe(true, 'POSSIBLE_FILTERS.recent');

            expect(typeof lfs.RECENT_FILTER_PERIOD).toBe('object', 'RECENT_FILTER_PERIOD');
            expect(typeof lfs.RECENT_FILTER_PERIOD.month).toBe('number', 'RECENT_FILTER_PERIOD.month');
            expect(typeof lfs.RECENT_FILTER_PERIOD.week).toBe('number', 'RECENT_FILTER_PERIOD.week');
            expect(typeof lfs.RECENT_FILTER_PERIOD.day).toBe('number', 'RECENT_FILTER_PERIOD.day');

            expect(typeof lfs.activeFilters).toBe('object', 'has activeFilters set');
            expect(lfs.activeFilters.type).toBe(lfs.DEFAULT_FILTER_VALUE.type, '"type" initialised to default');
            expect(lfs.activeFilters.recent).toBe(lfs.DEFAULT_FILTER_VALUE.recent, '"recent" initialised to default');
        }));

        it('cleans up URL when leaving route with filters.', inject(function(locationFilterService) { // jshint ignore:line
            expect($rootScope.$on).toHaveBeenCalled();
            expect($rootScope.$on.calls[0].args[0]).toBe('$routeChangeStart', 'subscribed to route changes');

            $rootScope.$broadcast(
                '$routeChangeStart',
                {
                    // New route has one filter
                    vgFilters: {
                        recent: true
                    }
                },
                {
                    // Old route had two filters
                    vgFilters: {
                        recent: true,
                        type: true
                    }
                }
            );

            // Only cleans up the filter that is no longer there on the new page
            expect($location.search).toHaveBeenCalledWith('type', undefined);
            expect($location.search).not.toHaveBeenCalledWith('recent', undefined);
        }));
    });

    describe('setFiltersFromUrl.', function() {
        it('method exists.', inject(function(locationFilterService) {
            expect(typeof locationFilterService.setFiltersFromUrl).toBe('function');
        }));

        it('loads the filters route params.', inject(function(locationFilterService) {
            var lfs = locationFilterService;
            $routeParams.type = 'retail';
            $routeParams.recent = 'month';
            lfs.setFiltersFromUrl();

            expect(lfs.activeFilters.type).toBe('retail');
            expect(lfs.activeFilters.recent).toBe('month');
            expect(lfs.getTypeFilterValue()).toBe('retail');
            expect(lfs.getRecentFilterValue()).toBe(4 * 7 * 24 * 3600);

            expect($location.replace).toHaveBeenCalled();
            expect($location.search).toHaveBeenCalledWith('type', 'retail');
            expect($location.search).toHaveBeenCalledWith('recent', 'month');
        }));

        it('only loads valid filters.', inject(function(locationFilterService) {
            var lfs = locationFilterService;
            $routeParams.type = 'nothingValid';
            $routeParams.recent = 'alsoNot';
            lfs.setFiltersFromUrl();

            expect(lfs.activeFilters.type).toBe(lfs.DEFAULT_FILTER_VALUE.type, 'type filter stays default');
            expect(lfs.activeFilters.recent).toBe(lfs.DEFAULT_FILTER_VALUE.recent, 'recent filter stays default');
            expect(lfs.getTypeFilterValue()).toBe(lfs.DEFAULT_FILTER_VALUE.type, 'type filter value stays default');
            expect(typeof lfs.getRecentFilterValue()).toBe('undefined', 'recent filter value stays undefined');

            // Clears URL
            expect($location.replace).toHaveBeenCalled();
            expect($location.search).toHaveBeenCalledWith('type', undefined);
            expect($location.search).toHaveBeenCalledWith('recent', undefined);
        }));
    });

    describe('onFiltersChanged.', function() {
        it('method exists.', inject(function(locationFilterService) {
            expect(typeof locationFilterService.onFiltersChanged).toBe('function');
        }));

        it('updates url and broadcasts filters changed.', inject(function(locationFilterService) {
            var lfs = locationFilterService;
            lfs.activeFilters.type = 'gastronomy';
            lfs.activeFilters.recent = 'week';
            lfs.onFiltersChanged();

            expect($location.replace).toHaveBeenCalled();
            expect($location.search).toHaveBeenCalledWith('type', 'gastronomy');
            expect($location.search).toHaveBeenCalledWith('recent', 'week');

            expect($rootScope.$broadcast).toHaveBeenCalledWith('veganaut.filters.changed');
        }));

        it('does not put the incative filter values in the URL.', inject(function(locationFilterService) {
            var lfs = locationFilterService;
            lfs.activeFilters.recent = lfs.INACTIVE_FILTER_VALUE.recent;
            lfs.onFiltersChanged();

            expect($location.replace).toHaveBeenCalled();
            expect($location.search).toHaveBeenCalledWith('recent', undefined);
        }));

        it('only updates URL if on a route with filters.', inject(function(locationFilterService) {
            var lfs = locationFilterService;
            lfs.activeFilters.type = 'retail';
            lfs.activeFilters.recent = 'day';
            $route.current.vgFilters = undefined;
            lfs.onFiltersChanged();

            expect($location.replace).not.toHaveBeenCalled();
            expect($location.search).not.toHaveBeenCalled();
        }));
    });
});
