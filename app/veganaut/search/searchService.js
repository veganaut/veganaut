angular.module('veganaut.app.main').factory('searchService', [
    '$uibModal', 'angularPiwik',
    function($uibModal, angularPiwik) {
        'use strict';

        /**
         * Service that handles the global search. Can search for Locations,
         * geo places and others.
         * @constructor
         */
        var SearchService = function() {
            // TODO WIP: better docu
            this.geocodeResults = [];
            this.locationResults = [];
            this.searchString = '';

            this._modalInstance = undefined;
        };

        /**
         * Shows or hides the search modal depending on the current state.
         */
        SearchService.prototype.toggleSearchModal = function() {
            // Check the current state of the modal
            var wasShown = angular.isObject(this._modalInstance);

            if (wasShown) {
                // Dismiss the modal
                this._modalInstance.dismiss();
            }
            else {
                // Create the modal
                this._modalInstance = this._createModal();

                // Set instance to undefined and track when it's closed or dismissed
                this._modalInstance.result
                    .catch(function() {
                        // We only track dismissal, not normal closing here.
                        // When it's closing, a result was selected, so this will be tracked elsewhere.
                        angularPiwik.track('searchModal', 'searchModal.dismiss');
                    })
                    .finally(function() {
                        this._modalInstance = undefined;
                    }.bind(this))
                ;

                // Track showing of modal
                angularPiwik.track('searchModal', 'searchModal.open');
            }

        };

        /**
         * Creates and returns a bootstrap modal.
         * @returns {{}}
         * @private
         */
        SearchService.prototype._createModal = function() {
            return $uibModal.open({
                templateUrl: '/veganaut/search/searchModal.tpl.html',
                controller: 'vgSearchModalCtrl',
                controllerAs: 'searchModalVm',
                bindToController: true,
                backdropClass: 'modal-backdrop--search',
                windowTopClass: 'modal--search'
            });
        };

        return new SearchService();
    }
]);
