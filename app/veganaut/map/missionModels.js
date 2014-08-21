(function(module) {
    'use strict';

    /**
     * Generic Mission Model
     * @param {string} id
     * @param {{}|[]} answer
     * @param {string} [callToActionIcon='bullhorn']
     * @constructor
     */
    function Mission(id, answer, callToActionIcon) {
        this.id = id;
        this.answer = answer;
        this.callToActionIcon = callToActionIcon || 'bullhorn';
        this.showing = false;
        this.completed = false;
    }

    Mission.prototype.isAvailable = function() {
        return true;
    };

    Mission.prototype.hasValidAnswer = function() {
        return true;
    };

    /**
     * Concludes this mission and returns true if it was finished successfully.
     * @returns {boolean}
     */
    Mission.prototype.finish = function() {
        if (!this.hasValidAnswer()) {
            return false;
        }

        this.completed = true;
        return true;
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
            { id: 1, text: '' }
        ]
    );

    WhatOptionsMission.prototype.isAvailable = function() {
        var optionsAvailable = this.missionSet.missionsById.optionsAvailable;
        return optionsAvailable.completed && optionsAvailable.answer.hasVegan;
    };

    WhatOptionsMission.prototype.hasValidAnswer = function() {
        return (this.answer.length > 0 &&
            typeof this.answer[0].text !== 'undefined' &&
            this.answer[0].text.length > 0);
    };

    /**
     * @inherit
     */
    WhatOptionsMission.prototype.finish = function() {
        var isFinished = Mission.prototype.finish.apply(this);
        if (isFinished) {
            // Read out the valid answers
            var validAnswers = [];
            for (var i = 0; i < this.answer.length; i += 1) {
                var answer = this.answer[i];
                if (typeof answer.text !== 'undefined' && answer.text.length > 0) {
                    validAnswers.push(answer);
                }
            }
            this.answer = validAnswers;
        }

        return isFinished;
    };


    // BuyOptionsMission //////////////////////////////////////////////////////
    function BuyOptionsMission(missionSet) {
        this.missionSet = missionSet;
    }
    BuyOptionsMission.prototype = new Mission('buyOptions', {});

    BuyOptionsMission.prototype.isAvailable = function() {
        return this.missionSet.missionsById.whatOptions.completed;
    };

    BuyOptionsMission.prototype.hasValidAnswer = function() {
        return (this.getBoughtOptions().length > 0);
    };

    BuyOptionsMission.prototype.getAvailableOptions = function() {
        return this.missionSet.missionsById.whatOptions.answer;
    };

    BuyOptionsMission.prototype.getBoughtOptions = function() {
        var boughtOptions = [];
        var availableOptions = this.missionSet.missionsById.whatOptions.answer;
        for (var i = 0; i < availableOptions.length; i += 1) {
            if (this.answer[availableOptions[i].id] === true) {
                boughtOptions.push(availableOptions[i]);
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

    StaffFeedbackMission.prototype.isAvailable = function() {
        return this.missionSet.missionsById.optionsAvailable.completed;
    };

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
        },
        'star'
    );

    RateLocationMission.prototype.isAvailable = function() {
        return this.missionSet.missionsById.optionsAvailable.completed;
    };

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
