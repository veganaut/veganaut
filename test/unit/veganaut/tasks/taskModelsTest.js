'use strict';

/* global describe, beforeEach, it, expect, inject */
describe('taskModels.', function() {
    var tasks;
    beforeEach(function() {
        module('veganaut.app.tasks');

        inject(function($injector) {
            tasks = $injector.get('tasks');
        });
    });

    it('is defined.', function() {
        expect(typeof tasks).toBe('object');
        expect(Object.keys(tasks).length).toBe(12, 'correct amount of task models defined');
    });

    describe('RateProduct.', function() {
        it('is defined.', function() {
            expect(typeof tasks.RateProduct).toBe('function');
        });

        it('resets task outcome when aborting task', function() {
            var task = new tasks.RateProduct();

            task.start();
            expect(typeof task.outcome).toBe('undefined', 'default outcome is undefined');

            task.outcome = 3;
            task.abort();
            expect(task.started).toBe(false, 'stops task');
            expect(typeof task.outcome).toBe('undefined', 'reset the outcome');
        });
    });
});
