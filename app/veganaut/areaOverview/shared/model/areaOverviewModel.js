(function() {
    'use strict';
    angular.module('veganaut.app.main').factory('areaOverview',

        function AreaOverview() {
            this.areaOverview = this;
            this.location = [
                this.name = "Bern",
                this.area = "Stadtteil II, Bern, Schweiz",
                this.totalLocations = 1233,
                this.radius = 5.8
            ],
            this.ratings = [
                this.one = 1,
                this.two = 2,
                this.three = 3,
                this.four = 4,
                this.five = 5
            ];
            this.restaurants = [
                this.amount = 5,
                this.meals = 33
            ];
            this.stores = [
                this.amount = 5,
                this.products = 33
            ];
            return this.areaOverview;
        }
    )
})(window.veganaut.mainModule);
