'use strict';

/* global describe, beforeEach, it, expect, inject */
describe('missionModels.', function() {
    var missions;
    beforeEach(function() {
        module('veganaut.app.map');

        inject(function($injector) {
            missions = $injector.get('missions');
        });
    });

    it('is defined.', function() {
        expect(typeof missions).toBe('object');
        expect(Object.keys(missions).length).toBe(9, 'correct amount of mission models defined');
    });

    describe('RateOptionsMission.', function() {
        it('is defined.', function() {
            expect(typeof missions.RateOptionsMission).toBe('function');
        });

        it('resets mission outcome when aborting mission', function() {
            var mockVisit = {
                location: {
                    lastMissionDates: {}
                }
            };
            var mission = new missions.RateOptionsMission(mockVisit);

            mission.start();
            expect(typeof mission.outcome).toBe('object', 'outcome is an object');
            expect(Object.keys(mission.outcome).length).toBe(0, 'no outcomes defined in the beginning');

            mission.outcome.testProduct = 3;
            mission.abort();
            expect(mission.started).toBe(false, 'stops mission');
            expect(Object.keys(mission.outcome).length).toBe(0, 'reset the outcome');
        });
    });
});
