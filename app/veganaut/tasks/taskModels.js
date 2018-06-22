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
     * @param {Location} location Where this mission is done
     * @param {Date} [lastCompletedDate] When (if ever) the user last
     *      completed this mission
     * @param {{}|[]} [lastCompletedOutcome] outcome of the last time
     *      the user did this mission (if ever)
     * @param {Product} [product] The product this mission is about
     *      (if it's a product mission)
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
     * Checks whether this mission has a valid outcome.
     * @returns {boolean}
     */
    Task.prototype.hasValidOutcome = function() {
        return (typeof this.getOutcome()[this.mainOutcomeName] !== 'undefined');
    };

    /**
     * Aborts the mission and resets the outcome.
     * Once the mission is completed, it won't change anything anymore
     * TODO WIP: delete this?
     */
    Task.prototype.abort = function() {
        if (!this.completed) {
            // Reset the input
            this.inputModel = this._initialInput;
        }
    };

    /**
     * TODO WIP: this is not used?
     * Converts this mission to JSON ready to be sent to the backend
     * @returns {{type: string, outcome: {}}}
     */
    Task.prototype.toJson = function() {
        return {
            type: this.type,
            outcome: this.getOutcome()
        };
    };

    /**
     * Returns the outcome of this mission. To be overwritten
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
     * Concludes this mission. Should only be called once there is a valid outcome.
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

    // WantVeganMission //////////////////////////////////////////////////////
    function WantVeganMission(location, lastCompletedDate, lastCompletedOutcome) {
        Task.call(this, 'wantVegan', {
            builtin: {},
            custom: []
        }, location, lastCompletedDate, lastCompletedOutcome);

        this.builtinExpressions = [
            'vegan',
            'plantbased',
            'noAnimalproducts',
            'noMeat',
            'noMilk',
            'noEggs',
            'noHoney'
        ];
    }

    WantVeganMission.prototype = Object.create(Task.prototype);
    WantVeganMission.prototype.constructor = WantVeganMission;

    WantVeganMission.prototype.getOutcome = function() {
        if (this.completed) {
            return this._finalOutcome;
        }
        var outcome = [];
        _.forOwn(this.inputModel.builtin, function(isSelected, exp) {
            if (isSelected === true) {
                outcome.push({
                    expression: exp,
                    expressionType: 'builtin'
                });
            }
        });
        _.each(this.inputModel.custom, function(exp) {
            outcome.push({
                expression: exp,
                expressionType: 'custom'
            });
        });
        return outcome;
    };

    WantVeganMission.prototype.hasValidOutcome = function() {
        return (this.getOutcome().length > 0);
    };

    // WhatOptionsMission /////////////////////////////////////////////////////
    function WhatOptionsMission(location, lastCompletedDate, lastCompletedOutcome) {
        Task.call(this, 'whatOptions', [], location, lastCompletedDate, lastCompletedOutcome);
    }

    WhatOptionsMission.prototype = Object.create(Task.prototype);
    WhatOptionsMission.prototype.constructor = WhatOptionsMission;

    WhatOptionsMission.prototype.hasValidOutcome = function() {
        return (this.getOutcome().length > 0);
    };

    WhatOptionsMission.prototype.getOutcome = function() {
        if (this.completed) {
            return this._finalOutcome;
        }
        var outcome = [];
        _.each(this.inputModel, function(o) {
            outcome.push({
                product: {
                    name: o
                },
                info: 'available'
            });
        });
        return outcome;
    };

    // BuyOptionsMission //////////////////////////////////////////////////////
    function BuyOptionsMission(location, lastCompletedDate, lastCompletedOutcome) {
        Task.call(this, 'buyOptions', {}, location, lastCompletedDate, lastCompletedOutcome);
    }

    BuyOptionsMission.prototype = Object.create(Task.prototype);
    BuyOptionsMission.prototype.constructor = BuyOptionsMission;

    BuyOptionsMission.prototype.hasValidOutcome = function() {
        return (this.getOutcome().length > 0);
    };

    BuyOptionsMission.prototype.getOutcome = function() {
        if (this.completed) {
            return this._finalOutcome;
        }
        var outcome = [];
        _.each(this.inputModel, function(isSelected, productId) {
            if (isSelected) {
                outcome.push({
                    product: productId
                });
            }
        });
        return outcome;
    };

    // GiveFeedbackMission ////////////////////////////////////////////////////
    function GiveFeedbackMission(location, lastCompletedDate, lastCompletedOutcome) {
        Task.call(this, 'giveFeedback', '', location, lastCompletedDate, lastCompletedOutcome);
    }

    GiveFeedbackMission.prototype = Object.create(Task.prototype);
    GiveFeedbackMission.prototype.constructor = GiveFeedbackMission;

    GiveFeedbackMission.prototype.hasValidOutcome = function() {
        var outcome = this.getOutcome() || '';
        return (outcome.length > 0);
    };


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

    // SetProductNameMission //////////////////////////////////////////////////
    // TODO: there should be a way to just confirm the current name
    function SetProductNameMission(location, lastCompletedDate, lastCompletedOutcome, product) {
        var productName = product.name;
        Task.call(this, 'setProductName', productName, location, lastCompletedDate, lastCompletedOutcome, product);
    }

    SetProductNameMission.prototype = Object.create(Task.prototype);
    SetProductNameMission.prototype.constructor = SetProductNameMission;

    SetProductNameMission.prototype.getOutcome = function() {
        if (this.completed) {
            return this._finalOutcome;
        }
        var outcome;
        if (typeof this.inputModel === 'string' && this.inputModel.length > 0 && this.inputModel !== this.product.name) {
            outcome = {
                product: this.product.id,
                info: this.inputModel
            };
        }
        return outcome;
    };

    // SetProductAvailMission /////////////////////////////////////////////////
    function SetProductAvailMission(location, lastCompletedDate, lastCompletedOutcome, product) {
        Task.call(this, 'setProductAvail', undefined, location, lastCompletedDate, lastCompletedOutcome, product);
        this.possibleAnswers = ['available', 'temporarilyUnavailable', 'unavailable'];
    }

    SetProductAvailMission.prototype = Object.create(Task.prototype);
    SetProductAvailMission.prototype.constructor = SetProductAvailMission;

    SetProductAvailMission.prototype.getOutcome = function() {
        if (this.completed) {
            return this._finalOutcome;
        }
        var outcome;
        if (typeof this.inputModel === 'string' && this.possibleAnswers.indexOf(this.inputModel) > -1) {
            outcome = {
                product: this.product.id,
                info: this.inputModel
            };
        }
        return outcome;
    };

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


    // TODO: get rid of the two identifiers for missions ("visitBonus" and "VisitBonusMission")
    module.value('tasks', {
        hasOptions: HasOptionsMission, // TODO WIP
        wantVegan: WantVeganMission, // TODO WIP
        whatOptions: WhatOptionsMission, // TODO WIP
        buyOptions: BuyOptionsMission, // TODO WIP
        giveFeedback: GiveFeedbackMission, // TODO WIP
        RateProduct: RateProductTask,
        SetLocationName: SetLocationNameTask,
        SetLocationType: SetLocationTypeTask,
        SetLocationDescription: SetLocationDescriptionTask,
        SetLocationWebsite: SetLocationWebsiteTask,
        setProductName: SetProductNameMission, // TODO WIP
        setProductAvail: SetProductAvailMission, // TODO WIP
        RateLocationQuality: RateLocationQualityTask,
        TagLocation: TagLocationTask
    });
})(window.veganaut.missionsModule);
