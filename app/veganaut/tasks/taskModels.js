(function(module) {
    'use strict';

    /**
     * Generic Task Model
     *
     * @param {string} type
     * @param {boolean} reloadLocationAfterSubmit Whether to reload the
     *      whole location after submitting this Task
     * @param {string} successMessage Translation key for the message to
     *      show when the Task was submitted successfully
     * @param {string} mainOutcomeName name of the main outcome property
     * @param {string} updatePropertyAfterSubmit Property of the location
     *      to update from the main outcome when the Task was successfully
     *      submitted. Undefined for no update.
     * @param {{}|[]} inputModel Model used for the input form for this task
     * @param {Location} location Where this task is done
     * @param {Date} [lastCompletedDate] When (if ever) the user last
     *      completed this task
     * @param {{}|[]} [lastCompletedOutcome] outcome of the last time
     *      the user did this task (if ever)
     * @param {Product} [product] The product this task is about
     *      (if it's a product task)
     * @constructor
     */
    function Task(type, reloadLocationAfterSubmit, successMessage, mainOutcomeName, updatePropertyAfterSubmit,
        inputModel, location, lastCompletedDate, lastCompletedOutcome, product)
    {
        this.type = type;
        this.reloadLocationAfterSubmit = reloadLocationAfterSubmit;
        this.successMessage = successMessage;
        this.mainOutcomeName = mainOutcomeName;
        this.updatePropertyAfterSubmit = updatePropertyAfterSubmit;
        this.location = location;
        this.inputModel = inputModel;
        this.lastCompletedDate = lastCompletedDate;
        this.lastCompletedOutcome = lastCompletedOutcome;
        this.product = product;
        this.completed = false;
        this._finalOutcome = undefined;

        // Store a deep copy of the initial input to be able to reset
        this._initialInput = angular.copy(inputModel);
    }

    /**
     * Checks whether this task has a valid outcome.
     * @returns {boolean}
     */
    Task.prototype.hasValidOutcome = function() {
        return (typeof this.getOutcome()[this.mainOutcomeName] !== 'undefined');
    };

    /**
     * Aborts the task and resets the outcome.
     * Once the task is completed, it won't change anything anymore
     * TODO WIP: delete this?
     */
    Task.prototype.abort = function() {
        if (!this.completed) {
            // Reset the input
            this.inputModel = this._initialInput;
        }
    };

    /**
     * Returns the outcome of this task. To be overwritten
     * by child classes.
     * @returns {{}}
     */
    Task.prototype.getOutcome = function() {
        if (this.completed) {
            return this._finalOutcome;
        }
        var outcome = {};
        outcome[this.mainOutcomeName] = this.inputModel;
        return outcome;
    };

    /**
     * Concludes this task. Should only be called once there is a valid outcome.
     * TODO WIP: this is not used?
     */
    Task.prototype.finish = function() {
        if (!this.completed) {
            this._finalOutcome = this.getOutcome();
            this.completed = true;
        }
    };

    // HasOptionsMission //////////////////////////////////////////////////////
    function HasOptionsMission(location, lastCompletedDate, lastCompletedOutcome) {
        Task.call(this, 'hasOptions', {}, location, lastCompletedDate, lastCompletedOutcome);
        this.firstAnswers = ['yes', 'no', 'theyDoNotKnow'];
        this.secondAnswers = ['ratherYes', 'ratherNo', 'noClue'];
    }

    HasOptionsMission.prototype = Object.create(Task.prototype);
    HasOptionsMission.prototype.constructor = HasOptionsMission;

    HasOptionsMission.prototype.getOutcome = function() {
        if (this.completed) {
            return this._finalOutcome;
        }
        var outcome;
        if (this.inputModel.first === 'theyDoNotKnow') {
            outcome = this.inputModel.second;
        }
        else {
            outcome = this.inputModel.first;
        }
        return outcome;
    };

    // MentionVegan ///////////////////////////////////////////////////////////
    function MentionVeganTask(location, lastCompletedDate, lastCompletedOutcome) {
        Task.call(this, 'MentionVegan', false, 'message.locationTaskRelation.success', undefined, undefined,
            {}, location, lastCompletedDate, lastCompletedOutcome)
        ;

        this.possibleAnswers = ['yes', 'maybe'];
    }

    MentionVeganTask.prototype = Object.create(Task.prototype);
    MentionVeganTask.prototype.constructor = MentionVeganTask;

    MentionVeganTask.prototype.hasValidOutcome = function() {
        return angular.isDefined(this.getOutcome());
    };

    MentionVeganTask.prototype.getOutcome = function() {
        // TODO: de-duplicate with other veganize missions
        if (this.completed) {
            return this._finalOutcome;
        }

        var outcome;
        if (angular.isObject(this.inputModel) && angular.isString(this.inputModel.commitment)) {
            outcome = {
                commitment: this.inputModel.commitment
            };

            if (this.inputModel.notes) {
                outcome.notes = this.inputModel.notes;
            }
        }

        return outcome;
    };

    // AddProduct /////////////////////////////////////////////////////
    function AddProductTask(location, lastCompletedDate, lastCompletedOutcome) {
        Task.call(this, 'AddProduct', true, 'message.locationTaskEdit.success', 'name', undefined,
            [], location, lastCompletedDate, lastCompletedOutcome)
        ;
    }

    AddProductTask.prototype = Object.create(Task.prototype);
    AddProductTask.prototype.constructor = AddProductTask;

    AddProductTask.prototype.hasValidOutcome = function() {
        return (this.getOutcome().length > 0);
    };

    AddProductTask.prototype.getOutcome = function() {
        if (this.completed) {
            return this._finalOutcome;
        }

        // Note: the backend actually expects one Task per product, so the outcome here
        // looks a bit different. The conversion is done in the locationEditOverlayComponent.
        var outcome = [];
        _.each(this.inputModel, function(o) {
            outcome.push({
                productAdded: true,
                name: o
            });
        });
        return outcome;
    };

    // BuyProduct /////////////////////////////////////////////////////////////
    function BuyProductTask(location, lastCompletedDate, lastCompletedOutcome) {
        Task.call(this, 'BuyProduct', false, 'message.locationTaskRelation.success', undefined, undefined,
            {}, location, lastCompletedDate, lastCompletedOutcome)
        ;

        this.possibleAnswers = ['yes'];
    }

    BuyProductTask.prototype = Object.create(Task.prototype);
    BuyProductTask.prototype.constructor = BuyProductTask;

    BuyProductTask.prototype.hasValidOutcome = function() {
        return angular.isDefined(this.getOutcome());
    };

    BuyProductTask.prototype.getOutcome = function() {
        // TODO: de-duplicate with other veganize missions
        if (this.completed) {
            return this._finalOutcome;
        }

        var outcome;
        if (angular.isObject(this.inputModel) && angular.isString(this.inputModel.commitment)) {
            outcome = {
                commitment: this.inputModel.commitment
            };

            if (this.inputModel.notes) {
                outcome.notes = this.inputModel.notes;
            }
        }

        return outcome;
    };

    // GiveFeedback ///////////////////////////////////////////////////////////
    function GiveFeedbackTask(location, lastCompletedDate, lastCompletedOutcome) {
        Task.call(this, 'GiveFeedback', false, 'message.locationTaskRelation.success', undefined, undefined,
            {}, location, lastCompletedDate, lastCompletedOutcome)
        ;

        this.possibleAnswers = ['yes', 'maybe'];
    }

    GiveFeedbackTask.prototype = Object.create(Task.prototype);
    GiveFeedbackTask.prototype.constructor = GiveFeedbackTask;

    GiveFeedbackTask.prototype.hasValidOutcome = function() {
        return angular.isDefined(this.getOutcome());
    };

    GiveFeedbackTask.prototype.getOutcome = function() {
        // TODO: de-duplicate with other veganize missions
        if (this.completed) {
            return this._finalOutcome;
        }

        var outcome;
        if (angular.isObject(this.inputModel) && angular.isString(this.inputModel.commitment)) {
            outcome = {
                commitment: this.inputModel.commitment
            };

            if (this.inputModel.notes) {
                outcome.notes = this.inputModel.notes;
            }
        }

        return outcome;
    };

    // HowWellDoYouKnowThisLocation ///////////////////////////////////////////
    function HowWellDoYouKnowThisLocationTask(location, lastCompletedDate, lastCompletedOutcome) {
        Task.call(this, 'HowWellDoYouKnowThisLocation', false, 'message.locationTaskRelation.success', 'knowLocation', undefined,
            undefined, location, lastCompletedDate, lastCompletedOutcome)
        ;

        this.possibleAnswers = ['regular', 'fewTimes', 'once', 'never'];
    }

    HowWellDoYouKnowThisLocationTask.prototype = Object.create(Task.prototype);
    HowWellDoYouKnowThisLocationTask.prototype.constructor = HowWellDoYouKnowThisLocationTask;

    // RateProduct ////////////////////////////////////////////////////////////
    function RateProductTask(location, lastCompletedDate, lastCompletedOutcome, product) {
        var initialInput;
        if (angular.isObject(lastCompletedOutcome)) {
            initialInput = lastCompletedOutcome.rating;
        }

        Task.call(this, 'RateProduct', true, 'message.locationTaskOpinion.success', 'rating', undefined,
            initialInput, location, lastCompletedDate, lastCompletedOutcome, product)
        ;

        this.maxRating = 5;
    }

    RateProductTask.prototype = Object.create(Task.prototype);
    RateProductTask.prototype.constructor = RateProductTask;

    RateProductTask.prototype.hasValidOutcome = function() {
        var outcome = this.getOutcome();

        // Check if the outcome is the same as the last one.
        // If yes, the outcome is not valid yet
        if (angular.isObject(this.lastCompletedOutcome) &&
            angular.isObject(outcome) &&
            this.lastCompletedOutcome[this.mainOutcomeName] === outcome[this.mainOutcomeName])
        {
            outcome = {};
        }

        return angular.isDefined(outcome[this.mainOutcomeName]);
    };

    RateProductTask.prototype.getOutcome = function() {
        if (this.completed) {
            return this._finalOutcome;
        }

        var outcome = {};
        if (angular.isNumber(this.inputModel) &&
            this.inputModel > 0 &&
            this.inputModel <= this.maxRating)
        {
            outcome[this.mainOutcomeName] = this.inputModel;
        }

        return outcome;
    };

    // SetLocationCoordinates /////////////////////////////////////////////////
    function SetLocationCoordinatesTask(location, lastCompletedDate, lastCompletedOutcome) {
        Task.call(this, 'SetLocationCoordinates', true, 'message.locationTaskEdit.success', undefined, undefined,
            {}, location, lastCompletedDate, lastCompletedOutcome)
        ;
    }

    SetLocationCoordinatesTask.prototype = Object.create(Task.prototype);
    SetLocationCoordinatesTask.prototype.constructor = SetLocationCoordinatesTask;

    SetLocationCoordinatesTask.prototype.hasValidOutcome = function() {
        return angular.isDefined(this.getOutcome());
    };

    SetLocationCoordinatesTask.prototype.getOutcome = function() {
        if (this.completed) {
            return this._finalOutcome;
        }

        var outcome;
        if (angular.isObject(this.inputModel) &&
            angular.isNumber(this.inputModel.latitude) &&
            angular.isNumber(this.inputModel.longitude))
        {
            outcome = {
                latitude: this.inputModel.latitude,
                longitude: this.inputModel.longitude
            };
        }

        return outcome;
    };

    // SetLocationExistence ///////////////////////////////////////////////////
    function SetLocationExistenceTask(location, lastCompletedDate, lastCompletedOutcome) {
        Task.call(this, 'SetLocationExistence', false, 'message.locationTaskEdit.success', 'existence', 'existence',
            location.getExistence(), location, lastCompletedDate, lastCompletedOutcome)
        ;

        this.possibleAnswers = ['existing', 'closedDown', 'wronglyEntered'];
    }

    SetLocationExistenceTask.prototype = Object.create(Task.prototype);
    SetLocationExistenceTask.prototype.constructor = SetLocationExistenceTask;

    // SetLocationName //////////////////////////////////////////////////////
    function SetLocationNameTask(location, lastCompletedDate, lastCompletedOutcome) {
        Task.call(this, 'SetLocationName', false, 'message.locationTaskEdit.success', 'name', 'name',
            location.name, location, lastCompletedDate, lastCompletedOutcome)
        ;
    }

    SetLocationNameTask.prototype = Object.create(Task.prototype);
    SetLocationNameTask.prototype.constructor = SetLocationNameTask;

    // SetLocationType //////////////////////////////////////////////////////
    function SetLocationTypeTask(location, lastCompletedDate, lastCompletedOutcome) {
        Task.call(this, 'SetLocationType', false, 'message.locationTaskEdit.success', 'locationType', 'type',
            location.type, location, lastCompletedDate, lastCompletedOutcome)
        ;
    }

    SetLocationTypeTask.prototype = Object.create(Task.prototype);
    SetLocationTypeTask.prototype.constructor = SetLocationTypeTask;

    // SetLocationDescription //////////////////////////////////////////////////////
    function SetLocationDescriptionTask(location, lastCompletedDate, lastCompletedOutcome) {
        Task.call(this, 'SetLocationDescription', false, 'message.locationTaskEdit.success', 'description', 'description',
            location.description, location, lastCompletedDate, lastCompletedOutcome)
        ;
    }

    SetLocationDescriptionTask.prototype = Object.create(Task.prototype);
    SetLocationDescriptionTask.prototype.constructor = SetLocationDescriptionTask;

    // SetLocationWebsiteTask //////////////////////////////////////////////////////
    function SetLocationWebsiteTask(location, lastCompletedDate, lastCompletedOutcome) {
        Task.call(this, 'SetLocationWebsite', false, 'message.locationTaskEdit.success', 'website', 'website',
            location.website, location, lastCompletedDate, lastCompletedOutcome)
        ;
    }

    SetLocationWebsiteTask.prototype = Object.create(Task.prototype);
    SetLocationWebsiteTask.prototype.constructor = SetLocationWebsiteTask;

    SetLocationWebsiteTask.prototype.getOutcome = function() {
        if (this.completed) {
            return this._finalOutcome;
        }
        var outcome = {};
        // TODO: let the backend sanitise
        outcome[this.mainOutcomeName] =
            this.location.sanitiseUrl(this.inputModel);
        outcome.isAvailable = this.inputModel.length > 0;
        return outcome;
    };

    // SetLocationProductListComplete /////////////////////////////////////////
    function SetLocationProductListCompleteTask(location, lastCompletedDate, lastCompletedOutcome) {
        Task.call(this, 'SetLocationProductListComplete', false, 'message.locationTaskEdit.success', 'completionState', 'productListComplete',
            location.productListComplete, location, lastCompletedDate, lastCompletedOutcome)
        ;

        this.possibleAnswers = ['complete', 'incompleteGoodSummary', 'incomplete'];
    }

    SetLocationProductListCompleteTask.prototype = Object.create(Task.prototype);
    SetLocationProductListCompleteTask.prototype.constructor = SetLocationProductListCompleteTask;

    // SetProductNameTask /////////////////////////////////////////////////////
    function SetProductNameTask(location, lastCompletedDate, lastCompletedOutcome, product) {
        // TODO: don't reload the whole location? (although: careful with sorting of products)
        Task.call(this, 'SetProductName', true, 'message.locationTaskEdit.success', 'name', undefined,
            product.name, location, lastCompletedDate, lastCompletedOutcome, product)
        ;
    }

    SetProductNameTask.prototype = Object.create(Task.prototype);
    SetProductNameTask.prototype.constructor = SetProductNameTask;

    // SetProductAvailabilityTask /////////////////////////////////////////////
    function SetProductAvailabilityTask(location, lastCompletedDate, lastCompletedOutcome, product) {
        // TODO: don't reload the whole location? (although: careful with sorting of products)
        Task.call(this, 'SetProductAvailability', true, 'message.locationTaskEdit.success', 'availability', undefined,
            product.availability, location, lastCompletedDate, lastCompletedOutcome, product)
        ;

        this.possibleAnswers = ['always', 'sometimes', 'not'];
    }

    SetProductAvailabilityTask.prototype = Object.create(Task.prototype);
    SetProductAvailabilityTask.prototype.constructor = SetProductAvailabilityTask;

    // RateLocationQualityTask //////////////////////////////////////////////////////
    function RateLocationQualityTask(location, lastCompletedDate, lastCompletedOutcome) {
        Task.call(this, 'RateLocationQuality', true, 'message.locationTaskOpinion.success', 'quality', undefined,
            undefined, location, lastCompletedDate, lastCompletedOutcome)
        ;
    }

    RateLocationQualityTask.prototype = Object.create(Task.prototype);
    RateLocationQualityTask.prototype.constructor = RateLocationQualityTask;

    // TagLocationTask ////////////////////////////////////////////////////////
    function TagLocationTask(location, lastCompletedDate, lastCompletedOutcome) {
        // Create initial input model from last completed outcome
        var initialInput = {};
        if (angular.isObject(lastCompletedOutcome) && angular.isArray(lastCompletedOutcome.tags)) {
            _.each(lastCompletedOutcome, function(tag) {
                initialInput[tag] = true;
            });
        }

        Task.call(this, 'TagLocation', true, 'message.locationTaskOpinion.success', 'tags', undefined,
            initialInput, location, lastCompletedDate, lastCompletedOutcome)
        ;
        this.possibleAnswers = {
            gastronomy: [
                'gBreakfast',
                'gLunch',
                'gDinner',
                'gBrunch',
                'gSweets',
                'gSnacks',
                'gMilk'
            ],
            retailFood: [
                'rfDairy',
                'rfBread',
                'rfSweets',
                'rfMeat',
                'rfCheese',
                'rfSupplements'
            ],
            retailNonFood: [
                'rnClothes',
                'rnShoes',
                'rnHygiene',
                'rnCleaning',
                'rnBooks',
                'rnPets'
            ]
        };

        // Set which group is shown by default based on the location type
        this.groupShown = {
            gastronomy: (this.location.type === 'gastronomy'),
            retailFood: (this.location.type === 'retail'),
            retailNonFood: false
        };
    }

    TagLocationTask.prototype = Object.create(Task.prototype);
    TagLocationTask.prototype.constructor = TagLocationTask;

    TagLocationTask.prototype.hasValidOutcome = function() {
        var outcome = this.getOutcome();

        // Check if the outcome is the same as the last one.
        // If yes, the outcome is not valid yet
        if (angular.isObject(this.lastCompletedOutcome) &&
            angular.isArray(this.lastCompletedOutcome.tags) &&
            this.lastCompletedOutcome.tags.length === outcome.tags.length &&
            _.isEqual(outcome.tags.sort(), this.lastCompletedOutcome.tags.sort()))
        {
            return false;
        }

        return (outcome.tags.length > 0);
    };

    TagLocationTask.prototype.getOutcome = function() {
        if (this.completed) {
            return this._finalOutcome;
        }
        var outcome = {
            tags: []
        };
        _.each(this.inputModel, function(selected, tag) {
            if (selected === true) {
                outcome.tags.push(tag);
            }
        });

        return outcome;
    };

    /**
     * Helper method for getting the number of selected tags in a group
     * @param {string} group
     * @returns {number}
     */
    TagLocationTask.prototype.getNumSelected = function(group) {
        var outcome = this.getOutcome();
        var count = 0;
        _.each(this.possibleAnswers[group], function(tag) {
            if (outcome.tags.indexOf(tag) > -1) {
                count += 1;
            }
        });

        return count;
    };


    module.value('tasks', {
        hasOptions: HasOptionsMission, // TODO WIP
        MentionVegan: MentionVeganTask,
        AddProduct: AddProductTask,
        BuyProduct: BuyProductTask,
        GiveFeedback: GiveFeedbackTask,
        HowWellDoYouKnowThisLocation: HowWellDoYouKnowThisLocationTask,
        RateProduct: RateProductTask,
        SetLocationCoordinates: SetLocationCoordinatesTask,
        SetLocationExistence: SetLocationExistenceTask,
        SetLocationName: SetLocationNameTask,
        SetLocationType: SetLocationTypeTask,
        SetLocationDescription: SetLocationDescriptionTask,
        SetLocationWebsite: SetLocationWebsiteTask,
        SetLocationProductListComplete: SetLocationProductListCompleteTask,
        SetProductName: SetProductNameTask,
        SetProductAvailability: SetProductAvailabilityTask,
        RateLocationQuality: RateLocationQualityTask,
        TagLocation: TagLocationTask
    });
})(window.veganaut.tasksModule);
