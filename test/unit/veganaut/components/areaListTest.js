'use strict';

/* global describe, beforeEach, it, expect, inject */
describe('areaList.', function() {
    // Scope and real services we need
    var scope;
    var $rootScope;
    var Location;
    var Area;

    // Mock services
    var areaService = {};
    var angularPiwik = {};
    var playerService = {};
    var locationService = {};
    var locationFilterService = {};
    var pageTitleService = {};

    // Mock data returned by mock services
    var currentArea;
    var setAreaFromUrlDeferred;
    var deferredQuery;
    var deferredNameForArea;

    // Mock data passed to the controller
    var onLoadItems;

    beforeEach(module('veganaut.app.main', 'veganaut.app.map'));

    beforeEach(module(function($provide) {
        $provide.value('areaService', areaService);
        $provide.value('angularPiwik', angularPiwik);
        $provide.value('playerService', playerService);
        $provide.value('locationService', locationService);
        $provide.value('locationFilterService', locationFilterService);
        $provide.value('pageTitleService', pageTitleService);
    }));

    beforeEach(inject(function(_$rootScope_, $q, _Location_, _Area_) {
        $rootScope = _$rootScope_;
        Location = _Location_;
        Area = _Area_;
        scope = $rootScope.$new();

        setAreaFromUrlDeferred = $q.defer();
        areaService.setAreaFromUrl = jasmine.createSpy('areaService.setAreaFromUrl')
            .andReturn(setAreaFromUrlDeferred.promise)
        ;

        areaService.getCurrentArea = jasmine.createSpy('areaService.getCurrentArea')
            .andCallFake(function() {
                return currentArea;
            })
        ;

        deferredNameForArea = $q.defer();
        areaService.retrieveNameForArea = jasmine.createSpy('areaService.retrieveNameForArea')
            .andReturn(deferredNameForArea.promise)
        ;

        areaService.writeAreaToUrl = jasmine.createSpy('areaService.writeAreaToUrl');

        angularPiwik.track = jasmine.createSpy('angularPiwik.track');

        // playerService.getImmediateMe = jasmine.createSpy('playerService.getImmediateMe');
        playerService.getDeferredMe = jasmine.createSpy('playerService.getDeferredMe')
            .andCallFake(function() {
                return $q.defer().promise;
            })
        ;

        locationService.getLocationSet = jasmine.createSpy('locationService.getLocationSet');

        locationFilterService.setFiltersFromUrl = jasmine.createSpy('locationFilterService.setFiltersFromUrl');
        locationFilterService.hasActiveFilters = jasmine.createSpy('locationFilterService.hasActiveFilters')
            .andReturn(false);
        locationFilterService.getGranularityFilterValue = jasmine.createSpy('locationFilterService.getGranularityFilterValue')
            .andReturn('location');
        locationFilterService.getCategoryValue = jasmine.createSpy('locationFilterService.getCategoryValue')
            .andReturn('gastronomyLocation');

        pageTitleService.addCustomTitle = jasmine.createSpy('pageTitleService.addCustomTitle');

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
            $ctrl.$onInit();

            // expect($location.search).not.toHaveBeenCalled();
            expect(areaService.retrieveNameForArea).not.toHaveBeenCalled();

            expect(areaService.setAreaFromUrl).toHaveBeenCalled();
            expect(areaService.getCurrentArea).not.toHaveBeenCalled();

            expect(angular.isArray($ctrl.list)).toBe(true, 'has a list defined');
            expect($ctrl.list.length).toBe(0, 'list is empty');
            expect($ctrl.totalItems).toBe(0, 'total is 0');
            expect($ctrl.noResultsText).toBe(false, 'not yet declared that no results were found');

            currentArea = new Area({
                lat: 46.5,
                lng: 7.4,
                radius: 522,
                includesWholeWorld: false
            });
            setAreaFromUrlDeferred.resolve();
            $rootScope.$apply();
            expect(areaService.getCurrentArea).toHaveBeenCalled();

            expect($ctrl.area).toBe(currentArea, 'exposed the area');
            expect($ctrl.areaType).toBe('withoutId', 'exposed area type');
            expect(onLoadItems).toHaveBeenCalledWith({
                lat: 46.5,
                lng: 7.4,
                radius: 522,
                limit: 20,
                skip: 0,
                addressType: 'street'
            });
            expect(areaService.retrieveNameForArea).toHaveBeenCalledWith(currentArea);

            expect(areaService.writeAreaToUrl).toHaveBeenCalled();

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

            currentArea.longName = 'test place';
            deferredNameForArea.resolve();
            $rootScope.$apply();
            expect(pageTitleService.addCustomTitle).toHaveBeenCalledWith('test place');

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
            expect(angularPiwik.track).toHaveBeenCalledWith('areaList', 'areaList.showMore', 'areaList.gastronomyLocation');
        }));

        it('with big radius, no results', inject(function($controller) {
            var $ctrl = $controller('vgAreaListCtrl', {$scope: scope}, {
                onLoadItems: onLoadItems
            });
            $ctrl.$onInit();

            currentArea = new Area({
                lat: 10.2,
                lng: 20,
                radius: 268096,
                includesWholeWorld: false
            });
            setAreaFromUrlDeferred.resolve();
            $rootScope.$apply();

            expect(onLoadItems).toHaveBeenCalledWith({
                lat: 10.2,
                lng: 20,
                radius: 268096,
                limit: 20,
                skip: 0,
                addressType: 'city'
            });
            expect($ctrl.displayRadius).toBe('270km', 'set rounded display radius');

            // Resolve with an empty location list
            expect($ctrl.noResultsText).toBe(false, 'not yet declared that no results found');
            deferredQuery.resolve({
                totalItems: 0,
                items: []
            });
            $rootScope.$apply();
            expect($ctrl.noResultsText).toBe('lists.gastronomyLocation.noResults', 'declared that no results found');
            expect($ctrl.list.length).toBe(0, 'list is empty');
            expect($ctrl.totalItems).toBe(0, '0 total items');
        }));

        it('with whole world radius, no results', inject(function($controller) {
            var $ctrl = $controller('vgAreaListCtrl', {$scope: scope}, {
                onLoadItems: onLoadItems
            });
            $ctrl.$onInit();

            currentArea = new Area({
                lat: 10.3,
                lng: 20.2,
                radius: 30000000,
                includesWholeWorld: true
            });
            setAreaFromUrlDeferred.resolve();
            $rootScope.$apply();

            expect(onLoadItems).toHaveBeenCalledWith({
                lat: 0,
                lng: 0,
                radius: 30000000,
                limit: 20,
                skip: 0,
                addressType: 'city'
            });
            expect(areaService.retrieveNameForArea).not.toHaveBeenCalled();
            expect($ctrl.areaType).toBe('world', 'set whole world');
        }));

        it('reloads items on area changes', inject(function($controller) {
            var $ctrl = $controller('vgAreaListCtrl', {$scope: scope}, {onLoadItems: onLoadItems});
            $ctrl.$onInit();

            // Resolve for the initial load
            currentArea = new Area({
                lat: 1.2,
                lng: 2.3,
                radius: 9876,
                includesWholeWorld: false
            });
            setAreaFromUrlDeferred.resolve();
            $rootScope.$apply();
            expect(areaService.writeAreaToUrl).toHaveBeenCalledWith(undefined); // Write area without update to URL

            // Then reset the spies and helpers
            areaService.getCurrentArea.reset();
            onLoadItems.reset();
            areaService.writeAreaToUrl.reset();
            currentArea = new Area({
                lat: 15,
                lng: 16,
                radius: 1234,
                includesWholeWorld: false
            });
            $rootScope.$broadcast('veganaut.area.changed');

            expect(areaService.getCurrentArea).toHaveBeenCalled();
            expect(onLoadItems).toHaveBeenCalledWith({
                lat: 15,
                lng: 16,
                radius: 1234,
                limit: 20,
                skip: 0,
                addressType: 'street'
            });
            expect(areaService.writeAreaToUrl).toHaveBeenCalledWith(true); // Write area with update to URL
        }));

        it('initialises filters from URL', inject(function($controller) {
            var $ctrl = $controller('vgAreaListCtrl', {$scope: scope});
            $ctrl.$onInit();

            expect(locationFilterService.setFiltersFromUrl).toHaveBeenCalled();
        }));

        it('reloads items on filter changes', inject(function($controller) {
            var $ctrl = $controller('vgAreaListCtrl', {$scope: scope}, {onLoadItems: onLoadItems});
            $ctrl.$onInit();

            expect(onLoadItems).not.toHaveBeenCalled();
            $rootScope.$broadcast('veganaut.filters.changed');
            expect(onLoadItems).toHaveBeenCalled();
        }));
    });
});
