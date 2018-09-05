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
        '$q', '$translate', '$location', 'tasks',
        'backendService', 'alertService', 'locationService'
    ];
    function LocationEditOverlayComponentController($q, $translate, $location, tasks,
        backendService, alertService, locationService)
    {
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

            // Handle AddProduct separately as we need to submit one Task for every product added
            var submitPromise;
            if ($ctrl.editTask === 'AddProduct') {
                var submitPromises = [];
                _.each(outcome, function(o) {
                    submitPromises.push(backendService
                        .submitTask($ctrl.editTask, o, $ctrl.location)
                    );
                });
                submitPromise = $q.all(submitPromises);
            }
            else {
                submitPromise = backendService
                    .submitTask($ctrl.editTask, outcome, $ctrl.location, $ctrl.product)
                ;
            }

            // Handle response from backend
            submitPromise
                .then(function(data) {
                    // Update location if required by this task
                    if ($ctrl.task.updatePropertyAfterSubmit) {
                        $ctrl.location[$ctrl.task.updatePropertyAfterSubmit] = data.outcome[$ctrl.task.mainOutcomeName];
                    }

                    // Tell the location that the current user has contributed to let it update some properties
                    $ctrl.location.notifyUserHasContributed();

                    // Show message to user
                    alertService.addAlert($translate.instant($ctrl.task.successMessage), 'success');

                    // Check if we have to reload
                    if ($ctrl.task.reloadLocationAfterSubmit) {
                        // TODO: what if this fails? The catch further down will do the wrong thing.
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

            // Check if user is logged in
            if (!backendService.isLoggedIn()) {
                // If not logged in, redirect to register
                $location.url('/register');
            }
            else if (tasks.hasOwnProperty($ctrl.editTask)) {
                // TODO NEXT: get last completed task
                $ctrl.task = new tasks[$ctrl.editTask]($ctrl.location, undefined, undefined, $ctrl.product);

                // For the veganize tasks, load related tasks to display for inspiration
                // TODO: The task should know what is needed for it and that code probably moved to the model
                if (['MentionVegan', 'GiveFeedback'].indexOf($ctrl.editTask) > -1) {
                    backendService.getRelatedVeganizeTask($ctrl.editTask, $ctrl.location.type, $ctrl.location.id)
                        .then(function(task) {
                            var translateKey = 'location.form.edit.' + $ctrl.editTask + '.completedTasks.';
                            if (task) {
                                translateKey += (task.location.id === $ctrl.location.id) ? 'thisLocation' : 'otherLocation';
                                $ctrl.completedVeganizeTaskText = $translate.instant(translateKey, {
                                    text: task.outcome.notes,
                                    person: task.person.nickname,
                                    location: task.location.name,
                                    city: task.location.address.city,
                                    year: task.createdAt.substr(0, 4)
                                });
                            }
                            else {
                                translateKey += 'fallback';
                                $ctrl.completedVeganizeTaskText = $translate.instant(translateKey);
                            }
                        })
                    ;
                }
                else if ($ctrl.editTask === 'BuyProduct') {
                    backendService.getTaskStatistics($ctrl.editTask, $ctrl.location.id)
                        .then(function(statistics) {
                            var translateKey = 'location.form.edit.' + $ctrl.editTask + '.completedTasks.';
                            if (angular.isObject(statistics) && statistics.count > 0) {
                                translateKey += 'some';
                                $ctrl.completedVeganizeTaskText = $translate.instant(translateKey, {
                                    count: statistics.count + 1 // Add one to include the current task
                                });
                            }
                            else {
                                translateKey += 'none';
                                $ctrl.completedVeganizeTaskText = $translate.instant(translateKey);
                            }
                        })
                    ;
                }
            }
            else {
                console.error('Unknown location edit property:', $ctrl.editTask);
            }
        };
    }
})();
