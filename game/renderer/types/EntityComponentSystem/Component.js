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
exports.TagComponent = exports.Component = void 0;
/**
 * Type guard to check if a component implements clone
 * @param x
 */
function hasClone(x) {
    return !!(x === null || x === void 0 ? void 0 : x.clone);
}
/**
 * Components are containers for state in Excalibur, the are meant to convey capabilities that an Entity possesses
 *
 * Implementations of Component must have a zero-arg constructor to support dependencies
 *
 * ```typescript
 * class MyComponent extends ex.Component<'my'> {
 *   public readonly type = 'my';
 *   // zero arg support required if you want to use component dependencies
 *   constructor(public optionalPos?: ex.Vector) {}
 * }
 * ```
 */
var Component = /** @class */ (function () {
    function Component() {
        /**
         * Current owning [[Entity]], if any, of this component. Null if not added to any [[Entity]]
         */
        this.owner = null;
    }
    /**
     * Clones any properties on this component, if that property value has a `clone()` method it will be called
     */
    Component.prototype.clone = function () {
        var newComponent = new this.constructor();
        for (var prop in this) {
            if (this.hasOwnProperty(prop)) {
                var val = this[prop];
                if (hasClone(val) && prop !== 'owner' && prop !== 'clone') {
                    newComponent[prop] = val.clone();
                }
                else {
                    newComponent[prop] = val;
                }
            }
        }
        return newComponent;
    };
    return Component;
}());
exports.Component = Component;
/**
 * Tag components are a way of tagging a component with label and a simple value
 *
 * For example:
 *
 * ```typescript
 * const isOffscreen = new TagComponent('offscreen');
 * entity.addComponent(isOffscreen);
 * entity.tags.includes
 * ```
 */
var TagComponent = /** @class */ (function (_super) {
    __extends(TagComponent, _super);
    function TagComponent(type, value) {
        var _this = _super.call(this) || this;
        _this.type = type;
        _this.value = value;
        return _this;
    }
    return TagComponent;
}(Component));
exports.TagComponent = TagComponent;
