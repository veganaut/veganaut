(function(module) {
    'use strict';

    // TODO: don't use this form of inheritance, it ain't cool (calls constructor of parent before actually constructing the object)

    /**
     * Generic Mission Model
     * @param {string} type
     * @param {{}|[]} outcome
     * @param {number} points
     * @constructor
     */
    function Mission(type, outcome, points) {
        this.type = type;
        this.outcome = outcome;
        this.points = points;
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
            this.completed = true;

            // Tell the visit we are done
            this.visit.finishedMission(this);
        }
    };


    // VisitMission ///////////////////////////////////////////////////////////
    function VisitMission(visit) {
        this.visit = visit;
    }

    VisitMission.prototype = new Mission(
        'visit',
        {},
        100
    );


    // OptionsAvailableMission ////////////////////////////////////////////////
    function OptionsAvailableMission(visit) {
        this.visit = visit;
    }

    OptionsAvailableMission.prototype = new Mission(
        'optionsAvailable',
        undefined,
        10
    );

    OptionsAvailableMission.prototype.hasValidOutcome = function() {
        return (typeof this.outcome !== 'undefined');
    };


    // WhatOptionsMission /////////////////////////////////////////////////////
    function WhatOptionsMission(visit) {
        this.visit = visit;
    }

    WhatOptionsMission.prototype = new Mission(
        'whatOptions',
        [
            { text: '' }
        ],
        10
    );

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
        this.visit = visit;
        this.availableOptions = availableOptions;
    }
    BuyOptionsMission.prototype = new Mission(
        'buyOptions',
        {},
        20
    );

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


    // StaffFeedbackMission ///////////////////////////////////////////////////
    function StaffFeedbackMission(visit) {
        this.visit = visit;
    }

    StaffFeedbackMission.prototype = new Mission(
        'staffFeedback',
        {
            text: '',
            didNotDoIt: false
        },
        20
    );

    StaffFeedbackMission.prototype.hasValidOutcome = function() {
        return (this.outcome.text.length > 0);
    };


    // RateLocationMission ////////////////////////////////////////////////////
    function RateLocationMission(visit) {
        this.visit = visit;
        this.maxRating = 10;
    }

    RateLocationMission.prototype = new Mission(
        'rateLocation',
        undefined,
        10
    );

    RateLocationMission.prototype.hasValidOutcome = function() {
        return this.outcome > 0;
    };


    module.value('missions', {
        VisitMission: VisitMission,
        OptionsAvailableMission: OptionsAvailableMission,
        WhatOptionsMission: WhatOptionsMission,
        BuyOptionsMission: BuyOptionsMission,
        StaffFeedbackMission: StaffFeedbackMission,
        RateLocationMission: RateLocationMission
    });
})(window.veganaut.mapModule);
