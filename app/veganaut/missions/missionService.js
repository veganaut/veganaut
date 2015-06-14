(function(module) {
    'use strict';
    module.factory('missionService', [
        '$q', 'backendService', 'missions',
        function($q, backendService, missions) {
            /**
             * Service to handle the missions at a location
             * @constructor
             */
            var MissionService = function() {
            };

            /**
             * Takes info about a mission definition received from the backend and
             * returns an instantiated mission object.
             * @param {{}} definition
             * @param {string} type
             * @param {Location} location
             * @param {Product} [product]
             * @private
             */
            MissionService.prototype._instantiateMission = function(definition, type, location, product) {
                var lastCompletedDate;
                var lastCompletedOutcome;
                if (angular.isDefined(definition.lastCompleted)) {
                    lastCompletedDate = new Date(definition.lastCompleted.completed);
                    lastCompletedOutcome = definition.lastCompleted.outcome;
                }

                return new missions[type](
                    location,
                    definition.points,
                    lastCompletedDate,
                    lastCompletedOutcome,
                    product
                );
            };

            /**
             * Returns a promise that resolves to the list of available
             * location and product missions at the given location.
             * @param {Location} location
             * @returns {promise}
             */
            MissionService.prototype.getAvailableMissions = function(location) {
                var that = this;
                var deferred = $q.defer();
                backendService.getAvailableMissions(location.id).then(function(response) {
                    var missionData = response.data;
                    var locationMissions = [];
                    var productMissions = {};

                    // Instantiate the location missions
                    angular.forEach(missionData.locationMissions, function(definition, type) {
                        locationMissions.push(that._instantiateMission(definition, type, location));
                    });

                    // Instantiate the product missions
                    angular.forEach(missionData.productMissions, function(availableMissions, productId) {
                        productMissions[productId] = [];
                        var product = location.getProductById(productId);
                        angular.forEach(availableMissions, function(definition, type) {
                            productMissions[productId].push(that._instantiateMission(definition, type, location, product));
                        });
                    });

                    deferred.resolve({
                        locationMissions: locationMissions,
                        productMissions: productMissions
                    });
                }).catch(function(err) {
                    deferred.reject(err);
                });

                return deferred.promise;
            };

            return new MissionService();
        }
    ]);
})(window.veganaut.missionsModule);
