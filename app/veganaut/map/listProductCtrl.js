(function(module) {
  'use strict';
  module.controller('productsCtrl', ['$scope', 'locationService', '$location', 'backendService', 'leafletData', function($scope, locationService, $location, backendService, leafletData) {
    $scope.products = {};
    var bounds, coords;
    // Get a reference the the leaflet map object
    var mapPromise = leafletData.getMap();
    //get the bound of the map
    mapPromise.then(function(map) {
        bounds = map.getBounds();
        coords = bounds.toBBoxString();
    });
    //get products from the backend
    backendService.getProducts(coords, 10, 0).then(function(data) {
        $scope.products = data.data.products;
        populateLocations();
    });
    //check if a location id matches id in product and populate the locationid
    //in product with the location object
    function populateLocations () {
      locationService.getLocations().then(function(locations) {
        angular.forEach($scope.products, function(product) {
          angular.forEach(locations, function(location, key) {
            if (key === product.location) {
              product.location = location;
            }
          });
        });
      });
    }
  }]);
})(window.veganaut.mapModule);