'use strict';

/* jasmine specs for controllers go here */
/* global describe, beforeEach, it, inject, expect */
describe('controllers', function() {
    var $scope;

    beforeEach(module('monkeyFace.controllers'));

    describe('ActivityLinkCtrl', function() {
        beforeEach(inject(function($rootScope, $controller) {
            $scope = $rootScope.$new();
            $controller('ActivityLinkCtrl', {$scope: $scope, activityLinkTargetProvider: {
                get: function() {
                    return {
                        type: 'dummy'
                    };
                },
                set: function() {

                }
            }});
        }));


        it('should have activities', inject(function() {
            expect(typeof $scope.activities).toEqual('object');
            expect($scope.activities.length).toEqual(2);
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
        var backend;
        var successCb;
        var loginEmail;
        var loginPassword;
        beforeEach(inject(function($rootScope, $controller) {
            $scope = $rootScope.$new();
            backend = {
                login: function(email, password) {
                    loginEmail = email;
                    loginPassword = password;

                    var req = {
                        success: function(cb) {
                            successCb = cb;
                            return req;
                        },
                        error: function() {
                            return req;
                        }
                    };

                    return req;
                }
            };
            $controller('LoginCtrl', {$scope: $scope, backend: backend});
        }));

        it('should have a submit method that logs in', inject(function($httpBackend) {
            expect(typeof $scope.submit).toEqual('function');

            // Dummy login function that should be called
            var loggedIn = false;
            $scope.login = function() {
                loggedIn = true;
            };

            // Enter data in the form
            $scope.form = {
                email: 'test@example.com',
                password: '1234'
            };

            // Submit the form
            $scope.submit();
            expect(loginEmail).toBe('test@example.com');
            expect(loginPassword).toBe('1234');

            // Return from backend
            successCb({
                'sessionId': 'some-session-id'
            });

            // Check that we are logged in
            expect(loggedIn).toBe(true);
        }));
    });
});
