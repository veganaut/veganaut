'use strict';

/* global describe, beforeEach, it, expect, inject, jasmine */
describe('areaService.', function() {
    var areaService, backendService, localeService;
    var $rootScope, localStorage, getGeoIPDeferred;
    beforeEach(module('veganaut.app.main', 'veganaut.app.map'));

    beforeEach(module(function($provide) {
        // Set up all the mock dependencies
        localeService = {
            getLocale: jasmine.createSpy('localeService.getLocale').andReturn('de')
        };
        backendService = {
            getGeoIP: jasmine.createSpy('backendService.getGeoIP')
        };
        localStorage = {
            getItem: jasmine.createSpy('getItem'),
            setItem: jasmine.createSpy('setItem')
        };

        $provide.value('$window', {
            localStorage: localStorage
        });
        $provide.value('localeService', localeService);
        $provide.value('backendService', backendService);
    }));

    beforeEach(inject(function($q, _$rootScope_) {
        getGeoIPDeferred = $q.defer();
        backendService.getGeoIP.andReturn(getGeoIPDeferred.promise);
        $rootScope = _$rootScope_;
    }));

    describe('constructor.', function() {
        it('service exists.', inject(function(areaService) {
            expect(typeof areaService).toBe('object');
        }));

        it('initialises first from local storage.', function() {
            localStorage.getItem.andReturn('{"lat":10.5, "lng": 20.1, "zoom": 3}');

            inject(function(areaService) {
                expect(localStorage.getItem).toHaveBeenCalledWith('veganautArea');
                expect(backendService.getGeoIP).not.toHaveBeenCalled();

                var resolved = false;
                areaService.getCurrentArea().then(function(area) {
                    resolved = true;
                    expect(area.getLat()).toBe(10.5, 'correct lat');
                    expect(area.getLng()).toBe(20.1, 'correct lng');
                    expect(area.getZoom()).toBe(3, 'correct zoom');
                });
                $rootScope.$apply();
                expect(resolved).toBeTruthy('returned area');

                expect(localStorage.setItem).toHaveBeenCalledWith('veganautArea', '{"lat":10.5,"lng":20.1,"zoom":3}');
            });
        });

        it('initialises second from backend.', inject(function(areaService) {
            expect(localStorage.getItem).toHaveBeenCalledWith('veganautArea');
            expect(backendService.getGeoIP).toHaveBeenCalledWith('de');

            // Prepare what the are should eventually be set to
            var resolved = false;
            areaService.getCurrentArea().then(function(area) {
                resolved = true;
                expect(area.getLat()).toBe(0.8, 'correct lat');
                expect(area.getLng()).toBe(0.12, 'correct lng');
                expect(area.getBoundingBox().toBBoxString()).toBe('-78,-42.6,70.9,68.31', 'correct bounds');
                expect(typeof area.getZoom()).toBe('undefined', 'no zoom');
                expect(area.name).toBe('Landy', 'correct name');
            });
            $rootScope.$apply();
            expect(resolved).toBeFalsy('does not return area yet');

            getGeoIPDeferred.resolve({
                data: {
                    lat: 0.8,
                    lng: 0.12,
                    boundingBox: [[-42.6, -78.0], [68.31, 70.9]],
                    countryName: 'Landy'
                }
            });
            $rootScope.$apply();
            expect(resolved).toBeTruthy('resolved with area');

            expect(localStorage.setItem).toHaveBeenCalledWith(
                'veganautArea',
                '{"lat":0.8,"lng":0.12,"boundingBox":[[-42.6,-78],[68.31,70.9]]}'
            );
        }));

        it('ignores faulty values.', function() {
            // Return faulty local storage values
            localStorage.getItem.andReturn('{"lng": "test", "zoom": "asdf"}');

            inject(function(areaService) {
                expect(localStorage.getItem).toHaveBeenCalledWith('veganautArea');
                expect(backendService.getGeoIP).toHaveBeenCalled();

                var resolved = false;
                areaService.getCurrentArea().then(function(area) {
                    // Resolved with default values
                    resolved = true;
                    expect(area.getLat()).toBe(0, 'correct lat');
                    expect(area.getLng()).toBe(0, 'correct lng');
                    expect(area.getZoom()).toBe(2, 'correct zoom');
                    expect(area.getRadius()).toBe(30000000, 'correct radius');
                });

                // Return faulty backend values
                getGeoIPDeferred.resolve({
                    data: {}
                });
                $rootScope.$apply();
                expect(resolved).toBeTruthy('returned area');

                expect(localStorage.setItem).not.toHaveBeenCalled();
            });
        });
    });

    describe('methods.', function() {
        beforeEach(inject(function(_areaService_) {
            areaService = _areaService_;
        }));

        describe('getCurrentArea.', function() {
            it('method exists', function() {
                expect(typeof areaService.getCurrentArea).toBe('function');
            });
        });

        describe('setArea.', function() {
            it('method exists', function() {
                expect(typeof areaService.setArea).toBe('function');
            });
        });
    });
});
