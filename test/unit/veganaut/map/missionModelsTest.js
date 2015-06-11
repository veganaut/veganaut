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
        expect(Object.keys(missions).length).toBe(11, 'correct amount of mission models defined');
    });

    describe('RateProductMission.', function() {
        it('is defined.', function() {
            expect(typeof missions.rateProduct).toBe('function');
        });

        it('resets mission outcome when aborting mission', function() {
            var mockVisit = {
                location: {
                    lastMissionDates: {}
                }
            };
            var mission = new missions.rateProduct(mockVisit);

            mission.start();
            expect(typeof mission.outcome).toBe('undefined', 'default outcome is undefined');

            mission.outcome = 3;
            mission.abort();
            expect(mission.started).toBe(false, 'stops mission');
            expect(typeof mission.outcome).toBe('undefined', 'reset the outcome');
        });
    });
});
