'use strict';

/* global describe, beforeEach, it, expect, inject, jasmine */
describe('startTour directive', function() {
    var tourProviderMock;
    beforeEach(module('monkeyFace.directives'));

    // Mock the tour provider
    beforeEach(module(function($provide) {
        tourProviderMock = jasmine.createSpyObj('tourProvider', ['startTour']);
        $provide.value('tourProvider', tourProviderMock);
    }));

    it('should tell the tourProvider to start the tour', inject(function($compile, $rootScope) {
        $compile('<span start-tour="testTour"></span>')($rootScope);

        expect(tourProviderMock.startTour).toHaveBeenCalled();
        expect(tourProviderMock.startTour.calls.length).toEqual(1);
        expect(tourProviderMock.startTour).toHaveBeenCalledWith('testTour');
    }));
});
