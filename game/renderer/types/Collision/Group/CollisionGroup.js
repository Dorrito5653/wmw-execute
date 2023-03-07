"use strict";
exports.__esModule = true;
exports.CollisionGroup = void 0;
/**
 * CollisionGroups indicate like members that do not collide with each other. Use [[CollisionGroupManager]] to create [[CollisionGroup]]s
 *
 * For example:
 *
 * Players have collision group "player"
 *
 * ![Player Collision Group](/assets/images/docs/CollisionGroupsPlayer.png)
 *
 * Enemies have collision group "enemy"
 *
 * ![Enemy Collision Group](/assets/images/docs/CollisionGroupsEnemy.png)
 *
 * Blocks have collision group "ground"
 *
 * ![Ground collision group](/assets/images/docs/CollisionGroupsGround.png)
 *
 * Players don't collide with each other, but enemies and blocks. Likewise, enemies don't collide with each other but collide
 * with players and blocks.
 *
 * This is done with bitmasking, see the following pseudo-code
 *
 * PlayerGroup = `0b001`
 * PlayerGroupMask = `0b110`
 *
 * EnemyGroup = `0b010`
 * EnemyGroupMask = `0b101`
 *
 * BlockGroup = `0b100`
 * BlockGroupMask = `0b011`
 *
 * Should Players collide? No because the bitwise mask evaluates to 0
 * `(player1.group & player2.mask) === 0`
 * `(0b001 & 0b110) === 0`
 *
 * Should Players and Enemies collide? Yes because the bitwise mask is non-zero
 * `(player1.group & enemy1.mask) === 1`
 * `(0b001 & 0b101) === 1`
 *
 * Should Players and Blocks collide? Yes because the bitwise mask is non-zero
 * `(player1.group & blocks1.mask) === 1`
 * `(0b001 & 0b011) === 1`
 */
var CollisionGroup = /** @class */ (function () {
    /**
     * STOP!!** It is preferred that [[CollisionGroupManager.create]] is used to create collision groups
     *  unless you know how to construct the proper bitmasks. See https://github.com/excaliburjs/Excalibur/issues/1091 for more info.
     * @param name Name of the collision group
     * @param category 32 bit category for the group, should be a unique power of 2. For example `0b001` or `0b010`
     * @param mask 32 bit mask of category, or `~category` generally. For a category of `0b001`, the mask would be `0b110`
     */
    function CollisionGroup(name, category, mask) {
        this._name = name;
        this._category = category;
        this._mask = mask;
    }
    Object.defineProperty(CollisionGroup.prototype, "name", {
        /**
         * Get the name of the collision group
         */
        get: function () {
            return this._name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CollisionGroup.prototype, "category", {
        /**
         * Get the category of the collision group, a 32 bit number which should be a unique power of 2
         */
        get: function () {
            return this._category;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CollisionGroup.prototype, "mask", {
        /**
         * Get the mask for this collision group
         */
        get: function () {
            return this._mask;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Evaluates whether 2 collision groups can collide
     * @param other  CollisionGroup
     */
    CollisionGroup.prototype.canCollide = function (other) {
        return (this.category & other.mask) !== 0 && (other.category & this.mask) !== 0;
    };
    /**
     * Inverts the collision group. For example, if before the group specified "players",
     * inverting would specify all groups except players
     * @returns CollisionGroup
     */
    CollisionGroup.prototype.invert = function () {
        return new CollisionGroup('~(' + this.name + ')', ~this.category, ~this.mask);
    };
    /**
     * Combine collision groups with each other. The new group includes all of the previous groups.
     *
     * @param collisionGroups
     */
    CollisionGroup.combine = function (collisionGroups) {
        var combinedName = collisionGroups.map(function (c) { return c.name; }).join('+');
        var combinedCategory = collisionGroups.reduce(function (current, g) { return g.category | current; }, 0);
        var combinedMask = ~combinedCategory;
        return new CollisionGroup(combinedName, combinedCategory, combinedMask);
    };
    /**
     * Creates a collision group that collides with the listed groups
     * @param collisionGroups
     */
    CollisionGroup.collidesWith = function (collisionGroups) {
        return CollisionGroup.combine(collisionGroups).invert();
    };
    /**
     * The `All` [[CollisionGroup]] is a special group that collides with all other groups including itself,
     * it is the default collision group on colliders.
     */
    CollisionGroup.All = new CollisionGroup('Collide with all groups', -1, -1);
    return CollisionGroup;
}());
exports.CollisionGroup = CollisionGroup;
