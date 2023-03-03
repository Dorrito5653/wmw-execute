"use strict";
exports.__esModule = true;
exports.watchAny = exports.watch = void 0;
/**
 * Watch an object with a proxy, only fires if property value is different
 */
function watch(type, change) {
    if (!type) {
        return type;
    }
    if (type.__isProxy === undefined) {
        // expando hack to mark a proxy
        return new Proxy(type, {
            set: function (obj, prop, value) {
                // The default behavior to store the value
                if (obj[prop] !== value) {
                    obj[prop] = value;
                    // Avoid watching private junk
                    if (typeof prop === 'string') {
                        if (prop[0] !== '_') {
                            change(obj);
                        }
                    }
                }
                // Indicate success
                return true;
            },
            get: function (obj, prop) {
                if (prop !== '__isProxy') {
                    return obj[prop];
                }
                return true;
            }
        });
    }
    return type;
}
exports.watch = watch;
/**
 * Watch an object with a proxy, fires change on any property value change
 */
function watchAny(type, change) {
    if (!type) {
        return type;
    }
    if (type.__isProxy === undefined) {
        // expando hack to mark a proxy
        return new Proxy(type, {
            set: function (obj, prop, value) {
                // The default behavior to store the value
                obj[prop] = value;
                // Avoid watching private junk
                if (typeof prop === 'string') {
                    if (prop[0] !== '_') {
                        change(obj);
                    }
                }
                // Indicate success
                return true;
            },
            get: function (obj, prop) {
                if (prop !== '__isProxy') {
                    return obj[prop];
                }
                return true;
            }
        });
    }
    return type;
}
exports.watchAny = watchAny;
