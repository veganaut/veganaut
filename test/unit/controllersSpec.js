'use strict';

/* jasmine specs for controllers go here */
/* global describe, beforeEach, it, inject, expect, spyOn */
describe('controllers', function() {
    var $scope;

    beforeEach(module('monkeyFace.controllers'));

    describe('ActivityLinkCtrl', function() {
        var backendMock;
        var successCb;

        // TODO: too much mocking is happening here
        beforeEach(inject(function($rootScope, $controller) {
            $scope = $rootScope.$new();

            var activityLinkTargetMock = {
                get: function() {
                    return {
                        type: 'dummy'
                    };
                },
                set: function() {

                }
            };

            backendMock = {
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

            spyOn(backendMock, 'getActivities').andCallThrough();

            $controller('ActivityLinkCtrl', {
                $scope: $scope,
                activityLinkTargetProvider: activityLinkTargetMock,
                backend: backendMock,
                alertProvider: {}
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

        it('should have not submit when form empty', inject(function() {
            expect($scope.formSubmitted).toBe(false);

            $scope.submit();
            expect($scope.formSubmitted).toBe(false);

            $scope.form = {
                name: ''
            };
            $scope.submit();
            expect($scope.formSubmitted).toBe(false);
        }));

        it('should submit when form is not empty', inject(function() {
            $scope.form = {
                name: 'test'
            };
            $scope.submit();
            expect($scope.formSubmitted).toBe(true);
        }));
    });


    describe('LoginCtrl', function() {
        var backendMock;

        beforeEach(inject(function($rootScope, $controller) {
            $scope = $rootScope.$new();
            backendMock = {
                login: function() {
                    var req = {
                        success: function() {
                            return req;
                        },
                        error: function() {
                            return req;
                        }
                    };

                    return req;
                },
                isLoggedIn: function() {
                    return false;
                }
            };

            spyOn(backendMock, 'login').andCallThrough();

            $controller('LoginCtrl', {$scope: $scope, backend: backendMock, alertProvider: {}});
        }));

        it('should have a submit method that logs in', inject(function() {
            expect(typeof $scope.submit).toEqual('function');

            // Enter data in the form
            $scope.form = {
                email: 'test@example.com',
                password: '1234'
            };

            // Submit the form
            $scope.submit();
            expect(backendMock.login).toHaveBeenCalled();
            expect(backendMock.login.calls.length).toEqual(1);
            expect(backendMock.login).toHaveBeenCalledWith('test@example.com', '1234');
        }));
    });
});
