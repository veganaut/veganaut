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
        'effortValue'
    ];

    /**
     * Map of mission types to the number of points it gives
     * TODO: there is an identical list in the backend, share this code!
     * @type {{}}
     */
    var MISSION_POINTS = {
        addLocation:  10,
        visitBonus:   50,
        hasOptions:   10,
        wantVegan:    10,
        whatOptions:  10,
        buyOptions:   20,
        rateOptions:  10,
        giveFeedback: 10,
        offerQuality: 20,
        effortValue:  20
    };

    /**
     * Time in ms until a mission is available again
     * TODO: there should be an identical list in the backend, share this code!
     * @type {{}}
     */
    var MISSION_COOL_DOWN_PERIOD = {
        addLocation:  0, // none
        visitBonus:   1000 * 60 * 60 * 24 * 7 * 3, // 3 weeks
        hasOptions:   1000 * 60 * 60 * 24, // 1 day
        wantVegan:    1000 * 60 * 60 * 24, // 1 day
        whatOptions:  1000 * 60 * 60 *  4, // 4 hours
        buyOptions:   1000 * 60 * 60 *  4, // 4 hours
        rateOptions:  1000 * 60 * 60 *  4, // 4 hours
        giveFeedback: 1000 * 60 * 60 * 24, // 1 day
        offerQuality: 1000 * 60 * 60 * 24 * 7 * 3, // 3 weeks
        effortValue:  1000 * 60 * 60 * 24 * 7 * 3  // 3 weeks
    };

    /**
     * Generic Mission Model
     * @param {string} type
     * @param {Visit} visit
     * @param {{}|[]} outcome
     * @constructor
     */
    function Mission(type, visit, outcome) {
        this.type = type;
        this.visit = visit;
        this.outcome = outcome;
        this.points = MISSION_POINTS[type];
        this.order = MISSION_ORDER.indexOf(type);
        this.started = false;
        this.completed = false;
        this.finalOutcome = undefined;

        this.nextAvailable = true;
        var lastDate = this.visit.location.lastMissionDates[type];
        if (typeof lastDate !== 'undefined') {
            this.nextAvailable = new Date(
                lastDate.getTime() +
                MISSION_COOL_DOWN_PERIOD[this.type]
            );
        }
    }

    /**
     * Checks whether this mission has a valid outcome.
     * @returns {boolean}
     */
    Mission.prototype.hasValidOutcome = function() {
        return (typeof this.getOutcome() !== 'undefined');
    };

    /**
     * Toggle the started flag (except once completed, then
     * won't change anything any more)
     */
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
        points[this.visit.player.team] = this.points;
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
            this.finalOutcome = this.getOutcome();
            this.completed = true;

            // Tell the visit we are done
            this.visit.finishedMission(this);
        }
    };

    /**
     * Returns whether this mission is available at the moment
     * at this location for this user.
     * @returns {boolean}
     */
    Mission.prototype.isAvailable = function() {
        return (this.nextAvailable === true || this.nextAvailable.getTime() < Date.now());
    };

    // VisitBonusMission //////////////////////////////////////////////////////
    function VisitBonusMission(visit) {
        Mission.call(this, 'visitBonus', visit, true);
    }

    VisitBonusMission.prototype = Object.create(Mission.prototype);
    VisitBonusMission.prototype.constructor = VisitBonusMission;

    // HasOptionsMission //////////////////////////////////////////////////////
    function HasOptionsMission(visit) {
        Mission.call(this, 'hasOptions', visit, {});
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

    // WantVeganMission //////////////////////////////////////////////////////
    function WantVeganMission(visit) {
        Mission.call(this, 'wantVegan', visit, {
            builtin: {},
            custom: []
        });

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
        Mission.call(this, 'whatOptions', visit, []);
    }

    WhatOptionsMission.prototype = Object.create(Mission.prototype);
    WhatOptionsMission.prototype.constructor = WhatOptionsMission;

    WhatOptionsMission.prototype.hasValidOutcome = function() {
        return (this.getOutcome().length > 0);
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
    function BuyOptionsMission(visit) {
        Mission.call(this, 'buyOptions', visit, {});
    }

    BuyOptionsMission.prototype = Object.create(Mission.prototype);
    BuyOptionsMission.prototype.constructor = BuyOptionsMission;

    BuyOptionsMission.prototype.hasValidOutcome = function() {
        return (this.getOutcome().length > 0);
    };

    BuyOptionsMission.prototype.getOutcome = function() {
        if (this.completed) {
            return this.finalOutcome;
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
            this.visit.location.products.length > 0);
    };

    // GiveFeedbackMission ////////////////////////////////////////////////////
    function GiveFeedbackMission(visit) {
        Mission.call(this, 'giveFeedback', visit, '');
    }

    GiveFeedbackMission.prototype = Object.create(Mission.prototype);
    GiveFeedbackMission.prototype.constructor = GiveFeedbackMission;

    GiveFeedbackMission.prototype.hasValidOutcome = function() {
        return (this.getOutcome().length > 0);
    };


    // RateOptionsMission /////////////////////////////////////////////////////
    function RateOptionsMission(visit) {
        Mission.call(this, 'rateOptions', visit, {});
        this.maxRating = 5;
    }

    RateOptionsMission.prototype = Object.create(Mission.prototype);
    RateOptionsMission.prototype.constructor = RateOptionsMission;

    RateOptionsMission.prototype.hasValidOutcome = function() {
        return (this.getOutcome().length > 0);
    };

    RateOptionsMission.prototype.getOutcome = function() {
        if (this.completed) {
            return this.finalOutcome;
        }
        var outcome = [];
        _.each(this.outcome, function(rating, productId) {
            if (rating > 0) {
                outcome.push({
                    product: productId,
                    info: rating
                });
            }
        });
        return outcome;
    };

    /**
     * @inheritDoc
     */
    RateOptionsMission.prototype.isAvailable = function() {
        return (Mission.prototype.isAvailable.call(this) &&
            this.visit.location.products.length > 0);
    };

    // OfferQualityMission //////////////////////////////////////////////////////
    function OfferQualityMission(visit) {
        Mission.call(this, 'offerQuality', visit, undefined);
        this.maxRating = 5;
    }

    OfferQualityMission.prototype = Object.create(Mission.prototype);
    OfferQualityMission.prototype.constructor = OfferQualityMission;

    // EffortValueMission //////////////////////////////////////////////////////
    function EffortValueMission(visit) {
        Mission.call(this, 'effortValue', visit, undefined);
        this.possibleAnswers = ['yes', 'ratherYes', 'ratherNo', 'no'];
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
