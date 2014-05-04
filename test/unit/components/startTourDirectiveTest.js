'use strict';

/* global describe, beforeEach, it, expect, inject, jasmine */
describe('startTourDirective', function() {
    var tourServiceMock;
    beforeEach(module('monkeyFace.directives'));

    // Mock the tour provider
    beforeEach(module(function($provide) {
        tourServiceMock = jasmine.createSpyObj('tourService', ['startTour']);
        $provide.value('tourService', tourServiceMock);
    }));

    it('should tell the tourService to start the tour', inject(function($compile, $rootScope) {
        $compile('<span start-tour="testTour"></span>')($rootScope);

        expect(tourServiceMock.startTour).toHaveBeenCalled();
        expect(tourServiceMock.startTour.calls.length).toEqual(1);
        expect(tourServiceMock.startTour).toHaveBeenCalledWith('testTour');
    }));
});
