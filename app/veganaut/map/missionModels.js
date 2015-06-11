(function(module) {
    'use strict';

    /**
     * Order that the missions will be shown in
     * @type {string[]}
     */
    var MISSION_ORDER = [
        'visitBonus',
        'hasOptions',
        'wantVegan',
        'whatOptions',
        'buyOptions',
        'rateOptions',
        'giveFeedback',
        'offerQuality',
        'effortValue',
        'updateProduct' // TODO: this might not make sense
    ];

    /**
     * Generic Mission Model
     *
     * @param {string} type
     * @param {{}|[]} outcome
     * @param {Location} location Where this mission is done
     * @param {number} points
     * @param {Date} [lastCompletedDate] When (if ever) the user last
     *      completed this mission
     * @param {{}|[]} [lastCompletedOutcome] outcome of the last time
     *      the user did this mission (if ever)
     * @param {Product} [product] The product this mission is about
     *      (if it's a product mission)
     * @constructor
     */
    function Mission(type, outcome, location, points, lastCompletedDate, lastCompletedOutcome, product) {
        this.type = type;
        this.location = location;
        this.outcome = outcome;
        this.points = points;
        this.order = MISSION_ORDER.indexOf(type);
        this.lastCompletedDate = lastCompletedDate;
        this.lastCompletedOutcome = lastCompletedOutcome;
        this.product = product;
        this.started = false;
        this.completed = false;
        this._finalOutcome = undefined;

        // Store a deep copy of the initial outcome to be able to reset
        this._initalOutcome = angular.copy(outcome);
    }

    /**
     * Checks whether this mission has a valid outcome.
     * @returns {boolean}
     */
    Mission.prototype.hasValidOutcome = function() {
        return (typeof this.getOutcome() !== 'undefined');
    };

    /**
     * Starts the mission
     */
    Mission.prototype.start = function() {
        if (!this.completed) {
            this.started = true;
        }
    };

    /**
     * Aborts the mission and resets the outcome.
     * Once the mission is completed, it won't change anything anymore
     */
    Mission.prototype.abort = function() {
        if (!this.completed) {
            this.started = false;

            // Reset the outcome
            this.outcome = this._initalOutcome;
        }
    };

    /**
     * Converts this mission to JSON ready to be sent to the backend
     * @returns {{type: string, outcome: {}, points: {}}}
     */
    Mission.prototype.toJson = function() {
        return {
            type: this.type,
            outcome: this.getOutcome(),
            points: this.points // TODO: this is not supported yet by the backend
        };
    };

    /**
     * Returns the outcome of this mission. To be overwritten
     * by child classes.
     * @returns {{}}
     */
    Mission.prototype.getOutcome = function() {
        if (this.completed) {
            return this._finalOutcome;
        }
        return this.outcome;
    };

    /**
     * Concludes this mission. Should only be called once there is a valid outcome.
     */
    Mission.prototype.finish = function() {
        if (!this.completed) {
            this._finalOutcome = this.getOutcome();
            this.completed = true;
        }
    };

    /**
     * Returns whether this mission is available at the moment
     * at this location for this user.
     * @returns {boolean}
     */
    Mission.prototype.isAvailable = function() {
        // TODO NOW: change the concept of this
        return true;
    };

    // VisitBonusMission //////////////////////////////////////////////////////
    function VisitBonusMission(location, points, lastCompletedDate, lastCompletedOutcome) {
        Mission.call(this, 'visitBonus', true, location, points, lastCompletedDate, lastCompletedOutcome);
    }

    VisitBonusMission.prototype = Object.create(Mission.prototype);
    VisitBonusMission.prototype.constructor = VisitBonusMission;

    // HasOptionsMission //////////////////////////////////////////////////////
    function HasOptionsMission(location, points, lastCompletedDate, lastCompletedOutcome) {
        Mission.call(this, 'hasOptions', {}, location, points, lastCompletedDate, lastCompletedOutcome);
        this.firstAnswers = ['yes', 'no', 'theyDoNotKnow'];
        this.secondAnswers = ['ratherYes', 'ratherNo', 'noClue'];
    }

    HasOptionsMission.prototype = Object.create(Mission.prototype);
    HasOptionsMission.prototype.constructor = HasOptionsMission;

    HasOptionsMission.prototype.getOutcome = function() {
        if (this.completed) {
            return this._finalOutcome;
        }
        var outcome;
        if (this.outcome.first === 'theyDoNotKnow') {
            outcome = this.outcome.second;
        }
        else {
            outcome = this.outcome.first;
        }
        return outcome;
    };

    // WantVeganMission //////////////////////////////////////////////////////
    function WantVeganMission(location, points, lastCompletedDate, lastCompletedOutcome) {
        Mission.call(this, 'wantVegan', {
            builtin: {},
            custom: []
        }, location, points, lastCompletedDate, lastCompletedOutcome);

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

    WantVeganMission.prototype = Object.create(Mission.prototype);
    WantVeganMission.prototype.constructor = WantVeganMission;

    WantVeganMission.prototype.getOutcome = function() {
        if (this.completed) {
            return this._finalOutcome;
        }
        var outcome = [];
        _.forOwn(this.outcome.builtin, function(isSelected, exp) {
            if (isSelected === true) {
                outcome.push({
                    expression: exp,
                    expressionType: 'builtin'
                });
            }
        });
        _.each(this.outcome.custom, function(exp) {
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
    function WhatOptionsMission(location, points, lastCompletedDate, lastCompletedOutcome) {
        Mission.call(this, 'whatOptions', [], location, points, lastCompletedDate, lastCompletedOutcome);
    }

    WhatOptionsMission.prototype = Object.create(Mission.prototype);
    WhatOptionsMission.prototype.constructor = WhatOptionsMission;

    WhatOptionsMission.prototype.hasValidOutcome = function() {
        return (this.getOutcome().length > 0);
    };

    WhatOptionsMission.prototype.getOutcome = function() {
        if (this.completed) {
            return this._finalOutcome;
        }
        var outcome = [];
        _.each(this.outcome, function(o) {
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
    function BuyOptionsMission(location, points, lastCompletedDate, lastCompletedOutcome) {
        Mission.call(this, 'buyOptions', {}, location, points, lastCompletedDate, lastCompletedOutcome);
    }

    BuyOptionsMission.prototype = Object.create(Mission.prototype);
    BuyOptionsMission.prototype.constructor = BuyOptionsMission;

    BuyOptionsMission.prototype.hasValidOutcome = function() {
        return (this.getOutcome().length > 0);
    };

    BuyOptionsMission.prototype.getOutcome = function() {
        if (this.completed) {
            return this._finalOutcome;
        }
        var outcome = [];
        _.each(this.outcome, function(isSelected, productId) {
            if (isSelected) {
                outcome.push({
                    product: productId
                });
            }
        });
        return outcome;
    };

    /**
     * @inheritDoc
     */
    BuyOptionsMission.prototype.isAvailable = function() {
        return (Mission.prototype.isAvailable.call(this) &&
            this.location.products.length > 0);
    };

    // GiveFeedbackMission ////////////////////////////////////////////////////
    function GiveFeedbackMission(location, points, lastCompletedDate, lastCompletedOutcome) {
        Mission.call(this, 'giveFeedback', '', location, points, lastCompletedDate, lastCompletedOutcome);
    }

    GiveFeedbackMission.prototype = Object.create(Mission.prototype);
    GiveFeedbackMission.prototype.constructor = GiveFeedbackMission;

    GiveFeedbackMission.prototype.hasValidOutcome = function() {
        var outcome = this.getOutcome() || '';
        return (outcome.length > 0);
    };


    // RateOptionsMission /////////////////////////////////////////////////////
    function RateOptionsMission(location, points, lastCompletedDate, lastCompletedOutcome, product) {
        Mission.call(this, 'rateOptions', undefined, location, points, lastCompletedDate, lastCompletedOutcome, product);
        this.maxRating = 5;
    }

    RateOptionsMission.prototype = Object.create(Mission.prototype);
    RateOptionsMission.prototype.constructor = RateOptionsMission;

    RateOptionsMission.prototype.hasValidOutcome = function() {
        return angular.isDefined(this.getOutcome());
    };

    RateOptionsMission.prototype.getOutcome = function() {
        if (this.completed) {
            return this._finalOutcome;
        }
        var outcome;
        if (angular.isNumber(this.outcome) && this.outcome > 0 && this.outcome < this.maxRating) {
            outcome = {
                product: this.product.id,
                info: this.outcome
            };
        }
        return outcome;
    };

    /**
     * @inheritDoc
     */
    RateOptionsMission.prototype.isAvailable = function() {
        return (Mission.prototype.isAvailable.call(this) &&
            this.location.products.length > 0);
    };

    // UpdateProductMission ////////////////////////////////////////////////////
    function UpdateProductMission(location, points, lastCompletedDate, lastCompletedOutcome, product) {
        var productName = product.name;
        Mission.call(this, 'updateProduct', productName, location, points, lastCompletedDate, lastCompletedOutcome, product);
    }

    UpdateProductMission.prototype = Object.create(Mission.prototype);
    UpdateProductMission.prototype.constructor = UpdateProductMission;

    UpdateProductMission.prototype.getOutcome = function() {
        if (this.completed) {
            return this._finalOutcome;
        }
        var outcome;
        if (typeof this.outcome === 'string' && this.outcome.length > 0 && this.outcome !== this.product.name) {
            outcome = {
                product: this.product.id,
                field: 'name',
                value: this.outcome
            };
        }
        return outcome;
    };

    // OfferQualityMission //////////////////////////////////////////////////////
    function OfferQualityMission(location, points, lastCompletedDate, lastCompletedOutcome) {
        Mission.call(this, 'offerQuality', undefined, location, points,lastCompletedDate, lastCompletedOutcome);
        this.maxRating = 5;
    }

    OfferQualityMission.prototype = Object.create(Mission.prototype);
    OfferQualityMission.prototype.constructor = OfferQualityMission;

    // EffortValueMission //////////////////////////////////////////////////////
    function EffortValueMission(location, points, lastCompletedDate, lastCompletedOutcome) {
        Mission.call(this, 'effortValue', undefined, location, points, lastCompletedDate, lastCompletedOutcome);
        this.possibleAnswers = ['yes', 'ratherYes', 'ratherNo', 'no'];
    }

    EffortValueMission.prototype = Object.create(Mission.prototype);
    EffortValueMission.prototype.constructor = EffortValueMission;


    // TODO: get rid of the two identifiers for missions ("visitBonus" and "VisitBonusMission")
    module.value('missions', {
        visitBonus: VisitBonusMission,
        hasOptions: HasOptionsMission,
        wantVegan: WantVeganMission,
        whatOptions: WhatOptionsMission,
        buyOptions: BuyOptionsMission,
        giveFeedback: GiveFeedbackMission,
        rateOptions: RateOptionsMission,
        updateProduct: UpdateProductMission,
        offerQuality: OfferQualityMission,
        effortValue: EffortValueMission,
    });
})(window.veganaut.mapModule);
