"use strict";
exports.__esModule = true;
exports.Toaster = void 0;
var Toaster_css_1 = require("./Toaster.css");
/**
 * The Toaster is only meant to be called from inside Excalibur to display messages to players
 */
var Toaster = /** @class */ (function () {
    function Toaster() {
        this._toasterCss = Toaster_css_1["default"].toString();
        this._isInitialized = false;
    }
    Toaster.prototype._initialize = function () {
        if (!this._isInitialized) {
            this._container = document.createElement('div');
            this._container.id = 'ex-toast-container';
            document.body.appendChild(this._container);
            this._isInitialized = true;
            this._styleBlock = document.createElement('style');
            this._styleBlock.textContent = this._toasterCss;
            document.head.appendChild(this._styleBlock);
        }
    };
    Toaster.prototype.dispose = function () {
        this._container.parentElement.removeChild(this._container);
        this._styleBlock.parentElement.removeChild(this._styleBlock);
        this._isInitialized = false;
    };
    Toaster.prototype._createFragment = function (message) {
        var toastMessage = document.createElement('span');
        toastMessage.innerText = message;
        return toastMessage;
    };
    /**
     * Display a toast message to a player
     * @param message Text of the message, messages may have a single "[LINK]" to influence placement
     * @param linkTarget Optionally specify a link location
     * @param linkName Optionally specify a name for that link location
     */
    Toaster.prototype.toast = function (message, linkTarget, linkName) {
        var _this = this;
        this._initialize();
        var toast = document.createElement('div');
        toast.className = 'ex-toast-message';
        var messageFragments = message.split('[LINK]').map(function (message) { return _this._createFragment(message); });
        if (linkTarget) {
            var link = document.createElement('a');
            link.href = linkTarget;
            if (linkName) {
                link.innerText = linkName;
            }
            else {
                link.innerText = linkTarget;
            }
            messageFragments.splice(1, 0, link);
        }
        // Assembly message
        var finalMessage = document.createElement('div');
        messageFragments.forEach(function (message) {
            finalMessage.appendChild(message);
        });
        toast.appendChild(finalMessage);
        // Dismiss button
        var dismissBtn = document.createElement('button');
        dismissBtn.innerText = 'x';
        dismissBtn.addEventListener('click', function () {
            _this._container.removeChild(toast);
        });
        toast.appendChild(dismissBtn);
        // Escape to dismiss
        var keydownHandler = function (evt) {
            if (evt.key === 'Escape') {
                try {
                    _this._container.removeChild(toast);
                }
                catch (_a) {
                    // pass
                }
            }
            document.removeEventListener('keydown', keydownHandler);
        };
        document.addEventListener('keydown', keydownHandler);
        // Insert into container
        var first = this._container.firstChild;
        this._container.insertBefore(toast, first);
    };
    return Toaster;
}());
exports.Toaster = Toaster;
