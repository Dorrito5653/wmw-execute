"use strict";
exports.__esModule = true;
exports.Transform = void 0;
var affine_matrix_1 = require("./affine-matrix");
var util_1 = require("./util");
var vector_1 = require("./vector");
var vector_view_1 = require("./vector-view");
var watch_vector_1 = require("./watch-vector");
var Transform = /** @class */ (function () {
    function Transform() {
        this._parent = null;
        this._children = [];
        this._pos = (0, vector_1.vec)(0, 0);
        this._rotation = 0;
        this._scale = (0, vector_1.vec)(1, 1);
        this._isDirty = false;
        this._isInverseDirty = false;
        this._matrix = affine_matrix_1.AffineMatrix.identity();
        this._inverse = affine_matrix_1.AffineMatrix.identity();
    }
    Object.defineProperty(Transform.prototype, "parent", {
        get: function () {
            return this._parent;
        },
        set: function (transform) {
            if (this._parent) {
                var index = this._parent._children.indexOf(this);
                if (index > -1) {
                    this._parent._children.splice(index, 1);
                }
            }
            this._parent = transform;
            if (this._parent) {
                this._parent._children.push(this);
            }
            this.flagDirty();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Transform.prototype, "children", {
        get: function () {
            return this._children;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Transform.prototype, "pos", {
        get: function () {
            var _this = this;
            return new watch_vector_1.WatchVector(this._pos, function (x, y) {
                if (x !== _this._pos.x || y !== _this._pos.y) {
                    _this.flagDirty();
                }
            });
        },
        set: function (v) {
            if (!v.equals(this._pos)) {
                this._pos.x = v.x;
                this._pos.y = v.y;
                this.flagDirty();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Transform.prototype, "globalPos", {
        get: function () {
            var _this = this;
            return new vector_view_1.VectorView({
                getX: function () { return _this.matrix.data[4]; },
                getY: function () { return _this.matrix.data[5]; },
                setX: function (x) {
                    if (_this.parent) {
                        var newX = _this.parent.inverse.multiply((0, vector_1.vec)(x, _this.pos.y)).x;
                        _this.pos.x = newX;
                    }
                    else {
                        _this.pos.x = x;
                    }
                    if (x !== _this.matrix.data[4]) {
                        _this.flagDirty();
                    }
                },
                setY: function (y) {
                    if (_this.parent) {
                        var newY = _this.parent.inverse.multiply((0, vector_1.vec)(_this.pos.x, y)).y;
                        _this.pos.y = newY;
                    }
                    else {
                        _this.pos.y = y;
                    }
                    if (y !== _this.matrix.data[5]) {
                        _this.flagDirty();
                    }
                }
            });
        },
        set: function (v) {
            var localPos = v.clone();
            if (this.parent) {
                localPos = this.parent.inverse.multiply(v);
            }
            if (!localPos.equals(this._pos)) {
                this._pos = localPos;
                this.flagDirty();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Transform.prototype, "rotation", {
        get: function () {
            return this._rotation;
        },
        set: function (rotation) {
            var canonRotation = (0, util_1.canonicalizeAngle)(rotation);
            if (canonRotation !== this._rotation) {
                this.flagDirty();
            }
            this._rotation = canonRotation;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Transform.prototype, "globalRotation", {
        get: function () {
            if (this.parent) {
                return this.matrix.getRotation();
            }
            return this.rotation;
        },
        set: function (rotation) {
            var inverseRotation = 0;
            if (this.parent) {
                inverseRotation = this.parent.globalRotation;
            }
            var canonRotation = (0, util_1.canonicalizeAngle)(rotation + inverseRotation);
            if (canonRotation !== this._rotation) {
                this.flagDirty();
            }
            this._rotation = canonRotation;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Transform.prototype, "scale", {
        get: function () {
            var _this = this;
            return new watch_vector_1.WatchVector(this._scale, function (x, y) {
                if (x !== _this._scale.x || y !== _this._scale.y) {
                    _this.flagDirty();
                }
            });
        },
        set: function (v) {
            if (!v.equals(this._scale)) {
                this._scale.x = v.x;
                this._scale.y = v.y;
                this.flagDirty();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Transform.prototype, "globalScale", {
        get: function () {
            var _this = this;
            return new vector_view_1.VectorView({
                getX: function () { return _this.parent ? _this.matrix.getScaleX() : _this.scale.x; },
                getY: function () { return _this.parent ? _this.matrix.getScaleY() : _this.scale.y; },
                setX: function (x) {
                    if (_this.parent) {
                        var globalScaleX = _this.parent.globalScale.x;
                        _this.scale.x = x / globalScaleX;
                    }
                    else {
                        _this.scale.x = x;
                    }
                },
                setY: function (y) {
                    if (_this.parent) {
                        var globalScaleY = _this.parent.globalScale.y;
                        _this.scale.y = y / globalScaleY;
                    }
                    else {
                        _this.scale.y = y;
                    }
                }
            });
        },
        set: function (v) {
            var inverseScale = (0, vector_1.vec)(1, 1);
            if (this.parent) {
                inverseScale = this.parent.globalScale;
            }
            this.scale = v.scale((0, vector_1.vec)(1 / inverseScale.x, 1 / inverseScale.y));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Transform.prototype, "matrix", {
        get: function () {
            if (this._isDirty) {
                if (this.parent === null) {
                    this._matrix = this._calculateMatrix();
                }
                else {
                    this._matrix = this.parent.matrix.multiply(this._calculateMatrix());
                }
                this._isDirty = false;
            }
            return this._matrix;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Transform.prototype, "inverse", {
        get: function () {
            if (this._isInverseDirty) {
                this._inverse = this.matrix.inverse();
                this._isInverseDirty = false;
            }
            return this._inverse;
        },
        enumerable: false,
        configurable: true
    });
    Transform.prototype._calculateMatrix = function () {
        var matrix = affine_matrix_1.AffineMatrix.identity()
            .translate(this.pos.x, this.pos.y)
            .rotate(this.rotation)
            .scale(this.scale.x, this.scale.y);
        return matrix;
    };
    Transform.prototype.flagDirty = function () {
        this._isDirty = true;
        this._isInverseDirty = true;
        for (var i = 0; i < this._children.length; i++) {
            this._children[i].flagDirty();
        }
    };
    Transform.prototype.apply = function (point) {
        return this.matrix.multiply(point);
    };
    Transform.prototype.applyInverse = function (point) {
        return this.inverse.multiply(point);
    };
    Transform.prototype.setTransform = function (pos, rotation, scale) {
        this._pos.x = pos.x;
        this._pos.y = pos.y;
        this._rotation = (0, util_1.canonicalizeAngle)(rotation);
        this._scale.x = scale.x;
        this._scale.y = scale.y;
        this.flagDirty();
    };
    Transform.prototype.clone = function (dest) {
        var target = dest !== null && dest !== void 0 ? dest : new Transform();
        this._pos.clone(target._pos);
        target._rotation = this._rotation;
        this._scale.clone(target._scale);
        target.flagDirty();
    };
    return Transform;
}());
exports.Transform = Transform;
