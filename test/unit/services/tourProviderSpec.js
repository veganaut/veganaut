'use strict';

/* global describe, beforeEach, it, expect, inject, jasmine */
describe('tourProvider service', function() {
    var TourMock, tourInstanceMock;
    beforeEach(module('monkeyFace.services'));

    beforeEach(module(function($provide) {
        TourMock = jasmine.createSpy('Tour');
        tourInstanceMock = jasmine.createSpyObj('tour', ['init', 'start']);
        TourMock.andReturn(tourInstanceMock);

        $provide.value('Tour', TourMock);
    }));

    it('should create a Tour on instantiation', inject(function(tourProvider) {
        /* jshint unused: false */
        // Injecting the tourProvider should create the Tour(s)
        expect(TourMock.callCount).toEqual(1, 'instantiated 1 Tour');
        expect(TourMock.mostRecentCall.args[0].name).toEqual('intro', 'created tour with correct name');
    }));

    it('should have a startTour method', inject(function(tourProvider) {
        expect(typeof tourProvider.startTour).toBe('function', 'has startTour method');

        // Star the intro tour
        tourProvider.startTour('intro');
        expect(tourInstanceMock.init.callCount).toEqual(1, 'called init once');
        expect(tourInstanceMock.start.callCount).toEqual(1, 'called start once');
    }));
});
