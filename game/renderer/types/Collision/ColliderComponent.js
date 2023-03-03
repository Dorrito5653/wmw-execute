"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.ColliderComponent = void 0;
var vector_1 = require("../Math/vector");
var EntityComponentSystem_1 = require("../EntityComponentSystem");
var Component_1 = require("../EntityComponentSystem/Component");
var EventDispatcher_1 = require("../EventDispatcher");
var Events_1 = require("../Events");
var Observable_1 = require("../Util/Observable");
var BoundingBox_1 = require("./BoundingBox");
var CompositeCollider_1 = require("./Colliders/CompositeCollider");
var Shape_1 = require("./Colliders/Shape");
var ColliderComponent = /** @class */ (function (_super) {
    __extends(ColliderComponent, _super);
    function ColliderComponent(collider) {
        var _this = _super.call(this) || this;
        _this.type = 'ex.collider';
        _this.events = new EventDispatcher_1.EventDispatcher();
        /**
         * Observable that notifies when a collider is added to the body
         */
        _this.$colliderAdded = new Observable_1.Observable();
        /**
         * Observable that notifies when a collider is removed from the body
         */
        _this.$colliderRemoved = new Observable_1.Observable();
        _this.set(collider);
        return _this;
    }
    /**
     * Get the current collider geometry
     */
    ColliderComponent.prototype.get = function () {
        return this._collider;
    };
    /**
     * Set the collider geometry
     * @param collider
     * @returns the collider you set
     */
    ColliderComponent.prototype.set = function (collider) {
        this.clear();
        if (collider) {
            this._collider = collider;
            this._collider.owner = this.owner;
            this.events.wire(collider.events);
            this.$colliderAdded.notifyAll(collider);
            this.update();
        }
        return collider;
    };
    /**
     * Remove collider geometry from collider component
     */
    ColliderComponent.prototype.clear = function () {
        if (this._collider) {
            this.events.unwire(this._collider.events);
            this.$colliderRemoved.notifyAll(this._collider);
            this._collider.owner = null;
            this._collider = null;
        }
    };
    Object.defineProperty(ColliderComponent.prototype, "bounds", {
        /**
         * Return world space bounds
         */
        get: function () {
            var _a, _b;
            return (_b = (_a = this._collider) === null || _a === void 0 ? void 0 : _a.bounds) !== null && _b !== void 0 ? _b : new BoundingBox_1.BoundingBox();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ColliderComponent.prototype, "localBounds", {
        /**
         * Return local space bounds
         */
        get: function () {
            var _a, _b;
            return (_b = (_a = this._collider) === null || _a === void 0 ? void 0 : _a.localBounds) !== null && _b !== void 0 ? _b : new BoundingBox_1.BoundingBox();
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Update the collider's transformed geometry
     */
    ColliderComponent.prototype.update = function () {
        var _a;
        var tx = (_a = this.owner) === null || _a === void 0 ? void 0 : _a.get(EntityComponentSystem_1.TransformComponent);
        if (this._collider) {
            this._collider.owner = this.owner;
            if (tx) {
                this._collider.update(tx.get());
            }
        }
    };
    /**
     * Collide component with another
     * @param other
     */
    ColliderComponent.prototype.collide = function (other) {
        var _this = this;
        var colliderA = this._collider;
        var colliderB = other._collider;
        if (!colliderA || !colliderB) {
            return [];
        }
        // If we have a composite lefthand side :(
        // Might bite us, but to avoid updating all the handlers make composite always left side
        var flipped = false;
        if (colliderB instanceof CompositeCollider_1.CompositeCollider) {
            colliderA = colliderB;
            colliderB = this._collider;
            flipped = true;
        }
        if (this._collider) {
            var contacts = colliderA.collide(colliderB);
            if (contacts) {
                if (flipped) {
                    contacts.forEach(function (contact) {
                        contact.mtv = contact.mtv.negate();
                        contact.normal = contact.normal.negate();
                        contact.tangent = contact.normal.perpendicular();
                        contact.colliderA = _this._collider;
                        contact.colliderB = other._collider;
                    });
                }
                return contacts;
            }
            return [];
        }
        return [];
    };
    ColliderComponent.prototype.onAdd = function (entity) {
        if (this._collider) {
            this.update();
        }
        // Wire up the collider events to the owning entity
        this.events.on('precollision', function (evt) {
            var precollision = evt;
            entity.events.emit('precollision', new Events_1.PreCollisionEvent(precollision.target.owner, precollision.other.owner, precollision.side, precollision.intersection));
        });
        this.events.on('postcollision', function (evt) {
            var postcollision = evt;
            entity.events.emit('postcollision', new Events_1.PostCollisionEvent(postcollision.target.owner, postcollision.other.owner, postcollision.side, postcollision.intersection));
        });
        this.events.on('collisionstart', function (evt) {
            var start = evt;
            entity.events.emit('collisionstart', new Events_1.CollisionStartEvent(start.target.owner, start.other.owner, start.contact));
        });
        this.events.on('collisionend', function (evt) {
            var end = evt;
            entity.events.emit('collisionend', new Events_1.CollisionEndEvent(end.target.owner, end.other.owner));
        });
    };
    ColliderComponent.prototype.onRemove = function () {
        this.events.clear();
        this.$colliderRemoved.notifyAll(this._collider);
    };
    /**
     * Sets up a box geometry based on the current bounds of the associated actor of this physics body.
     *
     * If no width/height are specified the body will attempt to use the associated actor's width/height.
     *
     * By default, the box is center is at (0, 0) which means it is centered around the actors anchor.
     */
    ColliderComponent.prototype.useBoxCollider = function (width, height, anchor, center) {
        if (anchor === void 0) { anchor = vector_1.Vector.Half; }
        if (center === void 0) { center = vector_1.Vector.Zero; }
        var collider = Shape_1.Shape.Box(width, height, anchor, center);
        return (this.set(collider));
    };
    /**
     * Sets up a [[PolygonCollider|polygon]] collision geometry based on a list of of points relative
     *  to the anchor of the associated actor
     * of this physics body.
     *
     * Only [convex polygon](https://en.wikipedia.org/wiki/Convex_polygon) definitions are supported.
     *
     * By default, the box is center is at (0, 0) which means it is centered around the actors anchor.
     */
    ColliderComponent.prototype.usePolygonCollider = function (points, center) {
        if (center === void 0) { center = vector_1.Vector.Zero; }
        var poly = Shape_1.Shape.Polygon(points, center);
        return (this.set(poly));
    };
    /**
     * Sets up a [[Circle|circle collision geometry]] as the only collider with a specified radius in pixels.
     *
     * By default, the box is center is at (0, 0) which means it is centered around the actors anchor.
     */
    ColliderComponent.prototype.useCircleCollider = function (radius, center) {
        if (center === void 0) { center = vector_1.Vector.Zero; }
        var collider = Shape_1.Shape.Circle(radius, center);
        return (this.set(collider));
    };
    /**
     * Sets up an [[Edge|edge collision geometry]] with a start point and an end point relative to the anchor of the associated actor
     * of this physics body.
     *
     * By default, the box is center is at (0, 0) which means it is centered around the actors anchor.
     */
    ColliderComponent.prototype.useEdgeCollider = function (begin, end) {
        var collider = Shape_1.Shape.Edge(begin, end);
        return (this.set(collider));
    };
    /**
     * Setups up a [[CompositeCollider]] which can define any arbitrary set of excalibur colliders
     * @param colliders
     */
    ColliderComponent.prototype.useCompositeCollider = function (colliders) {
        return (this.set(new CompositeCollider_1.CompositeCollider(colliders)));
    };
    return ColliderComponent;
}(Component_1.Component));
exports.ColliderComponent = ColliderComponent;
