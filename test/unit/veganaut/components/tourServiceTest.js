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
        $provide.value('$translate', { instant: function() {}});
    }));

    it('should create a Tour on instantiation', inject(function(tourService) {
        /* jshint unused: false */
        // Injecting the tourService should create the Tour(s)
        expect(TourMock.callCount).toEqual(3, 'instantiated 3 Tours');
    }));

    it('should have a startTour method', inject(function(tourService) {
        expect(typeof tourService.startTour).toBe('function', 'has startTour method');

        // Star the intro tour
        tourService.startTour('introBeta');
        expect(tourInstanceMock.init.callCount).toEqual(1, 'called init once');
        expect(tourInstanceMock.start.callCount).toEqual(1, 'called start once');
    }));
});
