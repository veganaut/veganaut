(function(module) {
    'use strict';

    /**
     * Node Class
     * @param nodeData
     * @constructor
     */
    var Node = function(nodeData) {
        for (var key in nodeData) {
            if (nodeData.hasOwnProperty(key)) {
                this[key] = nodeData[key];
            }
        }
    };

    /**
     * Mapping of upper bounds of point balance to the balance name.
     * Used for setting the correct balance classes on the nodes and
     * showing them in the right colour instensity.
     * @type {*[]}
     */
    Node.BALANCE_MAPPING = [
        [2, 'xlow'],
        [3, 'low'],
        [5, 'med'],
        [8, 'high'],
        [Infinity, 'xhigh']
    ];

    /**
     * Returns whether this Node has a 'me' relation
     * aka represents ME
     * @returns {boolean}
     */
    Node.prototype.isMe = function() {
        return this.relation === 'me';
    };

    /**
     * Returns whether this Node has a 'frientOfFriend' relation
     * aka represents a indirect Relation to a Person
     * @returns {boolean}
     */
    Node.prototype.isFriendOfFriend = function() {
        return this.relation === 'friendOfFriend';
    };

    /**
     * Returns whether this Node Type is a User
     * aka Someone with a Login
     * @returns {boolean}
     */
    Node.prototype.isUser = function() {
        return this.type === 'user';
    };

    /**
     * Returns whether this Node Type is a Maybe
     * aka Someone who is Linked To, and has already entered a Ref Code
     * @returns {boolean}
     */
    Node.prototype.isBaby = function() {
        return this.type === 'baby';
    };

    /**
     * Returns whether this Node Type is a Maybe
     * aka Someone who is Linked To, but never has entered a Ref Code
     * @returns {boolean}
     */
    Node.prototype.isMaybe = function() {
        return this.type === 'maybe';
    };

    /**
     * Returns whether this Node is a Dummy
     * aka No One, but a an Invitation Node
     * @returns {boolean}
     */
    Node.prototype.isDummy = function() {
        return this.type === 'dummy';
    };

    /**
     * Returns whether this node should be displayed as small node.
     * @returns {boolean}
     */
    Node.prototype.isSmallNode = function() {
        return this.isMaybe() || this.isBaby() || this.isDummy();
    };

    /**
     * Returns whether this node has a valid point balance
     * @returns {boolean}
     */
    Node.prototype.hasBalance = function() {
        return (typeof this.team !== 'undefined');
    };

    /**
     * Returns the point balance or undefined if this node doesn't have one
     * @returns {number}
     */
    Node.prototype.getBalance = function() {
        if (this.hasBalance()) {
            return this.strength - this.hits;
        }
    };

    /**
     * Returns the balance string of this node (xlow, low, med, high, xhigh).
     * Returns undefined if it doesn't have a balance.
     * @returns {*}
     */
    Node.prototype.getBalanceMapping = function() {
        var balance = this.getBalance();
        for (var i = 0; i < Node.BALANCE_MAPPING.length; i++) {
            if (balance < Node.BALANCE_MAPPING[i][0]) {
                return Node.BALANCE_MAPPING[i][1];
            }
        }

        // Could not find balance mapping
        return undefined;
    };

    module.value('Node', Node);
})(window.veganaut.socialGraphModule);
