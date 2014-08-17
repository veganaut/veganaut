'use strict';

/* global describe, beforeEach, it, expect, inject */
describe('vgAlertModule.', function() {
    var alertService, $interval;
    beforeEach(function() {
        angular.module('ui.bootstrap', []);
    });
    beforeEach(module('veganaut.alert'));


    describe('alertService.', function() {
        beforeEach(inject(function(_alertService_, _$interval_) {
            alertService = _alertService_;
            $interval = _$interval_;
        }));

        it('should be defined.', function() {
            expect(typeof alertService).toBe('object');
        });

        it('should have a getAlerts method.', function() {
            expect(typeof alertService.getAlerts).toBe('function');

            var alerts = alertService.getAlerts();
            expect(angular.isArray(alerts)).toBe(true, 'returns an array of alerts');
            expect(alerts.length).toBe(0, 'has no alerts by default');
        });

        it('should expose newly added alert.', function() {
            expect(typeof alertService.addAlert).toBe('function');
            var alerts = alertService.getAlerts();

            alertService.addAlert('Test');
            expect(alerts.length).toBe(1, 'now has an alert');
            expect(alerts[0].message).toBe('Test', 'now has an alert');
        });

        it('should be possible to remove an alert.', function() {
            expect(typeof alertService.removeAlert).toBe('function');
            var alerts = alertService.getAlerts();

            alertService.addAlert('Test1');
            alertService.addAlert('Test2');
            alertService.addAlert('Test3');

            expect(alerts.length).toBe(3, 'has alerts');
            var toRemove = alerts[1];
            alertService.removeAlert(toRemove);
            expect(alerts.length).toBe(2, 'Should have one less alert');

            expect(alerts[0].message).toBe('Test1', 'Test1 alert should still be around');
            expect(alerts[1].message).toBe('Test3', 'Test3 alert should still be around');
        });

        it('alert should have method to remove itself.', function() {
            var alerts = alertService.getAlerts();

            alertService.addAlert('Test1');

            expect(alerts.length).toBe(1, 'has alerts');
            var toRemove = alerts[0];

            expect(typeof toRemove.remove).toBe('function', 'alert should have a remove method');
            toRemove.remove();
            expect(alerts.length).toBe(0, 'Should have one less alert');
        });

        it('should be possible to remove all alerts.', function() {
            expect(typeof alertService.removeAllAlerts).toBe('function');
            var alerts = alertService.getAlerts();

            alertService.addAlert('Test1');
            alertService.addAlert('Test2');
            alertService.addAlert('Test3');

            expect(alerts.length).toBe(3);
            alertService.removeAllAlerts();
            expect(alerts.length).toBe(0, 'Should have no more alerts');
        });

        it('should remove alerts automatically after some time.', function() {
            var alerts = alertService.getAlerts();
            alertService.addAlert('Test');

            expect(alerts.length).toBe(1);
            $interval.flush(2000);
            expect(alerts.length).toBe(1, 'Should still have the alert after 2 seconds');
            $interval.flush(6000);
            expect(alerts.length).toBe(0, 'Should have no more alerts after a few more seconds');
        });

        it('should be possible to add alerts that do not remove automatically.', function() {
            var alerts = alertService.getAlerts();
            alertService.addAlert('Test', 'success', '', false);
            expect(alerts.length).toBe(1);
            // Flush a huge amount of time to make sure the alert sticks around
            // should use something like $interval.verifyNoPendingTasks();
            // but it doesn't exist
            $interval.flush(100000000);
            expect(alerts.length).toBe(1);
        });

        it('should have alert grouping capabilities.', function() {
            var alerts1 = alertService.getAlerts();
            var alerts2 = alertService.getAlerts('group2');

            expect(alerts1.length).toBe(0, 'default group should have no alerts');
            expect(alerts2.length).toBe(0, 'group2 should have no alerts');

            alertService.addAlert('Test');
            expect(alerts1.length).toBe(1, 'default group now has 1 alert');
            expect(alerts2.length).toBe(0, 'group2 should have still no alerts');

            alertService.addAlert('Another Test', 'success', 'group2');
            expect(alerts1.length).toBe(1, 'default should still have 1 alert');
            expect(alerts2.length).toBe(1, 'group2 now has 1 alert too');

            alerts1[0].remove();
            expect(alerts1.length).toBe(0, 'default group alert removed');
            expect(alerts2.length).toBe(1, 'group2 still has 1 alert');

            alerts2[0].remove();
            expect(alerts1.length).toBe(0, 'default group alert still removed');
            expect(alerts2.length).toBe(0, 'group2 alert removed too');
        });
    });

    describe('vg-alert-display directive.', function() {
        var $compile, $rootScope;

        beforeEach(inject(function(_$compile_, _$rootScope_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        }));

        it('should render list of alerts', function() {
           // TODO: write them tests
        });
    });
});
