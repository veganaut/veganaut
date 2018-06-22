(function() {
    'use strict';

    angular
        .module('veganaut.app')
        .component('vgLocationEditOverlay', locationEditOverlayComponent());

    function locationEditOverlayComponent() {
        return {
            bindings: {
                isQuestionnaire: '<vgIsQuestionnaire',
                editTask: '<vgEditTask',
                location: '=vgLocation',
                product: '=vgProduct',
                onClose: '&vgOnClose'
            },
            controller: LocationEditOverlayComponentController,
            controllerAs: '$ctrl',
            templateUrl: '/veganaut/components/editPane/locationEditOverlay/locationEditOverlayComponent.html'
        };
    }

    // TODO: rename this component to something with "Task"?
    LocationEditOverlayComponentController.$inject = [
        '$translate', 'tasks', 'backendService', 'alertService', 'locationService'
    ];
    function LocationEditOverlayComponentController($translate, tasks, backendService, alertService, locationService) {
        var $ctrl = this;

        $ctrl.getDescription = function() {
            var key = 'location.form.edit.' + $ctrl.editTask + '.description';
            var desc = $translate.instant(key);
            if (key !== desc && desc.length > 0) {
                return desc;
            }
            return undefined;
        };

        $ctrl.save = function() {
            $ctrl.isSaving = true;

            // Prepare the outcome
            var outcome = $ctrl.task.getOutcome();

            backendService
                .submitTask($ctrl.editTask, outcome, $ctrl.location, $ctrl.product)
                .then(function(data) {
                    // Update location if required by this task
                    if ($ctrl.task.updatePropertyAfterSubmit) {
                        $ctrl.location[$ctrl.task.updatePropertyAfterSubmit] = data.outcome[$ctrl.task.mainOutcomeName];
                    }

                    // Show message to user
                    alertService.addAlert($translate.instant($ctrl.task.successMessage), 'success');

                    // Check if we have to reload
                    if ($ctrl.task.reloadLocationAfterSubmit) {
                        // TODO WIP: what if this fails? The catch further down will do the wrong thing.
                        // Reload the location
                        return locationService.loadFullLocation($ctrl.location);
                    }
                })
                .then(function() {
                    $ctrl.onClose();
                })
                .catch(function(data) {
                    alertService.addAlert($translate.instant('message.locationTask.error') + data.error, 'danger');
                })
                .finally(function() {
                    $ctrl.isSaving = false;
                })
            ;
        };

        $ctrl.$onInit = function() {
            $ctrl.isSaving = false;

            if (tasks.hasOwnProperty($ctrl.editTask)) {
                // TODO WIP: get last completed task
                $ctrl.task = new tasks[$ctrl.editTask]($ctrl.location, undefined, undefined, $ctrl.product);
            }
            else {
                console.error('Unknown location edit property:', $ctrl.editTask);
            }
        };
    }
})();
