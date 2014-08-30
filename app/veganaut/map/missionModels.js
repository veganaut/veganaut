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
    }

    Mission.prototype.hasValidOutcome = function() {
        return true;
    };

    Mission.prototype.toggleStarted = function() {
        if (!this.completed) {
            this.started = !this.started;
        }
    };

    // TODO: do this more elegantly
    Mission.prototype.toJson = function() {
        return {
            type: this.type,
            outcome: this.outcome
        };
    };

    /**
     * Concludes this mission. Should only be called once there is a valid outcome.
     */
    Mission.prototype.finish = function() {
        if (!this.completed) {
            this.receivedPoints = this.getCurrentPoints();
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
    function VisitBonusMission(visit, linkedToMission) {
        Mission.call(this, 'visitBonus', visit, {}, 100, 10);
        this._linkedToMission = linkedToMission;
    }

    VisitBonusMission.prototype = Object.create(Mission.prototype);
    VisitBonusMission.prototype.constructor = VisitBonusMission;

    /**
     * @inheritdoc
     */
    VisitBonusMission.prototype.getCurrentPoints = function() {
        // If we are done, return the calculated points
        if (this.completed) {
            return this.receivedPoints;
        }

        // Otherwise, check how many points the linked mission gives
        var linkedPoints = 0;
        if (!this._linkedToMission.completed) {
            // We only care when the mission is not completed, otherwise
            // visit.getRemainingAvailablePoints() will already take this into account
            linkedPoints = this._linkedToMission.getCurrentPoints();
        }
        return Math.max(0,
            Math.min(this.points, this.visit.getRemainingAvailablePoints()) - linkedPoints
        );
    };


    // HasOptionsMission //////////////////////////////////////////////////////
    function HasOptionsMission(visit) {
        Mission.call(this, 'hasOptions', visit, undefined, 10, 20);
    }

    HasOptionsMission.prototype = Object.create(Mission.prototype);
    HasOptionsMission.prototype.constructor = HasOptionsMission;

    HasOptionsMission.prototype.hasValidOutcome = function() {
        return (typeof this.outcome !== 'undefined');
    };


    // WhatOptionsMission /////////////////////////////////////////////////////
    function WhatOptionsMission(visit) {
        Mission.call(this, 'whatOptions', visit, [
            { text: '' }
        ], 10, 30);
    }

    WhatOptionsMission.prototype = Object.create(Mission.prototype);
    WhatOptionsMission.prototype.constructor = WhatOptionsMission;

    WhatOptionsMission.prototype.hasValidOutcome = function() {
        return (this.outcome.length > 0 &&
            typeof this.outcome[0].text !== 'undefined' &&
            this.outcome[0].text.length > 0);
    };

    /**
     * @inherit
     */
    WhatOptionsMission.prototype.finish = function() {
        // Read out the valid options
        var validOptions = [];
        for (var i = 0; i < this.outcome.length; i += 1) {
            var option = this.outcome[i];
            if (typeof option.text !== 'undefined' && option.text.length > 0) {
                validOptions.push(option);
            }
        }
        this.outcome = validOptions;

        // Let the parent do its thing
        Mission.prototype.finish.apply(this);
    };

    WhatOptionsMission.prototype.toJson = function() {
        var outcome = [];
        for (var i = 0; i < this.outcome.length; i += 1) {
            outcome.push(this.outcome[i].text);
        }
        return {
            type: this.type,
            outcome: outcome
        };
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
        for (var i = 0; i < this.availableOptions.length; i += 1) {
            if (this.outcome[this.availableOptions[i].id] === true) {
                boughtOptions.push(this.availableOptions[i]);
            }
        }
        return boughtOptions;
    };

    BuyOptionsMission.prototype.toJson = function() {
        var outcome = [];
        var boughtOptions = this.getBoughtOptions();
        for (var i = 0; i < boughtOptions.length; i += 1) {
            outcome.push(boughtOptions[i].id);
        }
        return {
            type: this.type,
            outcome: outcome
        };
    };


    // GiveFeedbackMission ////////////////////////////////////////////////////
    function GiveFeedbackMission(visit) {
        Mission.call(this, 'giveFeedback', visit, {
            text: '',
            didNotDoIt: false
        }, 20, 60);
        this.visit = visit;
    }

    GiveFeedbackMission.prototype = Object.create(Mission.prototype);
    GiveFeedbackMission.prototype.constructor = GiveFeedbackMission;

    GiveFeedbackMission.prototype.hasValidOutcome = function() {
        return (this.outcome.text.length > 0);
    };


    // RateOptionsMission /////////////////////////////////////////////////////
    function RateOptionsMission(visit) {
        Mission.call(this, 'rateOptions', visit, undefined, 10, 50);
        this.maxRating = 10;
    }

    RateOptionsMission.prototype = Object.create(Mission.prototype);
    RateOptionsMission.prototype.constructor = RateOptionsMission;

    RateOptionsMission.prototype.hasValidOutcome = function() {
        return this.outcome > 0;
    };


    module.value('missions', {
        VisitBonusMission: VisitBonusMission,
        HasOptionsMission: HasOptionsMission,
        WhatOptionsMission: WhatOptionsMission,
        BuyOptionsMission: BuyOptionsMission,
        GiveFeedbackMission: GiveFeedbackMission,
        RateOptionsMission: RateOptionsMission
    });
})(window.veganaut.mapModule);
