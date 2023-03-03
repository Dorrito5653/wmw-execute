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
exports.PointerEventReceiver = void 0;
var Class_1 = require("../Class");
var Engine_1 = require("../Engine");
var global_coordinates_1 = require("../Math/global-coordinates");
var vector_1 = require("../Math/vector");
var PointerEvent_1 = require("./PointerEvent");
var WheelEvent_1 = require("./WheelEvent");
var PointerAbstraction_1 = require("./PointerAbstraction");
var WheelDeltaMode_1 = require("./WheelDeltaMode");
var PointerSystem_1 = require("./PointerSystem");
var NativePointerButton_1 = require("./NativePointerButton");
var PointerButton_1 = require("./PointerButton");
var Util_1 = require("../Util/Util");
var PointerType_1 = require("./PointerType");
/**
 * Is this event a native touch event?
 */
function isTouchEvent(value) {
    // Guard for Safari <= 13.1
    return globalThis.TouchEvent && value instanceof globalThis.TouchEvent;
}
/**
 * Is this event a native pointer event
 */
function isPointerEvent(value) {
    // Guard for Safari <= 13.1
    return globalThis.PointerEvent && value instanceof globalThis.PointerEvent;
}
/**
 * The PointerEventProcessor is responsible for collecting all the events from the canvas and transforming them into GlobalCoordinates
 */
var PointerEventReceiver = /** @class */ (function (_super) {
    __extends(PointerEventReceiver, _super);
    function PointerEventReceiver(target, engine) {
        var _this = _super.call(this) || this;
        _this.target = target;
        _this.engine = engine;
        _this.primary = new PointerAbstraction_1.PointerAbstraction();
        _this._activeNativePointerIdsToNormalized = new Map();
        _this.lastFramePointerCoords = new Map();
        _this.currentFramePointerCoords = new Map();
        _this.currentFramePointerDown = new Map();
        _this.lastFramePointerDown = new Map();
        _this.currentFrameDown = [];
        _this.currentFrameUp = [];
        _this.currentFrameMove = [];
        _this.currentFrameCancel = [];
        _this.currentFrameWheel = [];
        _this._pointers = [_this.primary];
        _this._boundHandle = _this._handle.bind(_this);
        _this._boundWheel = _this._handleWheel.bind(_this);
        return _this;
    }
    /**
     * Creates a new PointerEventReceiver with a new target and engine while preserving existing pointer event
     * handlers.
     * @param target
     * @param engine
     */
    PointerEventReceiver.prototype.recreate = function (target, engine) {
        var eventReceiver = new PointerEventReceiver(target, engine);
        eventReceiver.primary = this.primary;
        eventReceiver._pointers = this._pointers;
        return eventReceiver;
    };
    /**
     * Locates a specific pointer by id, creates it if it doesn't exist
     * @param index
     */
    PointerEventReceiver.prototype.at = function (index) {
        if (index >= this._pointers.length) {
            // Ensure there is a pointer to retrieve
            for (var i = this._pointers.length - 1, max = index; i < max; i++) {
                this._pointers.push(new PointerAbstraction_1.PointerAbstraction());
            }
        }
        return this._pointers[index];
    };
    /**
     * The number of pointers currently being tracked by excalibur
     */
    PointerEventReceiver.prototype.count = function () {
        return this._pointers.length;
    };
    /**
     * Is the specified pointer id down this frame
     * @param pointerId
     */
    PointerEventReceiver.prototype.isDown = function (pointerId) {
        var _a;
        return (_a = this.currentFramePointerDown.get(pointerId)) !== null && _a !== void 0 ? _a : false;
    };
    /**
     * Was the specified pointer id down last frame
     * @param pointerId
     */
    PointerEventReceiver.prototype.wasDown = function (pointerId) {
        var _a;
        return (_a = this.lastFramePointerDown.get(pointerId)) !== null && _a !== void 0 ? _a : false;
    };
    /**
     * Whether the Pointer is currently dragging.
     */
    PointerEventReceiver.prototype.isDragging = function (pointerId) {
        return this.isDown(pointerId);
    };
    /**
     * Whether the Pointer just started dragging.
     */
    PointerEventReceiver.prototype.isDragStart = function (pointerId) {
        return this.isDown(pointerId) && !this.wasDown(pointerId);
    };
    /**
     * Whether the Pointer just ended dragging.
     */
    PointerEventReceiver.prototype.isDragEnd = function (pointerId) {
        return !this.isDown(pointerId) && this.wasDown(pointerId);
    };
    PointerEventReceiver.prototype.on = function (event, handler) {
        _super.prototype.on.call(this, event, handler);
    };
    PointerEventReceiver.prototype.once = function (event, handler) {
        _super.prototype.once.call(this, event, handler);
    };
    PointerEventReceiver.prototype.off = function (event, handler) {
        _super.prototype.off.call(this, event, handler);
    };
    /**
     * Called internally by excalibur
     *
     * Updates the current frame pointer info and emits raw pointer events
     *
     * This does not emit events to entities, see PointerSystem
     */
    PointerEventReceiver.prototype.update = function () {
        this.lastFramePointerDown = new Map(this.currentFramePointerDown);
        this.lastFramePointerCoords = new Map(this.currentFramePointerCoords);
        for (var _i = 0, _a = this.currentFrameDown; _i < _a.length; _i++) {
            var event_1 = _a[_i];
            this.emit('down', event_1);
            var pointer = this.at(event_1.pointerId);
            pointer.emit('down', event_1);
            this.primary.emit('pointerdown', event_1);
        }
        for (var _b = 0, _c = this.currentFrameUp; _b < _c.length; _b++) {
            var event_2 = _c[_b];
            this.emit('up', event_2);
            var pointer = this.at(event_2.pointerId);
            pointer.emit('up', event_2);
        }
        for (var _d = 0, _e = this.currentFrameMove; _d < _e.length; _d++) {
            var event_3 = _e[_d];
            this.emit('move', event_3);
            var pointer = this.at(event_3.pointerId);
            pointer.emit('move', event_3);
        }
        for (var _f = 0, _g = this.currentFrameCancel; _f < _g.length; _f++) {
            var event_4 = _g[_f];
            this.emit('cancel', event_4);
            var pointer = this.at(event_4.pointerId);
            pointer.emit('cancel', event_4);
        }
        for (var _h = 0, _j = this.currentFrameWheel; _h < _j.length; _h++) {
            var event_5 = _j[_h];
            this.emit('wheel', event_5);
            this.primary.emit('pointerwheel', event_5);
        }
    };
    /**
     * Clears the current frame event and pointer data
     */
    PointerEventReceiver.prototype.clear = function () {
        for (var _i = 0, _a = this.currentFrameUp; _i < _a.length; _i++) {
            var event_6 = _a[_i];
            this.currentFramePointerCoords["delete"](event_6.pointerId);
            var ids = this._activeNativePointerIdsToNormalized.entries();
            for (var _b = 0, ids_1 = ids; _b < ids_1.length; _b++) {
                var _c = ids_1[_b], native = _c[0], normalized = _c[1];
                if (normalized === event_6.pointerId) {
                    this._activeNativePointerIdsToNormalized["delete"](native);
                }
            }
        }
        this.currentFrameDown.length = 0;
        this.currentFrameUp.length = 0;
        this.currentFrameMove.length = 0;
        this.currentFrameCancel.length = 0;
        this.currentFrameWheel.length = 0;
    };
    /**
     * Initializes the pointer event receiver so that it can start listening to native
     * browser events.
     */
    PointerEventReceiver.prototype.init = function () {
        // Disabling the touch action avoids browser/platform gestures from firing on the canvas
        // It is important on mobile to have touch action 'none'
        // https://stackoverflow.com/questions/48124372/pointermove-event-not-working-with-touch-why-not
        if (this.target === this.engine.canvas) {
            this.engine.canvas.style.touchAction = 'none';
        }
        else {
            document.body.style.touchAction = 'none';
        }
        // Preferred pointer events
        if (window.PointerEvent) {
            this.target.addEventListener('pointerdown', this._boundHandle);
            this.target.addEventListener('pointerup', this._boundHandle);
            this.target.addEventListener('pointermove', this._boundHandle);
            this.target.addEventListener('pointercancel', this._boundHandle);
        }
        else {
            // Touch Events
            this.target.addEventListener('touchstart', this._boundHandle);
            this.target.addEventListener('touchend', this._boundHandle);
            this.target.addEventListener('touchmove', this._boundHandle);
            this.target.addEventListener('touchcancel', this._boundHandle);
            // Mouse Events
            this.target.addEventListener('mousedown', this._boundHandle);
            this.target.addEventListener('mouseup', this._boundHandle);
            this.target.addEventListener('mousemove', this._boundHandle);
        }
        // MDN MouseWheelEvent
        var wheelOptions = {
            passive: !(this.engine.pageScrollPreventionMode === Engine_1.ScrollPreventionMode.All ||
                this.engine.pageScrollPreventionMode === Engine_1.ScrollPreventionMode.Canvas)
        };
        if ('onwheel' in document.createElement('div')) {
            // Modern Browsers
            this.target.addEventListener('wheel', this._boundWheel, wheelOptions);
        }
        else if (document.onmousewheel !== undefined) {
            // Webkit and IE
            this.target.addEventListener('mousewheel', this._boundWheel, wheelOptions);
        }
        else {
            // Remaining browser and older Firefox
            this.target.addEventListener('MozMousePixelScroll', this._boundWheel, wheelOptions);
        }
    };
    PointerEventReceiver.prototype.detach = function () {
        // Preferred pointer events
        if (window.PointerEvent) {
            this.target.removeEventListener('pointerdown', this._boundHandle);
            this.target.removeEventListener('pointerup', this._boundHandle);
            this.target.removeEventListener('pointermove', this._boundHandle);
            this.target.removeEventListener('pointercancel', this._boundHandle);
        }
        else {
            // Touch Events
            this.target.removeEventListener('touchstart', this._boundHandle);
            this.target.removeEventListener('touchend', this._boundHandle);
            this.target.removeEventListener('touchmove', this._boundHandle);
            this.target.removeEventListener('touchcancel', this._boundHandle);
            // Mouse Events
            this.target.removeEventListener('mousedown', this._boundHandle);
            this.target.removeEventListener('mouseup', this._boundHandle);
            this.target.removeEventListener('mousemove', this._boundHandle);
        }
        if ('onwheel' in document.createElement('div')) {
            // Modern Browsers
            this.target.removeEventListener('wheel', this._boundWheel);
        }
        else if (document.onmousewheel !== undefined) {
            // Webkit and IE
            this.target.addEventListener('mousewheel', this._boundWheel);
        }
        else {
            // Remaining browser and older Firefox
            this.target.addEventListener('MozMousePixelScroll', this._boundWheel);
        }
    };
    /**
     * Take native pointer id and map it to index in active pointers
     * @param nativePointerId
     */
    PointerEventReceiver.prototype._normalizePointerId = function (nativePointerId) {
        // Add to the the native pointer set id
        this._activeNativePointerIdsToNormalized.set(nativePointerId, -1);
        // Native pointer ids in ascending order
        var currentPointerIds = Array.from(this._activeNativePointerIdsToNormalized.keys()).sort(function (a, b) { return a - b; });
        // The index into sorted ids will be the new id, will always have an id
        var id = currentPointerIds.findIndex(function (p) { return p === nativePointerId; });
        // Save the mapping so we can reverse it later
        this._activeNativePointerIdsToNormalized.set(nativePointerId, id);
        // ignore pointer because game isn't watching
        return id;
    };
    /**
     * Responsible for handling and parsing pointer events
     */
    PointerEventReceiver.prototype._handle = function (ev) {
        ev.preventDefault();
        var eventCoords = new Map();
        var button;
        var pointerType;
        if (isTouchEvent(ev)) {
            button = PointerButton_1.PointerButton.Unknown;
            pointerType = PointerType_1.PointerType.Touch;
            // https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent
            for (var i = 0; i < ev.changedTouches.length; i++) {
                var touch = ev.changedTouches[i];
                var coordinates = global_coordinates_1.GlobalCoordinates.fromPagePosition(touch.pageX, touch.pageY, this.engine);
                var nativePointerId = i + 1;
                var pointerId = this._normalizePointerId(nativePointerId);
                this.currentFramePointerCoords.set(pointerId, coordinates);
                eventCoords.set(pointerId, coordinates);
            }
        }
        else {
            button = this._nativeButtonToPointerButton(ev.button);
            pointerType = PointerType_1.PointerType.Mouse;
            var coordinates = global_coordinates_1.GlobalCoordinates.fromPagePosition(ev.pageX, ev.pageY, this.engine);
            var nativePointerId = 1;
            if (isPointerEvent(ev)) {
                nativePointerId = ev.pointerId;
                pointerType = this._stringToPointerType(ev.pointerType);
            }
            var pointerId = this._normalizePointerId(nativePointerId);
            this.currentFramePointerCoords.set(pointerId, coordinates);
            eventCoords.set(pointerId, coordinates);
        }
        for (var _i = 0, _a = eventCoords.entries(); _i < _a.length; _i++) {
            var _b = _a[_i], pointerId = _b[0], coord = _b[1];
            switch (ev.type) {
                case 'mousedown':
                case 'pointerdown':
                case 'touchstart':
                    this.currentFrameDown.push(new PointerEvent_1.PointerEvent('down', pointerId, button, pointerType, coord, ev));
                    this.currentFramePointerDown.set(pointerId, true);
                    break;
                case 'mouseup':
                case 'pointerup':
                case 'touchend':
                    this.currentFrameUp.push(new PointerEvent_1.PointerEvent('up', pointerId, button, pointerType, coord, ev));
                    this.currentFramePointerDown.set(pointerId, false);
                    break;
                case 'mousemove':
                case 'pointermove':
                case 'touchmove':
                    this.currentFrameMove.push(new PointerEvent_1.PointerEvent('move', pointerId, button, pointerType, coord, ev));
                    break;
                case 'touchcancel':
                case 'pointercancel':
                    this.currentFrameCancel.push(new PointerEvent_1.PointerEvent('cancel', pointerId, button, pointerType, coord, ev));
                    break;
            }
        }
    };
    PointerEventReceiver.prototype._handleWheel = function (ev) {
        // Should we prevent page scroll because of this event
        if (this.engine.pageScrollPreventionMode === Engine_1.ScrollPreventionMode.All ||
            (this.engine.pageScrollPreventionMode === Engine_1.ScrollPreventionMode.Canvas && ev.target === this.engine.canvas)) {
            ev.preventDefault();
        }
        var screen = this.engine.screen.pageToScreenCoordinates((0, vector_1.vec)(ev.pageX, ev.pageY));
        var world = this.engine.screen.screenToWorldCoordinates(screen);
        /**
         * A constant used to normalize wheel events across different browsers
         *
         * This normalization factor is pulled from
         * https://developer.mozilla.org/en-US/docs/Web/Events/wheel#Listening_to_this_event_across_browser
         */
        var ScrollWheelNormalizationFactor = -1 / 40;
        var deltaX = ev.deltaX || ev.wheelDeltaX * ScrollWheelNormalizationFactor || 0;
        var deltaY = ev.deltaY || ev.wheelDeltaY * ScrollWheelNormalizationFactor || ev.wheelDelta * ScrollWheelNormalizationFactor || ev.detail || 0;
        var deltaZ = ev.deltaZ || 0;
        var deltaMode = WheelDeltaMode_1.WheelDeltaMode.Pixel;
        if (ev.deltaMode) {
            if (ev.deltaMode === 1) {
                deltaMode = WheelDeltaMode_1.WheelDeltaMode.Line;
            }
            else if (ev.deltaMode === 2) {
                deltaMode = WheelDeltaMode_1.WheelDeltaMode.Page;
            }
        }
        var we = new WheelEvent_1.WheelEvent(world.x, world.y, ev.pageX, ev.pageY, screen.x, screen.y, 0, deltaX, deltaY, deltaZ, deltaMode, ev);
        this.currentFrameWheel.push(we);
    };
    /**
     * Triggers an excalibur pointer event in a world space pos
     *
     * Useful for testing pointers in excalibur
     * @param type
     * @param pos
     */
    PointerEventReceiver.prototype.triggerEvent = function (type, pos) {
        var page = this.engine.screen.worldToPageCoordinates(pos);
        // Send an event to the event receiver
        if (window.PointerEvent) {
            this._handle(new window.PointerEvent('pointer' + type, {
                pointerId: 0,
                clientX: page.x,
                clientY: page.y
            }));
        }
        else {
            // Safari hack
            this._handle(new window.MouseEvent('mouse' + type, {
                clientX: page.x,
                clientY: page.y
            }));
        }
        // Force update pointer system
        var pointerSystem = this.engine.currentScene.world.systemManager.get(PointerSystem_1.PointerSystem);
        var transformEntities = this.engine.currentScene.world.queryManager.createQuery(pointerSystem.types);
        pointerSystem.preupdate();
        pointerSystem.update(transformEntities.getEntities());
    };
    PointerEventReceiver.prototype._nativeButtonToPointerButton = function (s) {
        switch (s) {
            case NativePointerButton_1.NativePointerButton.NoButton:
                return PointerButton_1.PointerButton.NoButton;
            case NativePointerButton_1.NativePointerButton.Left:
                return PointerButton_1.PointerButton.Left;
            case NativePointerButton_1.NativePointerButton.Middle:
                return PointerButton_1.PointerButton.Middle;
            case NativePointerButton_1.NativePointerButton.Right:
                return PointerButton_1.PointerButton.Right;
            case NativePointerButton_1.NativePointerButton.Unknown:
                return PointerButton_1.PointerButton.Unknown;
            default:
                return (0, Util_1.fail)(s);
        }
    };
    PointerEventReceiver.prototype._stringToPointerType = function (s) {
        switch (s) {
            case 'touch':
                return PointerType_1.PointerType.Touch;
            case 'mouse':
                return PointerType_1.PointerType.Mouse;
            case 'pen':
                return PointerType_1.PointerType.Pen;
            default:
                return PointerType_1.PointerType.Unknown;
        }
    };
    return PointerEventReceiver;
}(Class_1.Class));
exports.PointerEventReceiver = PointerEventReceiver;
