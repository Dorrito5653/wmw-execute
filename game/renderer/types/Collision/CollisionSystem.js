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
exports.CollisionSystem = void 0;
var System_1 = require("../EntityComponentSystem/System");
var Events_1 = require("../Events");
var Physics_1 = require("./Physics");
var ArcadeSolver_1 = require("./Solver/ArcadeSolver");
var DynamicTreeCollisionProcessor_1 = require("./Detection/DynamicTreeCollisionProcessor");
var RealisticSolver_1 = require("./Solver/RealisticSolver");
var ColliderComponent_1 = require("./ColliderComponent");
var CompositeCollider_1 = require("./Colliders/CompositeCollider");
var CollisionSystem = /** @class */ (function (_super) {
    __extends(CollisionSystem, _super);
    function CollisionSystem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.types = ['ex.transform', 'ex.motion', 'ex.collider'];
        _this.systemType = System_1.SystemType.Update;
        _this.priority = -1;
        _this._realisticSolver = new RealisticSolver_1.RealisticSolver();
        _this._arcadeSolver = new ArcadeSolver_1.ArcadeSolver();
        _this._processor = new DynamicTreeCollisionProcessor_1.DynamicTreeCollisionProcessor();
        _this._lastFrameContacts = new Map();
        _this._currentFrameContacts = new Map();
        _this._trackCollider = function (c) { return _this._processor.track(c); };
        _this._untrackCollider = function (c) { return _this._processor.untrack(c); };
        return _this;
    }
    CollisionSystem.prototype.notify = function (message) {
        if ((0, System_1.isAddedSystemEntity)(message)) {
            var colliderComponent = message.data.get(ColliderComponent_1.ColliderComponent);
            colliderComponent.$colliderAdded.subscribe(this._trackCollider);
            colliderComponent.$colliderRemoved.subscribe(this._untrackCollider);
            var collider = colliderComponent.get();
            if (collider) {
                this._processor.track(collider);
            }
        }
        else {
            var colliderComponent = message.data.get(ColliderComponent_1.ColliderComponent);
            var collider = colliderComponent.get();
            if (colliderComponent && collider) {
                this._processor.untrack(collider);
            }
        }
    };
    CollisionSystem.prototype.initialize = function (scene) {
        this._engine = scene.engine;
    };
    CollisionSystem.prototype.update = function (entities, elapsedMs) {
        var _a, _b, _c, _d;
        if (!Physics_1.Physics.enabled) {
            return;
        }
        // Collect up all the colliders and update them
        var colliders = [];
        for (var _i = 0, entities_1 = entities; _i < entities_1.length; _i++) {
            var entity = entities_1[_i];
            var colliderComp = entity.get(ColliderComponent_1.ColliderComponent);
            var collider = colliderComp === null || colliderComp === void 0 ? void 0 : colliderComp.get();
            if (colliderComp && ((_a = colliderComp.owner) === null || _a === void 0 ? void 0 : _a.active) && collider) {
                colliderComp.update();
                if (collider instanceof CompositeCollider_1.CompositeCollider) {
                    var compositeColliders = collider.getColliders();
                    colliders = colliders.concat(compositeColliders);
                }
                else {
                    colliders.push(collider);
                }
            }
        }
        // Update the spatial partitioning data structures
        // TODO if collider invalid it will break the processor
        // TODO rename "update" to something more specific
        this._processor.update(colliders);
        // Run broadphase on all colliders and locates potential collisions
        var pairs = this._processor.broadphase(colliders, elapsedMs);
        this._currentFrameContacts.clear();
        // Given possible pairs find actual contacts
        var contacts = this._processor.narrowphase(pairs, (_d = (_c = (_b = this._engine) === null || _b === void 0 ? void 0 : _b.debug) === null || _c === void 0 ? void 0 : _c.stats) === null || _d === void 0 ? void 0 : _d.currFrame);
        var solver = this.getSolver();
        // Solve, this resolves the position/velocity so entities aren't overlapping
        contacts = solver.solve(contacts);
        // Record contacts for start/end
        for (var _e = 0, contacts_1 = contacts; _e < contacts_1.length; _e++) {
            var contact = contacts_1[_e];
            // Process composite ids, things with the same composite id are treated as the same collider for start/end
            var index = contact.id.indexOf('|');
            if (index > 0) {
                var compositeId = contact.id.substring(index + 1);
                this._currentFrameContacts.set(compositeId, contact);
            }
            else {
                this._currentFrameContacts.set(contact.id, contact);
            }
        }
        // Emit contact start/end events
        this.runContactStartEnd();
        // reset the last frame cache
        this._lastFrameContacts.clear();
        // Keep track of collisions contacts that have started or ended
        this._lastFrameContacts = new Map(this._currentFrameContacts);
    };
    CollisionSystem.prototype.getSolver = function () {
        return Physics_1.Physics.collisionResolutionStrategy === Physics_1.CollisionResolutionStrategy.Realistic ? this._realisticSolver : this._arcadeSolver;
    };
    CollisionSystem.prototype.debug = function (ex) {
        this._processor.debug(ex);
    };
    CollisionSystem.prototype.runContactStartEnd = function () {
        // Composite collider collisions may have a duplicate id because we want to treat those as a singular start/end
        for (var _i = 0, _a = this._currentFrameContacts; _i < _a.length; _i++) {
            var _b = _a[_i], id = _b[0], c = _b[1];
            // find all new contacts
            if (!this._lastFrameContacts.has(id)) {
                var colliderA = c.colliderA;
                var colliderB = c.colliderB;
                colliderA.events.emit('collisionstart', new Events_1.CollisionStartEvent(colliderA, colliderB, c));
                colliderA.events.emit('contactstart', new Events_1.ContactStartEvent(colliderA, colliderB, c));
                colliderB.events.emit('collisionstart', new Events_1.CollisionStartEvent(colliderB, colliderA, c));
                colliderB.events.emit('contactstart', new Events_1.ContactStartEvent(colliderB, colliderA, c));
            }
        }
        // find all contacts that have ceased
        for (var _c = 0, _d = this._lastFrameContacts; _c < _d.length; _c++) {
            var _e = _d[_c], id = _e[0], c = _e[1];
            if (!this._currentFrameContacts.has(id)) {
                var colliderA = c.colliderA;
                var colliderB = c.colliderB;
                colliderA.events.emit('collisionend', new Events_1.CollisionEndEvent(colliderA, colliderB));
                colliderA.events.emit('contactend', new Events_1.ContactEndEvent(colliderA, colliderB));
                colliderB.events.emit('collisionend', new Events_1.CollisionEndEvent(colliderB, colliderA));
                colliderB.events.emit('contactend', new Events_1.ContactEndEvent(colliderB, colliderA));
            }
        }
    };
    return CollisionSystem;
}(System_1.System));
exports.CollisionSystem = CollisionSystem;
