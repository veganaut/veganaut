'use strict';

/* global describe, beforeEach, xit, expect, inject, jasmine */
describe('startTourDirective', function() {
    var tourServiceMock;
    beforeEach(module('veganaut.app.main'));

    // Mock the tour provider
    beforeEach(module(function($provide) {
        tourServiceMock = jasmine.createSpyObj('tourService', ['startTour']);
        $provide.value('tourService', tourServiceMock);
    }));

    // TODO: temporarily disabled all tours
    xit('should tell the tourService to start the tour', inject(function($compile, $rootScope) { // jshint ignore:line
        $compile('<span start-tour="testTour"></span>')($rootScope);

        expect(tourServiceMock.startTour).toHaveBeenCalled();
        expect(tourServiceMock.startTour.calls.length).toEqual(1);
        expect(tourServiceMock.startTour).toHaveBeenCalledWith('testTour');
    }));
});
