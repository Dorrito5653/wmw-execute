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
exports.Keyboard = exports.KeyEvent = exports.Keys = void 0;
var Log_1 = require("../Util/Log");
var Class_1 = require("../Class");
var Events = require("../Events");
/**
 * Enum representing physical input key codes
 */
var Keys;
(function (Keys) {
    // NUMPAD
    Keys["Num0"] = "Numpad0";
    Keys["Num1"] = "Numpad1";
    Keys["Num2"] = "Numpad2";
    Keys["Num3"] = "Numpad3";
    Keys["Num4"] = "Numpad4";
    Keys["Num5"] = "Numpad5";
    Keys["Num6"] = "Numpad6";
    Keys["Num7"] = "Numpad7";
    Keys["Num8"] = "Numpad8";
    Keys["Num9"] = "Numpad9";
    Keys["NumAdd"] = "NumpadAdd";
    Keys["NumSubtract"] = "NumpadSubtract";
    Keys["NumMultiply"] = "NumpadMultiply";
    Keys["NumDivide"] = "NumpadDivide";
    // NumComma = 'NumpadComma', // not x-browser
    Keys["NumDecimal"] = "NumpadDecimal";
    Keys["Numpad0"] = "Numpad0";
    Keys["Numpad1"] = "Numpad1";
    Keys["Numpad2"] = "Numpad2";
    Keys["Numpad3"] = "Numpad3";
    Keys["Numpad4"] = "Numpad4";
    Keys["Numpad5"] = "Numpad5";
    Keys["Numpad6"] = "Numpad6";
    Keys["Numpad7"] = "Numpad7";
    Keys["Numpad8"] = "Numpad8";
    Keys["Numpad9"] = "Numpad9";
    Keys["NumpadAdd"] = "NumpadAdd";
    Keys["NumpadSubtract"] = "NumpadSubtract";
    Keys["NumpadMultiply"] = "NumpadMultiply";
    Keys["NumpadDivide"] = "NumpadDivide";
    // NumpadComma = 'NumpadComma', // not x-browser
    Keys["NumpadDecimal"] = "NumpadDecimal";
    // MODIFIERS
    Keys["NumLock"] = "NumLock";
    Keys["ShiftLeft"] = "ShiftLeft";
    Keys["ShiftRight"] = "ShiftRight";
    Keys["AltLeft"] = "AltLeft";
    Keys["AltRight"] = "AltRight";
    Keys["ControlLeft"] = "ControlLeft";
    Keys["ControlRight"] = "ControlRight";
    Keys["MetaLeft"] = "MetaLeft";
    Keys["MetaRight"] = "MetaRight";
    // NUMBERS
    Keys["Key0"] = "Digit0";
    Keys["Key1"] = "Digit1";
    Keys["Key2"] = "Digit2";
    Keys["Key3"] = "Digit3";
    Keys["Key4"] = "Digit4";
    Keys["Key5"] = "Digit5";
    Keys["Key6"] = "Digit6";
    Keys["Key7"] = "Digit7";
    Keys["Key8"] = "Digit8";
    Keys["Key9"] = "Digit9";
    Keys["Digit0"] = "Digit0";
    Keys["Digit1"] = "Digit1";
    Keys["Digit2"] = "Digit2";
    Keys["Digit3"] = "Digit3";
    Keys["Digit4"] = "Digit4";
    Keys["Digit5"] = "Digit5";
    Keys["Digit6"] = "Digit6";
    Keys["Digit7"] = "Digit7";
    Keys["Digit8"] = "Digit8";
    Keys["Digit9"] = "Digit9";
    // FUNCTION KEYS
    Keys["F1"] = "F1";
    Keys["F2"] = "F2";
    Keys["F3"] = "F3";
    Keys["F4"] = "F4";
    Keys["F5"] = "F5";
    Keys["F6"] = "F6";
    Keys["F7"] = "F7";
    Keys["F8"] = "F8";
    Keys["F9"] = "F9";
    Keys["F10"] = "F10";
    Keys["F11"] = "F11";
    Keys["F12"] = "F12";
    // LETTERS
    Keys["A"] = "KeyA";
    Keys["B"] = "KeyB";
    Keys["C"] = "KeyC";
    Keys["D"] = "KeyD";
    Keys["E"] = "KeyE";
    Keys["F"] = "KeyF";
    Keys["G"] = "KeyG";
    Keys["H"] = "KeyH";
    Keys["I"] = "KeyI";
    Keys["J"] = "KeyJ";
    Keys["K"] = "KeyK";
    Keys["L"] = "KeyL";
    Keys["M"] = "KeyM";
    Keys["N"] = "KeyN";
    Keys["O"] = "KeyO";
    Keys["P"] = "KeyP";
    Keys["Q"] = "KeyQ";
    Keys["R"] = "KeyR";
    Keys["S"] = "KeyS";
    Keys["T"] = "KeyT";
    Keys["U"] = "KeyU";
    Keys["V"] = "KeyV";
    Keys["W"] = "KeyW";
    Keys["X"] = "KeyX";
    Keys["Y"] = "KeyY";
    Keys["Z"] = "KeyZ";
    Keys["KeyA"] = "KeyA";
    Keys["KeyB"] = "KeyB";
    Keys["KeyC"] = "KeyC";
    Keys["KeyD"] = "KeyD";
    Keys["KeyE"] = "KeyE";
    Keys["KeyF"] = "KeyF";
    Keys["KeyG"] = "KeyG";
    Keys["KeyH"] = "KeyH";
    Keys["KeyI"] = "KeyI";
    Keys["KeyJ"] = "KeyJ";
    Keys["KeyK"] = "KeyK";
    Keys["KeyL"] = "KeyL";
    Keys["KeyM"] = "KeyM";
    Keys["KeyN"] = "KeyN";
    Keys["KeyO"] = "KeyO";
    Keys["KeyP"] = "KeyP";
    Keys["KeyQ"] = "KeyQ";
    Keys["KeyR"] = "KeyR";
    Keys["KeyS"] = "KeyS";
    Keys["KeyT"] = "KeyT";
    Keys["KeyU"] = "KeyU";
    Keys["KeyV"] = "KeyV";
    Keys["KeyW"] = "KeyW";
    Keys["KeyX"] = "KeyX";
    Keys["KeyY"] = "KeyY";
    Keys["KeyZ"] = "KeyZ";
    // SYMBOLS
    Keys["Semicolon"] = "Semicolon";
    Keys["Quote"] = "Quote";
    Keys["Comma"] = "Comma";
    Keys["Minus"] = "Minus";
    Keys["Period"] = "Period";
    Keys["Slash"] = "Slash";
    Keys["Equal"] = "Equal";
    Keys["BracketLeft"] = "BracketLeft";
    Keys["Backslash"] = "Backslash";
    Keys["BracketRight"] = "BracketRight";
    Keys["Backquote"] = "Backquote";
    // DIRECTIONS
    Keys["Up"] = "ArrowUp";
    Keys["Down"] = "ArrowDown";
    Keys["Left"] = "ArrowLeft";
    Keys["Right"] = "ArrowRight";
    Keys["ArrowUp"] = "ArrowUp";
    Keys["ArrowDown"] = "ArrowDown";
    Keys["ArrowLeft"] = "ArrowLeft";
    Keys["ArrowRight"] = "ArrowRight";
    // OTHER
    Keys["Space"] = "Space";
    Keys["Backspace"] = "Backspace";
    Keys["Delete"] = "Delete";
    Keys["Esc"] = "Escape";
    Keys["Escape"] = "Escape";
    Keys["Enter"] = "Enter";
    Keys["NumpadEnter"] = "NumpadEnter";
    Keys["ContextMenu"] = "ContextMenu";
})(Keys = exports.Keys || (exports.Keys = {}));
/**
 * Event thrown on a game object for a key event
 */
var KeyEvent = /** @class */ (function (_super) {
    __extends(KeyEvent, _super);
    /**
     * @param key  The key responsible for throwing the event
     * @param value The key's typed value the browser detected
     * @param originalEvent The original keyboard event that Excalibur handled
     */
    function KeyEvent(key, value, originalEvent) {
        var _this = _super.call(this) || this;
        _this.key = key;
        _this.value = value;
        _this.originalEvent = originalEvent;
        return _this;
    }
    return KeyEvent;
}(Events.GameEvent));
exports.KeyEvent = KeyEvent;
/**
 * Provides keyboard support for Excalibur.
 */
var Keyboard = /** @class */ (function (_super) {
    __extends(Keyboard, _super);
    function Keyboard() {
        var _this = _super.call(this) || this;
        _this._keys = [];
        _this._keysUp = [];
        _this._keysDown = [];
        _this._handleKeyDown = function (ev) {
            var code = ev.code;
            if (_this._keys.indexOf(code) === -1) {
                _this._keys.push(code);
                _this._keysDown.push(code);
                var keyEvent = new KeyEvent(code, ev.key, ev);
                _this.eventDispatcher.emit('down', keyEvent);
                _this.eventDispatcher.emit('press', keyEvent);
            }
        };
        _this._handleKeyUp = function (ev) {
            var code = ev.code;
            var key = _this._keys.indexOf(code);
            _this._keys.splice(key, 1);
            _this._keysUp.push(code);
            var keyEvent = new KeyEvent(code, ev.key, ev);
            // alias the old api, we may want to deprecate this in the future
            _this.eventDispatcher.emit('up', keyEvent);
            _this.eventDispatcher.emit('release', keyEvent);
        };
        return _this;
    }
    Keyboard.prototype.on = function (eventName, handler) {
        _super.prototype.on.call(this, eventName, handler);
    };
    /**
     * Initialize Keyboard event listeners
     */
    Keyboard.prototype.init = function (global) {
        var _this = this;
        if (!global) {
            try {
                // Try and listen to events on top window frame if within an iframe.
                //
                // See https://github.com/excaliburjs/Excalibur/issues/1294
                //
                // Attempt to add an event listener, which triggers a DOMException on
                // cross-origin iframes
                var noop = function () {
                    return;
                };
                window.top.addEventListener('blur', noop);
                window.top.removeEventListener('blur', noop);
                // this will be the same as window if not embedded within an iframe
                global = window.top;
            }
            catch (_a) {
                // fallback to current frame
                global = window;
                Log_1.Logger.getInstance().warn('Failed to bind to keyboard events to top frame. ' +
                    'If you are trying to embed Excalibur in a cross-origin iframe, keyboard events will not fire.');
            }
        }
        global.addEventListener('blur', function () {
            _this._keys.length = 0; // empties array efficiently
        });
        // key up is on window because canvas cannot have focus
        global.addEventListener('keyup', this._handleKeyUp);
        // key down is on window because canvas cannot have focus
        global.addEventListener('keydown', this._handleKeyDown);
    };
    Keyboard.prototype.update = function () {
        // Reset keysDown and keysUp after update is complete
        this._keysDown.length = 0;
        this._keysUp.length = 0;
        // Emit synthetic "hold" event
        for (var i = 0; i < this._keys.length; i++) {
            this.eventDispatcher.emit('hold', new KeyEvent(this._keys[i]));
        }
    };
    /**
     * Gets list of keys being pressed down
     */
    Keyboard.prototype.getKeys = function () {
        return this._keys;
    };
    /**
     * Tests if a certain key was just pressed this frame. This is cleared at the end of the update frame.
     * @param key Test whether a key was just pressed
     */
    Keyboard.prototype.wasPressed = function (key) {
        return this._keysDown.indexOf(key) > -1;
    };
    /**
     * Tests if a certain key is held down. This is persisted between frames.
     * @param key  Test whether a key is held down
     */
    Keyboard.prototype.isHeld = function (key) {
        return this._keys.indexOf(key) > -1;
    };
    /**
     * Tests if a certain key was just released this frame. This is cleared at the end of the update frame.
     * @param key  Test whether a key was just released
     */
    Keyboard.prototype.wasReleased = function (key) {
        return this._keysUp.indexOf(key) > -1;
    };
    /**
     * Trigger a manual key event
     * @param type
     * @param key
     * @param character
     */
    Keyboard.prototype.triggerEvent = function (type, key, character) {
        if (type === 'down') {
            this._handleKeyDown(new KeyboardEvent('keydown', {
                code: key,
                key: character !== null && character !== void 0 ? character : null
            }));
        }
        if (type === 'up') {
            this._handleKeyUp(new KeyboardEvent('keyup', {
                code: key,
                key: character !== null && character !== void 0 ? character : null
            }));
        }
    };
    return Keyboard;
}(Class_1.Class));
exports.Keyboard = Keyboard;
