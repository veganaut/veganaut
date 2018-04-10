'use strict';

/* global describe, beforeEach, it, expect, inject */
describe('areaList.', function() {
    // Scope and real services we need
    var scope;
    var $rootScope;
    var Location;

    // Mock services
    var $location = {};
    var $routeParams = {};
    var areaService = {};
    var geocodeService = {};
    var angularPiwik = {};
    var playerService = {};
    var locationService = {};
    var locationFilterService = {};

    // Mock data returned by mock services
    var getCurrentAreaDeferred;
    var deferredQuery;
    var deferredGeocodeSearch;

    // Mock data passed to the controller
    var onLoadItems;

    beforeEach(module('veganaut.app.main', 'veganaut.app.map'));

    beforeEach(module(function($provide) {
        $provide.value('$location', $location);
        $provide.value('$routeParams', $routeParams);
        $provide.value('areaService', areaService);
        $provide.value('geocodeService', geocodeService);
        $provide.value('angularPiwik', angularPiwik);
        $provide.value('playerService', playerService);
        $provide.value('locationService', locationService);
        $provide.value('locationFilterService', locationFilterService);
    }));

    beforeEach(inject(function(_$rootScope_, $q, _Location_) {
        $rootScope = _$rootScope_;
        Location = _Location_;
        scope = $rootScope.$new();

        $location.replace = jasmine.createSpy('$location.replace');
        $location.search = jasmine.createSpy('$location.search');

        areaService.setArea = jasmine.createSpy('areaService.setArea');

        getCurrentAreaDeferred = $q.defer();
        areaService.getCurrentArea = jasmine.createSpy('areaService.getCurrentArea')
            .andCallFake(function() {
                return getCurrentAreaDeferred.promise;
            })
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

        locationService.getLocationSet = jasmine.createSpy('locationService.getLocationSet');

        locationFilterService.setFiltersFromUrl = jasmine.createSpy('locationFilterService.setFiltersFromUrl');
        locationFilterService.hasActiveFilters = jasmine.createSpy('locationFilterService.hasActiveFilters')
            .andReturn(false);
        locationFilterService.getTypeFilterValue = jasmine.createSpy('locationFilterService.getTypeFilterValue')
            .andReturn('gastronomy');
        locationFilterService.getGroupFilterValue = jasmine.createSpy('locationFilterService.getGroupFilterValue')
            .andReturn('location');

        deferredQuery = $q.defer();
        onLoadItems = jasmine.createSpy('onLoadItems')
            .andCallFake(function() {
                return deferredQuery.promise;
            })
        ;
    }));

    describe('controller.', function() {
        it('basic functionality (valid params with small radius)', inject(function($controller, $q) {
            var $ctrl = $controller('vgAreaListCtrl', {$scope: scope}, {
                onLoadItems: onLoadItems
            });
            expect(typeof $ctrl).toBe('object', 'could instantiate controller');

            expect($location.search).not.toHaveBeenCalled();
            expect(geocodeService.reverseSearch).not.toHaveBeenCalled();

            expect(areaService.setArea).not.toHaveBeenCalled();
            expect(areaService.getCurrentArea).toHaveBeenCalled();

            expect(angular.isArray($ctrl.list)).toBe(true, 'has a list defined');
            expect($ctrl.list.length).toBe(0, 'list is empty');
            expect($ctrl.totalItems).toBe(0, 'total is 0');
            expect($ctrl.noResultsText).toBe(false, 'not yet declared that no results were found');

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

            expect($ctrl.wholeWorld).toBe(false, 'exposed whole world setting');
            expect(onLoadItems).toHaveBeenCalledWith({
                lat: 46.5,
                lng: 7.4,
                radius: 522,
                limit: 20,
                skip: 0,
                addressType: 'street'
            });
            expect(geocodeService.reverseSearch).toHaveBeenCalledWith(46.5, 7.4, 16);

            expect($location.replace).toHaveBeenCalled();
            expect($location.search).toHaveBeenCalledWith('coords', '46.5000000,7.4000000');
            expect($location.search).toHaveBeenCalledWith('radius', 522);

            expect($ctrl.noResultsText).toBe(false, 'still not declared that no results found');
            expect($ctrl.displayRadius).toBe('520m', 'set rounded display radius');

            var locations = [];
            for (var i = 0; i < 30; i++) {
                locations.push(new Location({
                    id: 'a' + i
                }));
            }
            expect($ctrl.list.length).toBe(0, 'list is still empty');
            expect($ctrl.totalItems).toBe(0, 'still no items');
            deferredQuery.resolve({
                totalItems: 30,
                items: _.slice(locations, 0, 20)
            });
            $rootScope.$apply();
            expect($ctrl.list.length).toBe(20, 'list now has elements');
            expect($ctrl.totalItems).toBe(30, 'exposes total items');

            deferredGeocodeSearch.resolve({
                getLongName: function() {
                    return 'test place';
                }
            });
            expect($ctrl.displayName).toBe('', 'display name empty at first');
            $rootScope.$apply();
            expect($ctrl.displayName).toBe('test place', 'set the name from the geocode result');

            // Test show more
            expect(angular.isFunction($ctrl.showMore), 'has a showMore function');
            onLoadItems.reset();
            deferredQuery = $q.defer();
            $ctrl.showMore();
            expect(onLoadItems).toHaveBeenCalledWith({
                lat: 46.5,
                lng: 7.4,
                radius: 522,
                limit: 20,
                skip: 20,
                addressType: 'street'
            });
            deferredQuery.resolve({
                totalItems: 30,
                items: _.slice(locations, 20)
            });
            $rootScope.$apply();

            expect($ctrl.list.length).toBe(30, 'list now has more elements');
            expect($ctrl.totalItems).toBe(30, 'still the same total items');
            expect($ctrl.list[3].id).toBe('a3', 'kept the locations from the first call');
            expect($ctrl.list[24].id).toBe('a24', 'concatenated the list from the second call to the end');
            expect(angularPiwik.track).toHaveBeenCalledWith('restaurantList', 'restaurantList.showMore');
        }));

        it('with big radius, no results', inject(function($controller) {
            var $ctrl = $controller('vgAreaListCtrl', {$scope: scope}, {
                onLoadItems: onLoadItems
            });

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

            expect(onLoadItems).toHaveBeenCalledWith({
                lat: 10.2,
                lng: 20,
                radius: 268096,
                limit: 20,
                skip: 0,
                addressType: 'city'
            });
            expect(geocodeService.reverseSearch).toHaveBeenCalledWith(10.2, 20, 13);
            expect($ctrl.displayRadius).toBe('270km', 'set rounded display radius');

            // Resolve with an empty location list
            expect($ctrl.noResultsText).toBe(false, 'not yet declared that no results found');
            deferredQuery.resolve({
                totalItems: 0,
                items: []
            });
            $rootScope.$apply();
            expect($ctrl.noResultsText).toBe('lists.restaurant.noResults', 'declared that no results found');
            expect($ctrl.list.length).toBe(0, 'list is empty');
            expect($ctrl.totalItems).toBe(0, '0 total items');

            // Resolve with no geocode result
            deferredGeocodeSearch.resolve();
            $rootScope.$apply();
            expect($ctrl.displayName).toBe('lat 10.200 lng 20.000', 'display name set to fallback');
        }));

        it('with whole world radius, no results', inject(function($controller) {
            var $ctrl = $controller('vgAreaListCtrl', {$scope: scope}, {
                onLoadItems: onLoadItems
            });

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

            expect(onLoadItems).toHaveBeenCalledWith({
                lat: 10.3,
                lng: 20.2,
                radius: 30000000,
                limit: 20,
                skip: 0,
                addressType: 'city'
            });
            expect(geocodeService.reverseSearch).not.toHaveBeenCalled();
            expect($ctrl.displayRadius).toBe('', 'set no display radius');
            expect($ctrl.wholeWorld).toBe(true, 'set whole world');
        }));

        it('sets area from URL', inject(function($controller) {
            $routeParams.coords = '65.2,54.3';
            $routeParams.radius = '1234';

            $controller('vgAreaListCtrl', {$scope: scope});

            expect(areaService.setArea.calls.length).toBe(1, 'called setArea once');
            expect(areaService.setArea.calls[0].args.length).toBe(1, 'called setArea with one argument');
            var areaSet = areaService.setArea.calls[0].args[0];
            expect(typeof areaSet).toBe('object', 'set an object');
            expect(areaSet.getLat()).toBe(65.2, 'set correct lat');
            expect(areaSet.getLng()).toBe(54.3, 'set correct lng');
            expect(areaSet.getRadius()).toBe(1234, 'set correct radius');
        }));

        it('reloads items on area changes', inject(function($controller, $q) {
            $controller('vgAreaListCtrl', {$scope: scope}, {onLoadItems: onLoadItems});

            // Resolve for the initial load
            getCurrentAreaDeferred.resolve({
                getRadiusParams: function() {
                    return {
                        lat: 1.2,
                        lng: 2.3,
                        radius: 9876,
                        includesWholeWorld: false
                    };
                }
            });
            $rootScope.$apply();

            // Then reset the spies and helpers
            getCurrentAreaDeferred = $q.defer();
            areaService.getCurrentArea.reset();
            onLoadItems.reset();
            $rootScope.$broadcast('veganaut.area.changed');
            expect(areaService.getCurrentArea).toHaveBeenCalled();

            getCurrentAreaDeferred.resolve({
                getRadiusParams: function() {
                    return {
                        lat: 15,
                        lng: 16,
                        radius: 1234,
                        includesWholeWorld: false
                    };
                }
            });
            $rootScope.$apply();

            expect(onLoadItems).toHaveBeenCalledWith({
                lat: 15,
                lng: 16,
                radius: 1234,
                limit: 20,
                skip: 0,
                addressType: 'street'
            });
        }));

        it('unsets get parameters when leaving', inject(function($controller) {
            $controller('vgAreaListCtrl', {$scope: scope});

            expect($location.search).not.toHaveBeenCalled();

            scope.$broadcast('$routeChangeStart');
            expect($location.search).toHaveBeenCalledWith('coords', undefined);
            expect($location.search).toHaveBeenCalledWith('radius', undefined);
        }));

        it('initialises filters from URL', inject(function($controller) {
            $controller('vgAreaListCtrl', {$scope: scope});

            expect(locationFilterService.setFiltersFromUrl).toHaveBeenCalled();
        }));

        it('reloads items on filter changes', inject(function($controller) {
            $controller('vgAreaListCtrl', {$scope: scope}, {onLoadItems: onLoadItems});

            expect(onLoadItems).not.toHaveBeenCalled();
            $rootScope.$broadcast('veganaut.filters.changed');
            expect(onLoadItems).toHaveBeenCalled();
        }));
    });
});
