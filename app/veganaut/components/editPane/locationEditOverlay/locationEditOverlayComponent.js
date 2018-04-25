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
                onClose: '&vgOnClose'
            },
            controller: LocationEditOverlayComponentController,
            controllerAs: '$ctrl',
            templateUrl: '/veganaut/components/editPane/locationEditOverlay/locationEditOverlayComponent.html'
        };
    }

    /**
     * Properties of the different tasks to determine the behaviour of
     * the overlay.
     * TODO: Move this elsewhere?
     *
     * Every task has the following properties:
     * - outcomeName:
     *      the name of the outcome property that has to be used
     * - reloadLocationAfterSubmit:
     *      Whether to reload the whole location after submitting successfully
     * - successMessage:
     *      Which success message to show
     * @type {{}}
     */
    var TASK_CONFIGURATION = {
        SetLocationName: {
            outcomeName: 'name',
            reloadLocationAfterSubmit: false,
            successMessage: 'message.locationTaskEdit.success'
        },
        SetLocationType: {
            outcomeName: 'locationType',
            reloadLocationAfterSubmit: false,
            successMessage: 'message.locationTaskEdit.success'
        },
        SetLocationDescription: {
            outcomeName: 'description',
            reloadLocationAfterSubmit: false,
            successMessage: 'message.locationTaskEdit.success'
        },
        SetLocationWebsite: {
            outcomeName: 'website',
            reloadLocationAfterSubmit: false,
            successMessage: 'message.locationTaskEdit.success'
        },
        RateLocationQuality: {
            outcomeName: 'quality',
            reloadLocationAfterSubmit: true,
            successMessage: 'message.locationTaskOpinion.success'
        }
    };

    LocationEditOverlayComponentController.$inject = [
        '$translate', 'backendService', 'alertService','locationService'
    ];
    function LocationEditOverlayComponentController($translate, backendService, alertService, locationService) {
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
            // TODO WIP: refactor this?
            var outcome = {};
            outcome[TASK_CONFIGURATION[$ctrl.editTask].outcomeName] = $ctrl.inputModel;
            switch ($ctrl.editTask) {
            case 'SetLocationWebsite':
                // TODO: let the backend sanitise
                outcome[TASK_CONFIGURATION[$ctrl.editTask].outcomeName] =
                    $ctrl.location.sanitiseUrl(outcome[TASK_CONFIGURATION[$ctrl.editTask].outcomeName]);
                outcome.isAvailable = $ctrl.inputModel.length > 0;
                break;
            default:
                break;
            }

            backendService
                .submitLocationTask($ctrl.editTask, $ctrl.location, outcome)
                .then(function(data) {
                    switch ($ctrl.editTask) {
                    case 'SetLocationName':
                        $ctrl.location.name = data.outcome[TASK_CONFIGURATION[$ctrl.editTask].outcomeName];
                        break;
                    case 'SetLocationType':
                        $ctrl.location.type = data.outcome[TASK_CONFIGURATION[$ctrl.editTask].outcomeName];
                        break;
                    case 'SetLocationDescription':
                        $ctrl.location.description = data.outcome[TASK_CONFIGURATION[$ctrl.editTask].outcomeName];
                        break;
                    case 'SetLocationWebsite':
                        $ctrl.location.website = data.outcome[TASK_CONFIGURATION[$ctrl.editTask].outcomeName];
                        break;
                    case 'RateLocationQuality':
                        // Not doing anything, will reload location
                        break;
                    }

                    // Show message to user
                    alertService.addAlert($translate.instant(TASK_CONFIGURATION[$ctrl.editTask].successMessage), 'success');

                    // Check if we have to reload
                    if (TASK_CONFIGURATION[$ctrl.editTask].reloadLocationAfterSubmit) {
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

            switch ($ctrl.editTask) { // TODO WIP: if editTask changes, have to re-initialise!
            case 'SetLocationName':
                $ctrl.inputModel = $ctrl.location.name;
                break;
            case 'SetLocationType':
                $ctrl.inputModel = $ctrl.location.type;
                break;
            case 'SetLocationDescription':
                $ctrl.inputModel = $ctrl.location.description;
                break;
            case 'SetLocationWebsite':
                $ctrl.inputModel = $ctrl.location.website;
                break;
            case 'RateLocationQuality':
                $ctrl.inputModel = undefined; // TODO WIP: get latest rating of user?
                break;
            default:
                console.error('Unknown location edit property:', $ctrl.editTask);
                break;
            }
        };
    }
})();
