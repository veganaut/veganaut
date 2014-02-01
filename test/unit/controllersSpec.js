'use strict';

/* jasmine specs for controllers go here */
/* global describe, beforeEach, it, inject, expect */
describe('controllers', function() {
    var $scope;

    beforeEach(module('monkeyFace.controllers'));


    describe('ActivityInstanceCtrl', function() {
        beforeEach(inject(function($rootScope, $controller) {
            $scope = $rootScope.$new();
            $controller('ActivityInstanceCtrl', {$scope: $scope});
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
});
