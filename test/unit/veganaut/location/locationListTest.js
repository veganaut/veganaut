'use strict';

/* global describe, beforeEach, it, expect, inject */
describe('locationList.', function() {
    // Scope and real services we need
    var scope;
    var $rootScope;
    var Location;

    // Mock services
    var $location = {};
    var locationService = {};
    var geocodeService = {};
    var angularPiwik = {};

    // Mock data returned by mock services
    var getParams = {};
    var deferredLocations;
    var deferredGeocodeSearch;

    beforeEach(module('veganaut.app.map', 'veganaut.app.location'));

    beforeEach(module(function($provide) {
        $provide.value('$location', $location);
        $provide.value('locationService', locationService);
        $provide.value('geocodeService', geocodeService);
        $provide.value('angularPiwik', angularPiwik);
        $provide.value('playerService', {
            getImmediateMe: jasmine.createSpy()
        });

    }));

    beforeEach(inject(function(_$rootScope_, $q, _Location_) {
        $rootScope = _$rootScope_;
        Location = _Location_;
        scope = $rootScope.$new();
        scope.$onRootScope = jasmine.createSpy('$onRootScope');

        $location.search = jasmine.createSpy('$location.search')
            .andCallFake(function() {
                if (arguments.length === 0) {
                    return getParams;
                }
                return $location;
            })
        ;

        locationService.getLocationsByRadius = jasmine.createSpy('locationService.getLocationsByRadius')
            .andCallFake(function() {
                deferredLocations = $q.defer();
                return deferredLocations.promise;
            })
        ;

        locationService.activate = jasmine.createSpy('locationService.activate');

        geocodeService.reverseSearch = jasmine.createSpy('geocodeService.reverseSearch')
            .andCallFake(function() {
                deferredGeocodeSearch = $q.defer();
                return deferredGeocodeSearch.promise;
            })
        ;

        angularPiwik.track = jasmine.createSpy('angularPiwik.track');
    }));

    describe('controller.', function() {
        it('empty params', inject(function($controller) {
            var vm = $controller('vgLocationListCtrl', {$scope: scope});
            expect(typeof vm).toBe('object', 'could instantiate controller');

            expect($location.search).toHaveBeenCalled();
            expect(locationService.getLocationsByRadius).not.toHaveBeenCalled();
            expect(geocodeService.reverseSearch).not.toHaveBeenCalled();

            expect(angular.isArray(vm.list)).toBe(true, 'has a list defined');
            expect(vm.list.length).toBe(0, 'list is empty');
            expect(vm.noResults).toBe(true, 'declared that no results were found');
        }));

        it('basic functionality (valid params with small radius)', inject(function($controller) {
            getParams = {
                lat: '46.5',
                lng: '7.4',
                radius: '522'
            };
            var vm = $controller('vgLocationListCtrl', {$scope: scope});
            expect(typeof vm).toBe('object', 'could instantiate controller');

            expect($location.search).toHaveBeenCalled();
            expect(locationService.getLocationsByRadius).toHaveBeenCalledWith(46.5, 7.4, 522);
            expect(geocodeService.reverseSearch).toHaveBeenCalledWith(46.5, 7.4, 16);

            expect(vm.noResults).toBe(false, 'not declared that no results found');
            expect(vm.displayRadius).toBe('520m', 'set rounded display radius');

            var locations = {};
            for (var i = 0; i < 30; i++) {
                locations['a' + i] = new Location({
                    id: 'a' + i
                });
            }
            deferredLocations.resolve(locations);
            expect(vm.list.length).toBe(0, 'list is empty');
            expect(vm.numShownLocations).toBe(0, 'no locations shown');
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
            vm.onOpenToggle(locations.a1);
            expect(locationService.activate).toHaveBeenCalledWith(locations.a1);
        }));

        it('valid params with big radius, no results', inject(function($controller) {
            getParams = {
                lat: '10.2',
                lng: '20',
                radius: '268096'
            };
            var vm = $controller('vgLocationListCtrl', {$scope: scope});

            expect(locationService.getLocationsByRadius).toHaveBeenCalledWith(10.2, 20, 268096);
            expect(geocodeService.reverseSearch).toHaveBeenCalledWith(10.2, 20, 13);
            expect(vm.displayRadius).toBe('270km', 'set rounded display radius');

            // Resolve with an empty location list
            deferredLocations.resolve({});
            expect(vm.noResults).toBe(false, 'not yet declared that no results found');
            $rootScope.$apply();
            expect(vm.noResults).toBe(true, 'declared that no results found');
            expect(vm.list.length).toBe(0, 'list is empty');
            expect(vm.numShownLocations).toBe(0, 'no locations shown');

            // Resolve with no geocode result
            deferredGeocodeSearch.resolve();
            $rootScope.$apply();
            expect(vm.displayName).toBe('lat 10.200 lng 20.000', 'display name set to fallback');
        }));

        it('unsets get parameters when leaving', inject(function($controller) {
            $controller('vgLocationListCtrl', {$scope: scope});

            expect(scope.$onRootScope).toHaveBeenCalled();
            var args = scope.$onRootScope.calls[0].args;

            expect(args[0]).toBe('$routeChangeStart', 'listens to route change');
            var handler = args[1];
            expect(angular.isFunction(handler)).toBe(true, 'registered a function');


            expect($location.search.calls.length).toBe(1, 'called $location.search during init');

            // Call first with an event that is prevented
            handler({
                defaultPrevented: true
            });
            expect($location.search.calls.length).toBe(1, 'did not call $location.search');

            handler({
                defaultPrevented: false
            });
            expect($location.search).toHaveBeenCalledWith('lat', null);
            expect($location.search).toHaveBeenCalledWith('lng', null);
            expect($location.search).toHaveBeenCalledWith('radius', null);
        }));
    });
});
