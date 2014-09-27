(function(module) {
    'use strict';

    /**
     * Generic Mission Model
     * @param {string} type
     * @param {Visit} visit
     * @param {{}|[]} outcome
     * @param {number} points
     * @param {number} order Missions will be ordered according to this
     * @constructor
     */
    function Mission(type, visit, outcome, points, order) {
        this.type = type;
        this.visit = visit;
        this.outcome = outcome;
        this.points = points;
        this.receivedPoints = 0;
        this.order = order;
        this.started = false;
        this.completed = false;
        this.finalOutcome = undefined;
    }

    Mission.prototype.hasValidOutcome = function() {
        return true;
    };

    Mission.prototype.toggleStarted = function() {
        if (!this.completed) {
            this.started = !this.started;
        }
    };

    /**
     * Converts this mission to JSON ready to be sent to the backend
     * @returns {{type: string, outcome: {}, points: {}}}
     */
    Mission.prototype.toJson = function() {
        var points = {};
        points[this.visit.player.team] = this.receivedPoints;
        return {
            type: this.type,
            outcome: this.getOutcome(),
            points: points
        };
    };

    /**
     * Returns the outcome of this mission. To be overwritten
     * by child classes.
     * @returns {{}}
     */
    Mission.prototype.getOutcome = function() {
        if (this.completed) {
            return this.finalOutcome;
        }
        return this.outcome;
    };

    /**
     * Concludes this mission. Should only be called once there is a valid outcome.
     */
    Mission.prototype.finish = function() {
        if (!this.completed) {
            this.receivedPoints = this.getCurrentPoints();
            this.finalOutcome = this.getOutcome();
            this.completed = true;

            // Tell the visit we are done
            this.visit.finishedMission(this);
        }
    };

    /**
     * Returns the point that the mission would make if it were completed
     * now, or the actual number of awarded points if its already completed.
     * @returns {number}
     */
    Mission.prototype.getCurrentPoints = function() {
        if (this.completed) {
            return this.receivedPoints;
        }
        return Math.min(this.points, this.visit.getRemainingAvailablePoints());
    };


    // VisitBonusMission //////////////////////////////////////////////////////
    function VisitBonusMission(visit) {
        Mission.call(this, 'visitBonus', visit, true, 50, 10);
    }

    VisitBonusMission.prototype = Object.create(Mission.prototype);
    VisitBonusMission.prototype.constructor = VisitBonusMission;


    // HasOptionsMission //////////////////////////////////////////////////////
    function HasOptionsMission(visit) {
        Mission.call(this, 'hasOptions', visit, {}, 10, 20);
        this.firstAnswers = ['yes', 'no', 'theyDoNotKnow'];
        this.secondAnswers = ['ratherYes', 'ratherNo', 'noClue'];
    }

    HasOptionsMission.prototype = Object.create(Mission.prototype);
    HasOptionsMission.prototype.constructor = HasOptionsMission;

    HasOptionsMission.prototype.getOutcome = function() {
        if (this.completed) {
            return this.finalOutcome;
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

    HasOptionsMission.prototype.hasValidOutcome = function() {
        return (typeof this.getOutcome() !== 'undefined');
    };

    // WantVeganMission //////////////////////////////////////////////////////
    function WantVeganMission(visit) {
        Mission.call(this, 'wantVegan', visit, {
            builtin: {},
            custom: []
        }, 10, 25);

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
            return this.finalOutcome;
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
    function WhatOptionsMission(visit) {
        Mission.call(this, 'whatOptions', visit, [], 10, 30);
    }

    WhatOptionsMission.prototype = Object.create(Mission.prototype);
    WhatOptionsMission.prototype.constructor = WhatOptionsMission;

    WhatOptionsMission.prototype.hasValidOutcome = function() {
        return this.outcome.length > 0;
    };

    WhatOptionsMission.prototype.getOutcome = function() {
        if (this.completed) {
            return this.finalOutcome;
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
    function BuyOptionsMission(visit, availableOptions) {
        Mission.call(this, 'buyOptions', visit, {}, 20, 40);
        this.availableOptions = availableOptions;
    }

    BuyOptionsMission.prototype = Object.create(Mission.prototype);
    BuyOptionsMission.prototype.constructor = BuyOptionsMission;

    BuyOptionsMission.prototype.hasValidOutcome = function() {
        return (this.getBoughtOptions().length > 0);
    };

    BuyOptionsMission.prototype.getBoughtOptions = function() {
        var boughtOptions = [];
        //for (var i = 0; i < this.availableOptions.length; i += 1) {
        //    if (this.outcome[this.availableOptions[i].id] === true) {
        //        boughtOptions.push(this.availableOptions[i]);
        //    }
        //}
        return boughtOptions;
    };

    BuyOptionsMission.prototype.getOutcome = function() {
        if (this.completed) {
            return this.finalOutcome;
        }
        var outcome = [];
        var boughtOptions = this.getBoughtOptions();
        for (var i = 0; i < boughtOptions.length; i += 1) {
            outcome.push(boughtOptions[i].id);
        }
        return outcome;
    };


    // GiveFeedbackMission ////////////////////////////////////////////////////
    function GiveFeedbackMission(visit) {
        Mission.call(this, 'giveFeedback', visit, {
            text: '',
            didNotDoIt: false
        }, 20, 60);
    }

    GiveFeedbackMission.prototype = Object.create(Mission.prototype);
    GiveFeedbackMission.prototype.constructor = GiveFeedbackMission;

    GiveFeedbackMission.prototype.hasValidOutcome = function() {
        return (this.outcome.text.length > 0);
    };


    // RateOptionsMission /////////////////////////////////////////////////////
    function RateOptionsMission(visit) {
        Mission.call(this, 'rateOptions', visit, undefined, 10, 50);
        this.maxRating = 5;
    }

    RateOptionsMission.prototype = Object.create(Mission.prototype);
    RateOptionsMission.prototype.constructor = RateOptionsMission;

    RateOptionsMission.prototype.hasValidOutcome = function() {
        return this.outcome > 0;
    };

    // OfferQualityMission //////////////////////////////////////////////////////
    function OfferQualityMission(visit) {
        Mission.call(this, 'offerQuality', visit, undefined, 10, 780);
        this.maxRating = 5;
    }

    OfferQualityMission.prototype = Object.create(Mission.prototype);
    OfferQualityMission.prototype.constructor = OfferQualityMission;

    // EffortValueMission //////////////////////////////////////////////////////
    function EffortValueMission(visit) {
        Mission.call(this, 'effortValue', visit, undefined, 10, 80);
        this.maxRating = 5;
    }

    EffortValueMission.prototype = Object.create(Mission.prototype);
    EffortValueMission.prototype.constructor = EffortValueMission;


    module.value('missions', {
        VisitBonusMission: VisitBonusMission,
        HasOptionsMission: HasOptionsMission,
        WantVeganMission: WantVeganMission,
        WhatOptionsMission: WhatOptionsMission,
        BuyOptionsMission: BuyOptionsMission,
        GiveFeedbackMission: GiveFeedbackMission,
        RateOptionsMission: RateOptionsMission,
        OfferQualityMission: OfferQualityMission,
        EffortValueMission: EffortValueMission
    });
})(window.veganaut.mapModule);
