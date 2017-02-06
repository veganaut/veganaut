'use strict';

/* global describe, beforeEach, it, expect, inject */
describe('locationList.', function() {
    // Scope and real services we need
    var scope;
    var $rootScope;
    var Location;

    // Mock services
    var $location = {};
    var $routeParams = {};
    var areaService = {};
    var locationService = {};
    var geocodeService = {};
    var angularPiwik = {};
    var playerService = {};
    var locationFilterService = {};

    // Mock data returned by mock services
    var locationSet;
    var getCurrentAreaDeferred;
    var deferredQuery;
    var deferredGeocodeSearch;

    beforeEach(module('veganaut.app.main', 'veganaut.app.map', 'veganaut.app.location'));

    beforeEach(module(function($provide) {
        $provide.value('$location', $location);
        $provide.value('$routeParams', $routeParams);
        $provide.value('areaService', areaService);
        $provide.value('locationService', locationService);
        $provide.value('geocodeService', geocodeService);
        $provide.value('angularPiwik', angularPiwik);
        $provide.value('playerService', playerService);
        $provide.value('locationFilterService', locationFilterService);
    }));

    beforeEach(inject(function(_$rootScope_, $q, _Location_) {
        $rootScope = _$rootScope_;
        Location = _Location_;
        scope = $rootScope.$new();

        locationSet = {
            locations: {},
            activate: jasmine.createSpy('locationSet.activate')
        };

        $location.replace = jasmine.createSpy('$location.replace');
        $location.search = jasmine.createSpy('$location.search');

        areaService.setArea = jasmine.createSpy('areaService.setArea');

        getCurrentAreaDeferred = $q.defer();
        areaService.getCurrentArea = jasmine.createSpy('areaService.getCurrentArea')
            .andReturn(getCurrentAreaDeferred.promise)
        ;

        locationService.getLocationSet = jasmine.createSpy('locationService.getLocationSet')
            .andReturn(locationSet)
        ;

        deferredQuery = $q.defer();
        locationService.queryByRadius = jasmine.createSpy('locationService.queryByRadius')
            .andReturn(deferredQuery.promise)
        ;

        deferredGeocodeSearch = $q.defer();
        geocodeService.reverseSearch = jasmine.createSpy('geocodeService.reverseSearch')
            .andReturn(deferredGeocodeSearch.promise)
        ;

        angularPiwik.track = jasmine.createSpy('angularPiwik.track');

        playerService.getImmediateMe = jasmine.createSpy('playerService.getImmediateMe');
        playerService.getDeferredMe = jasmine.createSpy('playerService.getDeferredMe')
            .andCallFake(function() {
                return $q.defer().promise;
            })
        ;

        locationFilterService.setFiltersFromUrl = jasmine.createSpy('locationFilterService.setFiltersFromUrl');
        locationFilterService.hasActiveFilters = jasmine.createSpy('locationFilterService.hasActiveFilters')
            .andReturn(false);
    }));

    describe('controller.', function() {
        it('basic functionality (valid params with small radius)', inject(function($controller) {
            var vm = $controller('vgLocationListCtrl', {$scope: scope});
            expect(typeof vm).toBe('object', 'could instantiate controller');

            expect($location.search).not.toHaveBeenCalled();
            expect(locationService.queryByRadius).not.toHaveBeenCalled();
            expect(geocodeService.reverseSearch).not.toHaveBeenCalled();

            expect(areaService.setArea).not.toHaveBeenCalled();
            expect(areaService.getCurrentArea).toHaveBeenCalled();

            expect(angular.isArray(vm.list)).toBe(true, 'has a list defined');
            expect(vm.list.length).toBe(0, 'list is empty');
            expect(vm.noResultsText).toBe(false, 'not yet declared that no results were found');

            getCurrentAreaDeferred.resolve({
                getRadiusParams: function() {
                    return {
                        lat: 46.5,
                        lng: 7.4,
                        radius: 522,
                        includesWholeWorld: false
                    };
                }
            });
            $rootScope.$apply();

            expect(vm.wholeWorld).toBe(false, 'exposed whole world setting');
            expect(locationService.queryByRadius).toHaveBeenCalledWith(46.5, 7.4, 522, 'street');
            expect(geocodeService.reverseSearch).toHaveBeenCalledWith(46.5, 7.4, 16);

            expect($location.replace).toHaveBeenCalled();
            expect($location.search).toHaveBeenCalledWith('coords', '46.5000000,7.4000000');
            expect($location.search).toHaveBeenCalledWith('radius', 522);

            expect(vm.noResultsText).toBe(false, 'still not declared that no results found');
            expect(vm.displayRadius).toBe('520m', 'set rounded display radius');

            locationSet.locations = {};
            for (var i = 0; i < 30; i++) {
                locationSet.locations['a' + i] = new Location({
                    id: 'a' + i
                });
            }
            expect(vm.list.length).toBe(0, 'list is still empty');
            expect(vm.numShownLocations).toBe(0, 'no locations shown');
            deferredQuery.resolve();
            $rootScope.$apply();
            expect(vm.list.length).toBe(30, 'list now has elements');
            expect(vm.numShownLocations).toBe(20, 'showing only the first locations');

            deferredGeocodeSearch.resolve({
                getDisplayName: function() {
                    return 'test place';
                }
            });
            expect(vm.displayName).toBe('', 'display name empty at first');
            $rootScope.$apply();
            expect(vm.displayName).toBe('test place', 'set the name from the geocode result');

            expect(angular.isFunction(vm.showMore), 'has a showMore function');
            vm.showMore();
            expect(vm.numShownLocations).toBe(30, 'showing more locations after showMore');
            expect(angularPiwik.track).toHaveBeenCalledWith('locationList', 'locationList.showMore');

            expect(angular.isFunction(vm.onOpenToggle), 'has an onOpenToggle function');
            vm.onOpenToggle(locationSet.locations.a1);
            expect(locationSet.activate).toHaveBeenCalledWith(locationSet.locations.a1);
        }));

        it('with big radius, no results', inject(function($controller) {
            var vm = $controller('vgLocationListCtrl', {$scope: scope});

            getCurrentAreaDeferred.resolve({
                getRadiusParams: function() {
                    return {
                        lat: 10.2,
                        lng: 20,
                        radius: 268096,
                        includesWholeWorld: false
                    };
                }
            });
            $rootScope.$apply();

            expect(locationService.queryByRadius).toHaveBeenCalledWith(10.2, 20, 268096, 'city');
            expect(geocodeService.reverseSearch).toHaveBeenCalledWith(10.2, 20, 13);
            expect(vm.displayRadius).toBe('270km', 'set rounded display radius');

            // Resolve with an empty location list
            locationSet.locations = {};
            expect(vm.noResultsText).toBe(false, 'not yet declared that no results found');
            deferredQuery.resolve();
            $rootScope.$apply();
            expect(vm.noResultsText).toBe('locationList.noResults', 'declared that no results found');
            expect(vm.list.length).toBe(0, 'list is empty');
            expect(vm.numShownLocations).toBe(0, 'no locations shown');

            // Resolve with no geocode result
            deferredGeocodeSearch.resolve();
            $rootScope.$apply();
            expect(vm.displayName).toBe('lat 10.200 lng 20.000', 'display name set to fallback');
        }));

        it('with whole world radius, no results', inject(function($controller) {
            var vm = $controller('vgLocationListCtrl', {$scope: scope});

            getCurrentAreaDeferred.resolve({
                getRadiusParams: function() {
                    return {
                        lat: 10.3,
                        lng: 20.2,
                        radius: 30000000,
                        includesWholeWorld: true
                    };
                }
            });
            $rootScope.$apply();

            expect(locationService.queryByRadius).toHaveBeenCalledWith(10.3, 20.2, 30000000, 'city');
            expect(geocodeService.reverseSearch).not.toHaveBeenCalled();
            expect(vm.displayRadius).toBe('', 'set no display radius');
            expect(vm.wholeWorld).toBe(true, 'set whole world');
        }));

        it('sets area from URL', inject(function($controller) {
            $routeParams.coords = '65.2,54.3';
            $routeParams.radius = '1234';

            $controller('vgLocationListCtrl', {$scope: scope});

            expect(areaService.setArea.calls.length).toBe(1, 'called setArea once');
            expect(areaService.setArea.calls[0].args.length).toBe(1, 'called setArea with one argument');
            var areaSet = areaService.setArea.calls[0].args[0];
            expect(typeof areaSet).toBe('object', 'set an object');
            expect(areaSet.getLat()).toBe(65.2, 'set correct lat');
            expect(areaSet.getLng()).toBe(54.3, 'set correct lng');
            expect(areaSet.getRadius()).toBe(1234, 'set correct radius');
        }));

        it('unsets get parameters when leaving', inject(function($controller) {
            $controller('vgLocationListCtrl', {$scope: scope});

            expect($location.search).not.toHaveBeenCalled();

            scope.$broadcast('$routeChangeStart');
            expect($location.search).toHaveBeenCalledWith('coords', undefined);
            expect($location.search).toHaveBeenCalledWith('radius', undefined);
        }));

        it('initialises filters from URL', inject(function($controller) {
            $controller('vgLocationListCtrl', {$scope: scope});

            expect(locationFilterService.setFiltersFromUrl).toHaveBeenCalled();
        }));

        it('reloads locations on filter changes', inject(function($controller) {
            $controller('vgLocationListCtrl', {$scope: scope});

            expect(locationService.queryByRadius).not.toHaveBeenCalled();
            $rootScope.$broadcast('veganaut.filters.changed');
            expect(locationService.queryByRadius).toHaveBeenCalled();
        }));
    });
});
