'use strict';

/* global describe, beforeEach, it, inject, expect, spyOn */
describe('ActivityLinkCtrl', function() {
    var $scope;
    var backendMock;
    var successCb;

    beforeEach(module('veganaut.app.socialGraph'));

    // TODO: too much mocking is happening here
    beforeEach(inject(function($rootScope, $controller) {
        $scope = $rootScope.$new();

        backendMock = {
            canViewGraph: function() {
                return true;
            },
            getActivities: function() {
                return {
                    success: function(cb) {
                        successCb = cb;
                    }
                };
            },
            addActivityLink: function() {
                var promise = {
                    success: function() {
                        return promise;
                    },
                    error: function() {
                        return promise;
                    }
                };
                return promise;
            }
        };

        var nodeServiceMock = {
            getNodes: function() {
                return [];
            }
        };

        spyOn(backendMock, 'getActivities').andCallThrough();
        spyOn(backendMock, 'addActivityLink').andCallThrough();

        $controller('ActivityLinkCtrl', {
            $scope: $scope,
            $routeParams: {},
            backendService: backendMock,
            alertService: {},
            nodeService: nodeServiceMock
        });
    }));


    it('should initialise activities to an empty object', inject(function() {
        expect(typeof $scope.activities).toEqual('object');
        expect(Object.keys($scope.activities).length).toEqual(0);
    }));

    it('should request activities from the backend', inject(function() {
        expect(backendMock.getActivities).toHaveBeenCalled();
        expect(backendMock.getActivities.calls.length).toEqual(1);

        // Make sure it binds to success
        expect(successCb).toBeDefined();
        expect(typeof successCb).toBe('function');

        // Give a couple of activities and make sure it exposes it
        successCb([{ id: 1, name: 'a1' }, { id: 2, name: 'a2' }]);
        expect(Object.keys($scope.activities).length).toEqual(2);
    }));

    it('should submit when form is not empty', inject(function() {
        $scope.form = {
            targetName: 'test',
            selectedActivity: 'testActivity'
        };
        $scope.submit();

        expect(backendMock.addActivityLink).toHaveBeenCalledWith('test', 'testActivity');
        expect(backendMock.addActivityLink.calls.length).toEqual(1);
    }));
});
