'use strict';

/* global describe, beforeEach, it, expect, inject */
describe('AreaModel.', function() {
    var Area, L;
    beforeEach(module('veganaut.app.main', 'veganaut.app.map'));

    beforeEach(inject(function(_Area_, Leaflet) {
        Area = _Area_;
        L = Leaflet;
    }));

    it('is defined.', function() {
        expect(Area).toBeDefined();
        expect(typeof Area).toBe('function');
    });

    it('empty area', function() {
        var area = new Area();

        expect(area.isValid()).toBeFalsy();
        expect(typeof area.getLat()).toBe('undefined', 'lat');
        expect(typeof area.getLng()).toBe('undefined', 'lng');
        expect(typeof area.getZoom()).toBe('undefined', 'zoom');
        expect(typeof area.getRadius()).toBe('undefined', 'radius');
        expect(typeof area.getBoundingBox()).toBe('undefined', 'bounds');
        expect(JSON.stringify(area.toJSON())).toBe('{}', 'toJSON');
    });

    it('area with zoom and name', function() {
        var area = new Area({
            lat: 12.3,
            lng: 45.6,
            zoom: 7,
            radius: 'nope',
            longName: 'this is the name'
        });

        expect(area.isValid()).toBeTruthy();
        expect(area.getLat()).toBe(12.3, 'lat');
        expect(area.getLng()).toBe(45.6, 'lng');
        expect(area.getZoom()).toBe(7, 'zoom');
        expect(typeof area.getRadius()).toBe('undefined', 'radius');
        expect(typeof area.getBoundingBox()).toBe('undefined', 'bounds');
        expect(area.longName).toBe('this is the name', 'name');
        expect(JSON.stringify(area.toJSON())).toBe('{"lat":12.3,"lng":45.6,"zoom":7}', 'toJSON');
    });

    it('area with radius', function() {
        var area = new Area({
            lat: 12.3,
            lng: 45.6,
            zoom: 'wroong',
            radius: 7890
        });

        expect(area.isValid()).toBeTruthy();
        expect(area.getLat()).toBe(12.3, 'lat');
        expect(area.getLng()).toBe(45.6, 'lng');
        expect(typeof area.getZoom()).toBe('undefined', 'zoom');
        expect(area.getRadius()).toBe(7890, 'radius');
        expect(typeof area.getBoundingBox()).toBe('undefined', 'bounds');
        expect(JSON.stringify(area.toJSON())).toBe('{"lat":12.3,"lng":45.6,"radius":7890}', 'toJSON');
    });

    it('area with lat/lng and boundingBox', function() {
        var area = new Area({
            lat: 45.321,
            lng: 7.654,
            boundingBox: [[41.68, 2.421], [48.15, 11.59]]
        });

        expect(area.isValid()).toBeTruthy();

        expect(area.getLat()).toBe(45.321, 'lat');
        expect(area.getLng()).toBe(7.654, 'lng');
        expect(typeof area.getZoom()).toBe('undefined', 'zoom');
        expect(typeof area.getRadius()).toBe('undefined', 'radius');
        expect(typeof area.getBoundingBox()).toBe('object', 'bounds');
        expect(typeof area.getBoundingBox().toBBoxString).toBe('function', 'instantiated a L.latLngBound');
        expect(area.getBoundingBox().toBBoxString()).toBe('2.421,41.68,11.59,48.15', 'correct bounds');
        expect(JSON.stringify(area.toJSON())).toBe('{"lat":45.321,"lng":7.654,"boundingBox":[[41.68,2.421],[48.15,11.59]]}', 'toJSON');
    });

    it('area with invalid lat/lng but valid boundingBox', function() {
        var area = new Area({
            lat: NaN,
            lng: 'error',
            boundingBox: [[41.66, 2.41], [48.15, 11.59]]
        });

        expect(area.isValid()).toBeTruthy();

        // Lat/lng should come from bounding box
        expect(Math.round(area.getLat())).toBe(45, 'lat');
        expect(Math.round(area.getLng())).toBe(7, 'lng');
        expect(typeof area.getZoom()).toBe('undefined', 'zoom');
        expect(typeof area.getRadius()).toBe('undefined', 'radius');
        expect(area.getBoundingBox().toBBoxString()).toBe('2.41,41.66,11.59,48.15', 'correct bounds');

        // TODO: it currently the faulty lat/lng values, should this be improved?
        expect(JSON.stringify(area.toJSON())).toBe('{"lat":null,"lng":"error","boundingBox":[[41.66,2.41],[48.15,11.59]]}', 'toJSON');
    });

    describe('getRadiusParams.', function() {
        it('returns sensible default values.', function() {
            var area = new Area();
            expect(typeof area.getRadiusParams).toBe('function');

            var params = area.getRadiusParams();
            expect(params.lat).toBe(0, 'lat');
            expect(params.lng).toBe(0, 'lng');
            expect(params.radius).toBe(30000000, 'radius');
            expect(params.includesWholeWorld).toBe(true, 'includesWholeWorld');
        });

        it('returns radius if set directly.', function() {
            var area = new Area({
                lat: 12.3,
                lng: 45.6,
                radius: 7890
            });

            var params = area.getRadiusParams();
            expect(params.lat).toBe(12.3, 'lat');
            expect(params.lng).toBe(45.6, 'lng');
            expect(params.radius).toBe(7890, 'radius');
            expect(params.includesWholeWorld).toBe(false, 'includesWholeWorld');
        });

        it('gets radius from bounds.', function() {
            // TODO: test the _getRadiusFromBounds method more
            var area = new Area({
                boundingBox: [[41.68, 2.421], [48.15, 11.59]]
            });

            var params = area.getRadiusParams();
            expect(Math.round(params.lat)).toBe(45, 'lat from bounds');
            expect(Math.round(params.lng)).toBe(7, 'lng from bounds');
            expect(Math.round(params.radius/1000)).toBe(371, 'radius from bounds');
            expect(params.includesWholeWorld).toBe(false, 'includesWholeWorld');
        });

        it('gets radius from zoom.', function() {
            var area = new Area({
                lat: 12.3,
                lng: 45.6,
                zoom: 8
            });

            var params = area.getRadiusParams();
            expect(params.lat).toBe(12.3, 'lat');
            expect(params.lng).toBe(45.6, 'lng');
            expect(params.radius).toBe(204800, 'radius calculated from zoom');
            expect(params.includesWholeWorld).toBe(false, 'includesWholeWorld');

            area = new Area({
                zoom: 16
            });
            params = area.getRadiusParams();
            expect(params.radius).toBe(800, 'radius calculated from zoom');
            expect(params.includesWholeWorld).toBe(false, 'includesWholeWorld');

            area = new Area({
                zoom: 1
            });
            params = area.getRadiusParams();
            expect(params.radius).toBe(30000000, 'zoom to big -> whole world');
            expect(params.includesWholeWorld).toBe(true, 'includesWholeWorld');
        });
    });
});
