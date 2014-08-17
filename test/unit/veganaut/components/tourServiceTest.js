'use strict';

/* global describe, beforeEach, it, expect, inject, jasmine */
describe('tourService', function() {
    var TourMock, tourInstanceMock;
    beforeEach(module('veganaut.app.main'));

    beforeEach(module(function($provide) {
        TourMock = jasmine.createSpy('Tour');
        tourInstanceMock = jasmine.createSpyObj('tour', ['init', 'start']);
        TourMock.andReturn(tourInstanceMock);

        $provide.value('Tour', TourMock);
        $provide.value('translateService', function() {});
    }));

    it('should create a Tour on instantiation', inject(function(tourService) {
        /* jshint unused: false */
        // Injecting the tourService should create the Tour(s)
        expect(TourMock.callCount).toEqual(1, 'instantiated 1 Tour');
        expect(TourMock.mostRecentCall.args[0].name).toEqual('intro', 'created tour with correct name');
    }));

    it('should have a startTour method', inject(function(tourService) {
        expect(typeof tourService.startTour).toBe('function', 'has startTour method');

        // Star the intro tour
        tourService.startTour('intro');
        expect(tourInstanceMock.init.callCount).toEqual(1, 'called init once');
        expect(tourInstanceMock.start.callCount).toEqual(1, 'called start once');
    }));
});
