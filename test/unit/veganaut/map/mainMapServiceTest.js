'use strict';

/* global describe, beforeEach, it, expect, inject, jasmine */
describe('mainMapService.', function() {
    var $location, $rootScope, backendService, localStorage, hash = '', geoIpDeferred, activeFilters = {};
    beforeEach(module('veganaut.app.map'));

    beforeEach(module(function($provide) {
        // Set up all the mock dependencies
        hash = '';
        $location = {
            hash: jasmine.createSpy('$location.hash').andCallFake(function() {
                return hash;
            }),
            replace: jasmine.createSpy('$location.replace')
        };

        backendService = {
            getGeoIP: jasmine.createSpy('backendService.getGeoIP')
        };

        localStorage = {
            getItem: jasmine.createSpy('getItem'),
            setItem: jasmine.createSpy('setItem')
        };

        var locationFilterService = {
            INACTIVE_FILTER_VALUE: {
                type: 'defaultTypeFilter'
            },
            activeFilters: activeFilters
        };
        activeFilters.type = locationFilterService.INACTIVE_FILTER_VALUE.type;

        $provide.value('$location', $location);
        $provide.value('backendService', backendService);
        $provide.value('$window', {
            localStorage: localStorage
        });
        $provide.value('Leaflet', {});
        $provide.value('leafletData', {});
        $provide.value('locationFilterService', locationFilterService);
    }));

    beforeEach(inject(function($q, _$rootScope_) {
        geoIpDeferred = $q.defer();
        backendService.getGeoIP.andReturn(geoIpDeferred.promise);
        $rootScope = _$rootScope_;
    }));

    describe('constructor.', function() {
        it('loads the center from the url hash.', function() {
            hash = 'zoom:12,coords:46.5-7.3';
            inject(function(mainMapService) {
                expect($location.hash).toHaveBeenCalledWith();
                expect(localStorage.getItem).not.toHaveBeenCalled();
                expect(backendService.getGeoIP).not.toHaveBeenCalled();
                expect(mainMapService.center).toEqual({
                    lat: 46.5,
                    lng: 7.3,
                    zoom: 12
                });

                // Stored the value in the local storage (but not the hash, that's only done on explicit save)
                expect(localStorage.setItem).toHaveBeenCalledWith('veganautMapCenter', '{"lat":46.5,"lng":7.3,"zoom":12}');
            });
        });

        it('loads the center from local storage if url hash is empty.', function() {
            localStorage.getItem.andReturn('{"lat":10.5, "lng": 20.1, "zoom": 3}');
            inject(function(mainMapService) {
                expect($location.hash).toHaveBeenCalledWith();
                expect(localStorage.getItem).toHaveBeenCalledWith('veganautMapCenter');
                expect(backendService.getGeoIP).not.toHaveBeenCalled();
                expect(mainMapService.center).toEqual({
                    lat: 10.5,
                    lng: 20.1,
                    zoom: 3
                });

                expect(localStorage.setItem).toHaveBeenCalledWith('veganautMapCenter', '{"lat":10.5,"lng":20.1,"zoom":3}');
            });
        });

        it('loads the center from backend if local storage and url hash are empty.', function() {
            inject(function(mainMapService) {
                expect($location.hash).toHaveBeenCalledWith();
                expect(localStorage.getItem).toHaveBeenCalledWith('veganautMapCenter');
                expect(backendService.getGeoIP).toHaveBeenCalled();
                expect(mainMapService.center).toEqual({
                    lat: 0,
                    lng: 0,
                    zoom: 2
                }, 'sensible default before backend returns');

                // Didn't save the default value
                expect(localStorage.setItem).not.toHaveBeenCalled();

                geoIpDeferred.resolve({
                    data: {
                        lat: 15.2,
                        lng: 22.5
                    }
                });
                $rootScope.$apply();

                expect(mainMapService.center).toEqual({
                    lat: 15.2,
                    lng: 22.5,
                    zoom: 10
                }, 'takes values from backend');

                expect(localStorage.setItem).toHaveBeenCalledWith('veganautMapCenter', '{"lat":15.2,"lng":22.5,"zoom":10}');
            });
        });

        it('ignores faulty values.', function() {
            hash = 'bla';
            localStorage.getItem.andReturn('{"lat": "test", "lng": false, "zoom": 3}');
            inject(function(mainMapService) { // jshint ignore:line
                expect($location.hash).toHaveBeenCalledWith();
                expect(localStorage.getItem).toHaveBeenCalled();
                expect(backendService.getGeoIP).toHaveBeenCalled();
            });
        });
    });

    describe('_setMapCenterFromUrl.', function() {
        // TODO: don't test private method
        it('method exists.', inject(function(mainMapService) {
            expect(typeof mainMapService._setMapCenterFromUrl).toBe('function');
        }));

        it('reads the center from the url.', inject(function(mainMapService) {
            hash = 'zoom:3,coords:1-2';
            $location.hash.reset();
            expect(mainMapService._setMapCenterFromUrl()).toBe(true, 'set the map center');
            expect(mainMapService.center).toEqual({
                lat: 1,
                lng: 2,
                zoom: 3
            });

            expect(localStorage.setItem).toHaveBeenCalledWith('veganautMapCenter', '{"lat":1,"lng":2,"zoom":3}');

            // Only retrieved the hash, didn't set it
            expect($location.hash).toHaveBeenCalledWith();
            expect($location.hash.calls.length).toBe(1);
            $location.hash.reset();

            // Order shouldn't matter
            hash = 'coords:4.1-5,zoom:6';
            expect(mainMapService._setMapCenterFromUrl()).toBe(true, 'set the map center with reverse params');
            expect(mainMapService.center).toEqual({
                lat: 4.1,
                lng: 5,
                zoom: 6
            });

            expect(localStorage.setItem).toHaveBeenCalledWith('veganautMapCenter', '{"lat":4.1,"lng":5,"zoom":6}');
            expect($location.hash).toHaveBeenCalledWith();
            expect($location.hash.calls.length).toBe(1);
        }));

        it('ignores faulty values.', inject(function(mainMapService) {
            mainMapService.center = {
                lat: 1,
                lng: 2,
                zoom: 3
            };

            hash = 'zoom:a,coords:b-c';
            expect(mainMapService._setMapCenterFromUrl()).toBe(false, 'did not set first faulty params');
            expect(mainMapService.center).toEqual({
                lat: 1,
                lng: 2,
                zoom: 3
            });
            expect(localStorage.setItem).not.toHaveBeenCalled();

            hash = 'zoom:3;coords:10';
            expect(mainMapService._setMapCenterFromUrl()).toBe(false, 'did not set second faulty params');
            expect(mainMapService.center).toEqual({
                lat: 1,
                lng: 2,
                zoom: 3
            });
            expect(localStorage.setItem).not.toHaveBeenCalled();
        }));
    });

    describe('saveCenter.', function() {
        it('method exists.', inject(function(mainMapService) {
            expect(typeof mainMapService.saveCenter).toBe('function');
        }));

        it('saves to local storage and url hash.', inject(function(mainMapService) {
            mainMapService.center = {
                lat: 7.1234567890123,
                lng: 2.123456789012,
                zoom: 15
            };

            activeFilters.type = 'gastronomy';

            mainMapService.saveCenter();
            expect(localStorage.setItem).toHaveBeenCalledWith('veganautMapCenter', '{"lat":7.1234567890123,"lng":2.123456789012,"zoom":15}');
            expect($location.hash).toHaveBeenCalledWith('zoom:15,coords:7.1234568-2.1234568,type:gastronomy');

            activeFilters.type = 'defaultTypeFilter';
            mainMapService.saveCenter();
            expect($location.hash).toHaveBeenCalledWith('zoom:15,coords:7.1234568-2.1234568');
        }));
    });
});
