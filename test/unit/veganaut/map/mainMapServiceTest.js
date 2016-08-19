'use strict';

/* global describe, beforeEach, it, expect, inject, jasmine */
describe('mainMapService.', function() {
    var $location, $rootScope, $route, $routeParams,
        locationService, backendService, localStorage,
        map, geoIpDeferred, activeFilters = {};
    beforeEach(module('veganaut.app.map'));

    beforeEach(module(function($provide) {
        // Set up all the mock dependencies
        $location = {
            replace: jasmine.createSpy('$location.replace')
        };

        $route = {
            updateParams: jasmine.createSpy('$route.updateParams')
        };

        $routeParams = {};

        locationService = {
            queryByBounds: jasmine.createSpy('locationService.queryByBounds')
        };

        backendService = {
            getGeoIP: jasmine.createSpy('backendService.getGeoIP')
        };

        localStorage = {
            getItem: jasmine.createSpy('getItem'),
            setItem: jasmine.createSpy('setItem')
        };

        map = {
            setView: jasmine.createSpy('map.setView'),
            getBounds: function() {
                return {
                    toBBoxString: function() {
                        return 'bbox string';
                    }
                };
            },
            getZoom: function() {
                return 100;
            }
        };

        var locationFilterService = {
            POSSIBLE_FILTERS: {
                type: ['retail', 'gastronomy', 'defaultTypeFilter'],
                recent: ['week', 'month', 'defaultRecentFilter']

            },
            INACTIVE_FILTER_VALUE: {
                type: 'defaultTypeFilter',
                recent: 'defaultRecentFilter'
            },
            activeFilters: activeFilters
        };
        activeFilters.type = locationFilterService.INACTIVE_FILTER_VALUE.type;
        activeFilters.recent = locationFilterService.INACTIVE_FILTER_VALUE.recent;

        $provide.value('$location', $location);
        $provide.value('$route', $route);
        $provide.value('$routeParams', $routeParams);
        $provide.value('locationService', locationService);
        $provide.value('backendService', backendService);
        $provide.value('$window', {
            localStorage: localStorage
        });
        $provide.value('Leaflet', {});
        $provide.value('leafletData', {
            getMap: function() {
                return {
                    then: function(cb) {
                        cb(map); // TODO: should we only do this asynchronously?
                    }
                };
            }
        });
        $provide.value('locationFilterService', locationFilterService);
    }));

    beforeEach(inject(function($q, _$rootScope_) {
        geoIpDeferred = $q.defer();
        backendService.getGeoIP.andReturn(geoIpDeferred.promise);
        $rootScope = _$rootScope_;
    }));

    describe('constructor.', function() {
        it('does not initialise in constructor.', inject(function(mainMapService) { // jshint ignore:line
            expect(localStorage.getItem).not.toHaveBeenCalled();
            expect(backendService.getGeoIP).not.toHaveBeenCalled();
            expect(map.setView).not.toHaveBeenCalled();
        }));
    });

    describe('initialiseMap.', function() {
        it('method exists.', inject(function(mainMapService) {
            expect(typeof mainMapService.initialiseMap).toBe('function');
        }));

        it('loads the filters route params.', inject(function(mainMapService) {
            $routeParams.type = 'retail';
            $routeParams.recent = 'month';
            mainMapService.initialiseMap();

            expect(activeFilters.type).toBe('retail');
            expect(activeFilters.recent).toBe('month');

            // TODO: verify here and for the center that the URL was updated
        }));

        it('loads the center from the route params.', inject(function(mainMapService) {
            $routeParams.zoom = '12';
            $routeParams.coords = '46.5,7.3';
            mainMapService.initialiseMap();

            expect(localStorage.getItem).not.toHaveBeenCalled();
            expect(backendService.getGeoIP).not.toHaveBeenCalled();
            expect(map.setView).toHaveBeenCalledWith([46.5, 7.3], 12);
        }));

        it('loads the center from local storage if route params are empty.', inject(function(mainMapService) {
            localStorage.getItem.andReturn('{"lat":10.5, "lng": 20.1, "zoom": 3}');
            mainMapService.initialiseMap();

            expect(localStorage.getItem).toHaveBeenCalledWith('veganautMapCenter');
            expect(backendService.getGeoIP).not.toHaveBeenCalled();
            expect(map.setView).toHaveBeenCalledWith([10.5, 20.1], 3);
        }));

        it('loads the center from backend if local storage and route params are empty.', inject(function(mainMapService) {
            mainMapService.initialiseMap();

            expect(localStorage.getItem).toHaveBeenCalledWith('veganautMapCenter');
            expect(backendService.getGeoIP).toHaveBeenCalled();

            geoIpDeferred.resolve({
                data: {
                    lat: 15.2,
                    lng: 22.5
                }
            });
            $rootScope.$apply();

            // TODO: test the bounding box zoom
            expect(map.setView).toHaveBeenCalledWith([15.2, 22.5], 4);
        }));

        it('ignores faulty values.', inject(function(mainMapService) {
            $routeParams.zoom = 'asdf';
            $routeParams.coords = '';
            localStorage.getItem.andReturn('{"lat": "test", "lng": false, "zoom": 3}');
            mainMapService.initialiseMap();

            expect(localStorage.getItem).toHaveBeenCalled();
            expect(backendService.getGeoIP).toHaveBeenCalled();
            expect(map.setView).not.toHaveBeenCalled();
        }));
    });

    describe('onCenterChanged.', function() {
        it('method exists.', inject(function(mainMapService) {
            expect(typeof mainMapService.onCenterChanged).toBe('function');
        }));

        it('updates local storage and url and launches new query.', inject(function(mainMapService) {
            mainMapService.onCenterChanged({
                lat: 20.2,
                lng: -0.5,
                zoom: 3
            });

            // Stored the value in the local storage
            expect(localStorage.setItem).toHaveBeenCalledWith('veganautMapCenter', '{"lat":20.2,"lng":-0.5,"zoom":3}');
            expect($location.replace).toHaveBeenCalled();
            expect($route.updateParams).toHaveBeenCalledWith({
                coords: '20.2000000,-0.5000000',
                zoom: 3
            });

            // Queries by the data gotten from the map
            expect(locationService.queryByBounds).toHaveBeenCalledWith('bbox string', 100);

            // Reset the spies
            localStorage.setItem.reset();
            $route.updateParams.reset();
            locationService.queryByBounds.reset();

            // Should not do anything when running the same update
            mainMapService.onCenterChanged({
                lat: 20.2,
                lng: -0.5,
                zoom: 3
            });

            expect(localStorage.setItem).not.toHaveBeenCalled();
            expect($route.updateParams).not.toHaveBeenCalled();
            expect(locationService.queryByBounds).not.toHaveBeenCalled();
        }));
    });

    describe('onFiltersChanged.', function() {
        it('method exists.', inject(function(mainMapService) {
            expect(typeof mainMapService.onFiltersChanged).toBe('function');
        }));


        it('updates local storage and url and launches new query.', inject(function(mainMapService) {
            activeFilters.type = 'gastronomy';
            activeFilters.recent = 'week';
            mainMapService.onFiltersChanged();

            expect($location.replace).toHaveBeenCalled();
            expect($route.updateParams).toHaveBeenCalledWith({
                type: 'gastronomy',
                recent: 'week'
            });

            // Re-queries the locations
            expect(locationService.queryByBounds).toHaveBeenCalled();

            // Doesn't put the default in the URL
            activeFilters.type = 'defaultTypeFilter';
            mainMapService.onFiltersChanged();
            expect($route.updateParams).toHaveBeenCalledWith({
                recent: 'week'
            });
        }));
    });
});
