'use strict';

/* global describe, beforeEach, it, expect, inject, jasmine */
describe('mainMapService.', function() {
    var $location, $rootScope, $routeParams, $route, areaService, locationService,
        map, locationFilterService, getCurrentAreaDeferred, activeFilters = {};

    beforeEach(module('veganaut.app.main', 'veganaut.app.map'));

    beforeEach(module(function($provide) {
        // Set up all the mock dependencies
        $location = {
            replace: jasmine.createSpy('$location.replace'),
            search: jasmine.createSpy('$location.search')
        };

        $routeParams = {};
        $route = {
            current: {
                vgRouteName: 'map'
            }
        };

        locationService = {
            queryByBounds: jasmine.createSpy('locationService.queryByBounds')
        };

        areaService = {
            setArea: jasmine.createSpy('areaService.setArea'),
            getCurrentArea: jasmine.createSpy('areaService.getCurrentArea')
        };

        map = {
            setView: jasmine.createSpy('map.setView'),
            getBoundsZoom: jasmine.createSpy('map.getBoundsZoom')
        };

        locationFilterService = {
            POSSIBLE_FILTERS: {
                type: ['retail', 'gastronomy', 'defaultTypeFilter'],
                recent: ['week', 'month', 'defaultRecentFilter']

            },
            INACTIVE_FILTER_VALUE: {
                type: 'defaultTypeFilter',
                recent: 'defaultRecentFilter'
            },
            activeFilters: activeFilters,
            setFiltersFromUrl: jasmine.createSpy('locationFilterService.setFiltersFromUrl')
        };
        activeFilters.type = locationFilterService.INACTIVE_FILTER_VALUE.type;
        activeFilters.recent = locationFilterService.INACTIVE_FILTER_VALUE.recent;

        $provide.value('$location', $location);
        $provide.value('$routeParams', $routeParams);
        $provide.value('$route', $route);
        $provide.value('areaService', areaService);
        $provide.value('locationService', locationService);
        $provide.value('locationFilterService', locationFilterService);
    }));

    beforeEach(inject(function($q, _$rootScope_) {
        getCurrentAreaDeferred = $q.defer();
        areaService.getCurrentArea.andReturn(getCurrentAreaDeferred.promise);
        $rootScope = _$rootScope_;
        spyOn($rootScope, '$on').andCallThrough();
    }));

    describe('constructor.', function() {
        it('does not initialise in constructor.', inject(function(mainMapService) { // jshint ignore:line
            expect(areaService.getCurrentArea).not.toHaveBeenCalled();
            expect(areaService.setArea).not.toHaveBeenCalled();
        }));

        it('cleans up URL when leaving map.', inject(function(mainMapService) { // jshint ignore:line
            expect($rootScope.$on).toHaveBeenCalled();
            // TODO: find a better way than accessing directly calls[1]
            expect($rootScope.$on.calls[1].args[0]).toBe('$routeChangeStart', 'subscribed to route changes');

            $rootScope.$broadcast(
                '$routeChangeStart',
                {
                    // New route is not map
                    vgRouteName: 'home'
                },
                {
                    // Old route is map
                    vgRouteName: 'map'
                }
            );

            expect($location.search).toHaveBeenCalledWith('zoom', undefined);
            expect($location.search).toHaveBeenCalledWith('coords', undefined);
        }));
    });

    describe('initialiseMap.', function() {
        it('method exists.', inject(function(mainMapService) {
            expect(typeof mainMapService.initialiseMap).toBe('function');
        }));

        it('tells the locationFilterService to load the filters.', inject(function(mainMapService) {
            mainMapService.initialiseMap(map);
            expect(locationFilterService.setFiltersFromUrl).toHaveBeenCalled();
        }));

        it('loads the center from the route params.', inject(function(mainMapService) {
            $routeParams.zoom = '12';
            $routeParams.coords = '46.5,7.3';
            var promise = mainMapService.initialiseMap(map);

            expect(typeof promise).toBe('object', 'returned an object');
            expect(typeof promise.then).toBe('function', 'returned a promise');

            expect(areaService.setArea.calls.length).toBe(1, 'called setArea once');
            expect(areaService.setArea.calls[0].args.length).toBe(1, 'called setArea with one argument');
            var areaSet = areaService.setArea.calls[0].args[0];
            expect(typeof areaSet).toBe('object', 'set an object');
            expect(areaSet.getLat()).toBe(46.5, 'set correct lat');
            expect(areaSet.getLng()).toBe(7.3, 'set correct lng');
            expect(areaSet.getZoom()).toBe(12, 'set correct zoom');

            var resolved = false;
            promise.then(function() {
                resolved = true;
            });
            expect(resolved).toBe(false, 'has not resolved promise set');

            expect(areaService.getCurrentArea).toHaveBeenCalled();
            getCurrentAreaDeferred.resolve(areaSet);
            $rootScope.$apply();
            expect(resolved).toBe(true, 'resolved promise');

            expect(map.setView).toHaveBeenCalledWith([46.5, 7.3], 12);
        }));

        it('can initialise map based on bounding box.', inject(function(mainMapService) {
            map.getBoundsZoom.andReturn(9);

            mainMapService.initialiseMap(map);

            expect(areaService.getCurrentArea).toHaveBeenCalled();
            getCurrentAreaDeferred.resolve({
                getLat: function() {
                },
                getLng: function() {
                },
                getZoom: function() {
                },
                getBoundingBox: function() {
                    return {
                        getCenter: function() {
                            return {
                                lat: 80.5,
                                lng: 35.1
                            };
                        }
                    };
                }
            });
            $rootScope.$apply();

            expect(map.setView).toHaveBeenCalledWith([80.5, 35.1], 9);
        }));

        it('does not zoom out to very big bounding boxes.', inject(function(mainMapService) {
            map.getBoundsZoom.andReturn(1);

            mainMapService.initialiseMap(map);

            expect(areaService.getCurrentArea).toHaveBeenCalled();
            getCurrentAreaDeferred.resolve({
                getLat: function() {
                    return 11.1;
                },
                getLng: function() {
                    return 22.2;
                },
                getZoom: function() {
                },
                getBoundingBox: function() {
                    return {
                        getCenter: function() {
                        }
                    };
                }
            });
            $rootScope.$apply();

            // Used default max zoom
            expect(map.setView).toHaveBeenCalledWith([11.1, 22.2], 4);
        }));

        it('uses radius if no zoom and bounding box given.', inject(function(mainMapService) {
            map.getBoundsZoom.andReturn(16);

            mainMapService.initialiseMap(map);

            expect(areaService.getCurrentArea).toHaveBeenCalled();
            getCurrentAreaDeferred.resolve({
                getLat: function() {
                    return 11.1;
                },
                getLng: function() {
                    return 22.2;
                },
                getZoom: function() {
                },
                getRadius: function() {
                    return 3333;
                },
                getBoundingBox: function() {
                }
            });
            $rootScope.$apply();

            // Should have create a circle around the center, but can't really verify that fully
            expect(map.getBoundsZoom).toHaveBeenCalled();
            var boundsArg = map.getBoundsZoom.calls[0].args[0];
            expect(boundsArg.getCenter().lat).toBe(11.1);
            expect(boundsArg.getCenter().lng).toBe(22.2);

            // Used default max zoom
            expect(map.setView).toHaveBeenCalledWith([11.1, 22.2], 16);
        }));

        it('falls back to default zoom if all else fails.', inject(function(mainMapService) {
            mainMapService.initialiseMap(map);

            expect(areaService.getCurrentArea).toHaveBeenCalled();
            getCurrentAreaDeferred.resolve({
                getLat: function() {
                    return 11.1;
                },
                getLng: function() {
                    return 22.2;
                },
                getZoom: function() {
                },
                getRadius: function() {
                },
                getBoundingBox: function() {
                }
            });
            $rootScope.$apply();

            // Used default max zoom
            expect(map.setView).toHaveBeenCalledWith([11.1, 22.2], 4);
        }));
    });

    describe('onCenterChanged.', function() {
        it('method exists.', inject(function(mainMapService) {
            expect(typeof mainMapService.onCenterChanged).toBe('function');
        }));

        it('updates local storage and url and launches new query.', inject(function(mainMapService) {
            // Return successfully set area
            areaService.setArea.andReturn(true);

            mainMapService.onCenterChanged({
                lat: 20.2,
                lng: -0.5,
                zoom: 3,
                boundingBox: [[-46.6, -74.0], [68.1, 72.9]]
            });

            expect(areaService.setArea.calls.length).toBe(1, 'called setArea once');
            expect(areaService.setArea.calls[0].args.length).toBe(1, 'called setArea with one argument');
            var areaSet = areaService.setArea.calls[0].args[0];
            expect(typeof areaSet).toBe('object', 'set an object');
            expect(areaSet.getLat()).toBe(20.2, 'set correct lat');
            expect(areaSet.getLng()).toBe(-0.5, 'set correct lng');
            expect(areaSet.getZoom()).toBe(3, 'set correct zoom');
            expect(areaSet.getBoundingBox().toBBoxString()).toBe('-74,-46.6,72.9,68.1', 'set correct bounding box');

            expect(areaService.getCurrentArea).toHaveBeenCalled();
            getCurrentAreaDeferred.resolve(areaSet);
            $rootScope.$apply();

            expect($location.replace).toHaveBeenCalled();
            expect($location.search).toHaveBeenCalledWith('zoom', 3);
            expect($location.search).toHaveBeenCalledWith('coords', '20.2000000,-0.5000000');

            // Queries by the data gotten from the map
            expect(locationService.queryByBounds).toHaveBeenCalledWith('-74,-46.6,72.9,68.1', 3);
        }));

        it('does nothing on invalid center.', inject(function(mainMapService) {
            // Return not set area
            areaService.setArea.andReturn(false);
            mainMapService.onCenterChanged({});

            expect(areaService.setArea.calls.length).toBe(1, 'called setArea once');
            expect(areaService.getCurrentArea).not.toHaveBeenCalled();
            expect($location.replace).not.toHaveBeenCalled();
            expect($location.search).not.toHaveBeenCalled();
            expect(locationService.queryByBounds).not.toHaveBeenCalled();
        }));
    });

    describe('filter changes.', function() {
        it('launches new query when filters change.', inject(function(mainMapService) { // jshint ignore:line
            expect($rootScope.$on).toHaveBeenCalled();
            expect($rootScope.$on.calls[0].args[0]).toBe('veganaut.filters.changed', 'subscribed to filter changes');

            $rootScope.$broadcast('veganaut.filters.changed');

            // Re-queries the locations
            expect(areaService.getCurrentArea).toHaveBeenCalled();
            getCurrentAreaDeferred.resolve({
                getBoundingBox: function() {
                    return {
                        toBBoxString: function() {
                        }
                    };
                },
                getZoom: function() {
                }
            });
            $rootScope.$apply();
            expect(locationService.queryByBounds).toHaveBeenCalled();
        }));
    });
});
