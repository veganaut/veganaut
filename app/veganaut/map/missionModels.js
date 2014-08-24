(function(module) {
    'use strict';

    // TODO: don't use this form of inheritance, it ain't cool (calls constructor of parent before actually constructing the object)

    /**
     * Generic Mission Model
     * @param {string} id
     * @param {{}|[]} answer
     * @constructor
     */
    function Mission(id, answer) {
        this.id = id;
        this.answer = answer;
        this.started = false;
        this.completed = false;
    }

    Mission.prototype.hasValidAnswer = function() {
        return true;
    };

    /**
     * Concludes this mission. Should only be called once there is a valid answer.
     */
    Mission.prototype.finish = function() {
        this.completed = true;

        // Tell the mission set we are done
        this.missionSet.finishedMission(this);
    };


    // OptionsAvailableMission ////////////////////////////////////////////////
    function OptionsAvailableMission(missionSet) {
        this.missionSet = missionSet;
    }

    OptionsAvailableMission.prototype = new Mission(
        'optionsAvailable',
        {
            hasVegan: undefined
        }
    );

    OptionsAvailableMission.prototype.hasValidAnswer = function() {
        return (typeof this.answer.hasVegan !== 'undefined');
    };


    // WhatOptionsMission /////////////////////////////////////////////////////
    function WhatOptionsMission(missionSet) {
        this.missionSet = missionSet;
    }

    WhatOptionsMission.prototype = new Mission(
        'whatOptions',
        [
            { text: '' }
        ]
    );

    WhatOptionsMission.prototype.hasValidAnswer = function() {
        return (this.answer.length > 0 &&
            typeof this.answer[0].text !== 'undefined' &&
            this.answer[0].text.length > 0);
    };

    /**
     * @inherit
     */
    WhatOptionsMission.prototype.finish = function() {
        // Read out the valid answers
        var validAnswers = [];
        for (var i = 0; i < this.answer.length; i += 1) {
            var answer = this.answer[i];
            if (typeof answer.text !== 'undefined' && answer.text.length > 0) {
                validAnswers.push(answer);
            }
        }
        this.answer = validAnswers;

        // Let the parent do its thing
        Mission.prototype.finish.apply(this);
    };


    // BuyOptionsMission //////////////////////////////////////////////////////
    function BuyOptionsMission(missionSet, availableOptions) {
        this.missionSet = missionSet;
        this.availableOptions = availableOptions;
    }
    BuyOptionsMission.prototype = new Mission('buyOptions', {});

    BuyOptionsMission.prototype.hasValidAnswer = function() {
        return (this.getBoughtOptions().length > 0);
    };

    BuyOptionsMission.prototype.getBoughtOptions = function() {
        var boughtOptions = [];
        for (var i = 0; i < this.availableOptions.length; i += 1) {
            if (this.answer[this.availableOptions[i].id] === true) {
                boughtOptions.push(this.availableOptions[i]);
            }
        }
        return boughtOptions;
    };


    // StaffFeedbackMission ///////////////////////////////////////////////////
    function StaffFeedbackMission(missionSet) {
        this.missionSet = missionSet;
    }

    StaffFeedbackMission.prototype = new Mission(
        'staffFeedback',
        {
            text: '',
            didNotDoIt: false
        }
    );

    StaffFeedbackMission.prototype.hasValidAnswer = function() {
        return (this.answer.text.length > 0);
    };


    // RateLocationMission ////////////////////////////////////////////////////
    function RateLocationMission(missionSet) {
        this.missionSet = missionSet;
        this.maxRating = 4;
    }

    RateLocationMission.prototype = new Mission(
        'rateLocation',
        {
            rating: undefined
        }
    );

    RateLocationMission.prototype.hasValidAnswer = function() {
        return this.answer.rating > 0;
    };


    module.value('missions', {
        OptionsAvailableMission: OptionsAvailableMission,
        WhatOptionsMission: WhatOptionsMission,
        BuyOptionsMission: BuyOptionsMission,
        StaffFeedbackMission: StaffFeedbackMission,
        RateLocationMission: RateLocationMission
    });
})(window.veganaut.mapModule);
