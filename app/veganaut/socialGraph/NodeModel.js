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

    module.value('Node', Node);
})(window.veganaut.socialGraphModule);
