"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.ParseGif = exports.Stream = exports.Gif = void 0;
var Resource_1 = require("./Resource");
var Color_1 = require("../Color");
var SpriteSheet_1 = require("../Graphics/SpriteSheet");
var Animation_1 = require("../Graphics/Animation");
var ImageSource_1 = require("../Graphics/ImageSource");
var util_1 = require("../Math/util");
/**
 * The [[Texture]] object allows games built in Excalibur to load image resources.
 * [[Texture]] is an [[Loadable]] which means it can be passed to a [[Loader]]
 * to pre-load before starting a level or game.
 */
var Gif = /** @class */ (function () {
    /**
     * @param path       Path to the image resource
     * @param color      Optionally set the color to treat as transparent the gif, by default [[Color.Magenta]]
     * @param bustCache  Optionally load texture with cache busting
     */
    function Gif(path, color, bustCache) {
        if (color === void 0) { color = Color_1.Color.Magenta; }
        if (bustCache === void 0) { bustCache = true; }
        this.path = path;
        this.color = color;
        this.bustCache = bustCache;
        this._stream = null;
        this._gif = null;
        this._textures = [];
        this._animation = null;
        this._transparentColor = null;
        this._resource = new Resource_1.Resource(path, 'arraybuffer', bustCache);
        this._transparentColor = color;
    }
    /**
     * Begins loading the texture and returns a promise to be resolved on completion
     */
    Gif.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            var arraybuffer, images;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._resource.load()];
                    case 1:
                        arraybuffer = _a.sent();
                        this._stream = new Stream(arraybuffer);
                        this._gif = new ParseGif(this._stream, this._transparentColor);
                        images = this._gif.images.map(function (i) { return new ImageSource_1.ImageSource(i.src, false); });
                        // Load all textures
                        return [4 /*yield*/, Promise.all(images.map(function (t) { return t.load(); }))];
                    case 2:
                        // Load all textures
                        _a.sent();
                        return [2 /*return*/, this.data = this._textures = images];
                }
            });
        });
    };
    Gif.prototype.isLoaded = function () {
        return !!this.data;
    };
    /**
     * Return a frame of the gif as a sprite by id
     * @param id
     */
    Gif.prototype.toSprite = function (id) {
        if (id === void 0) { id = 0; }
        var sprite = this._textures[id].toSprite();
        return sprite;
    };
    /**
     * Return the gif as a spritesheet
     */
    Gif.prototype.toSpriteSheet = function () {
        var sprites = this._textures.map(function (image) {
            return image.toSprite();
        });
        return new SpriteSheet_1.SpriteSheet({ sprites: sprites });
    };
    /**
     * Transform the GIF into an animation with duration per frame
     */
    Gif.prototype.toAnimation = function (durationPerFrameMs) {
        var spriteSheet = this.toSpriteSheet();
        var length = spriteSheet.sprites.length;
        this._animation = Animation_1.Animation.fromSpriteSheet(spriteSheet, (0, util_1.range)(0, length), durationPerFrameMs);
        return this._animation;
    };
    Object.defineProperty(Gif.prototype, "readCheckBytes", {
        get: function () {
            return this._gif.checkBytes;
        },
        enumerable: false,
        configurable: true
    });
    return Gif;
}());
exports.Gif = Gif;
var bitsToNum = function (ba) {
    return ba.reduce(function (s, n) {
        return s * 2 + n;
    }, 0);
};
var byteToBitArr = function (bite) {
    var a = [];
    for (var i = 7; i >= 0; i--) {
        a.push(!!(bite & (1 << i)));
    }
    return a;
};
var Stream = /** @class */ (function () {
    function Stream(dataArray) {
        var _this = this;
        this.data = null;
        this.len = 0;
        this.position = 0;
        this.readByte = function () {
            if (_this.position >= _this.data.byteLength) {
                throw new Error('Attempted to read past end of stream.');
            }
            return _this.data[_this.position++];
        };
        this.readBytes = function (n) {
            var bytes = [];
            for (var i = 0; i < n; i++) {
                bytes.push(_this.readByte());
            }
            return bytes;
        };
        this.read = function (n) {
            var s = '';
            for (var i = 0; i < n; i++) {
                s += String.fromCharCode(_this.readByte());
            }
            return s;
        };
        this.readUnsigned = function () {
            // Little-endian.
            var a = _this.readBytes(2);
            return (a[1] << 8) + a[0];
        };
        this.data = new Uint8Array(dataArray);
        this.len = this.data.byteLength;
        if (this.len === 0) {
            throw new Error('No data loaded from file');
        }
    }
    return Stream;
}());
exports.Stream = Stream;
var lzwDecode = function (minCodeSize, data) {
    // TODO: Now that the GIF parser is a bit different, maybe this should get an array of bytes instead of a String?
    var pos = 0; // Maybe this streaming thing should be merged with the Stream?
    var readCode = function (size) {
        var code = 0;
        for (var i = 0; i < size; i++) {
            if (data.charCodeAt(pos >> 3) & (1 << (pos & 7))) {
                code |= 1 << i;
            }
            pos++;
        }
        return code;
    };
    var output = [];
    var clearCode = 1 << minCodeSize;
    var eoiCode = clearCode + 1;
    var codeSize = minCodeSize + 1;
    var dict = [];
    var clear = function () {
        dict = [];
        codeSize = minCodeSize + 1;
        for (var i = 0; i < clearCode; i++) {
            dict[i] = [i];
        }
        dict[clearCode] = [];
        dict[eoiCode] = null;
    };
    var code;
    var last;
    while (true) {
        last = code;
        code = readCode(codeSize);
        if (code === clearCode) {
            clear();
            continue;
        }
        if (code === eoiCode) {
            break;
        }
        if (code < dict.length) {
            if (last !== clearCode) {
                dict.push(dict[last].concat(dict[code][0]));
            }
        }
        else {
            if (code !== dict.length) {
                throw new Error('Invalid LZW code.');
            }
            dict.push(dict[last].concat(dict[last][0]));
        }
        output.push.apply(output, dict[code]);
        if (dict.length === 1 << codeSize && codeSize < 12) {
            // If we're at the last code and codeSize is 12, the next code will be a clearCode, and it'll be 12 bits long.
            codeSize++;
        }
    }
    // I don't know if this is technically an error, but some GIFs do it.
    //if (Math.ceil(pos / 8) !== data.length) throw new Error('Extraneous LZW bytes.');
    return output;
};
// The actual parsing; returns an object with properties.
var ParseGif = /** @class */ (function () {
    function ParseGif(stream, color) {
        if (color === void 0) { color = Color_1.Color.Magenta; }
        var _this = this;
        this._st = null;
        this._handler = {};
        this._transparentColor = null;
        this.frames = [];
        this.images = [];
        this.globalColorTable = [];
        this.checkBytes = [];
        // LZW (GIF-specific)
        this.parseColorTable = function (entries) {
            // Each entry is 3 bytes, for RGB.
            var ct = [];
            for (var i = 0; i < entries; i++) {
                var rgb = _this._st.readBytes(3);
                var rgba = '#' +
                    rgb
                        .map(function (x) {
                        var hex = x.toString(16);
                        return hex.length === 1 ? '0' + hex : hex;
                    })
                        .join('');
                ct.push(rgba);
            }
            return ct;
        };
        this.readSubBlocks = function () {
            var size, data;
            data = '';
            do {
                size = _this._st.readByte();
                data += _this._st.read(size);
            } while (size !== 0);
            return data;
        };
        this.parseHeader = function () {
            var hdr = {
                sig: null,
                ver: null,
                width: null,
                height: null,
                colorRes: null,
                globalColorTableSize: null,
                gctFlag: null,
                sorted: null,
                globalColorTable: [],
                bgColor: null,
                pixelAspectRatio: null // if not 0, aspectRatio = (pixelAspectRatio + 15) / 64
            };
            hdr.sig = _this._st.read(3);
            hdr.ver = _this._st.read(3);
            if (hdr.sig !== 'GIF') {
                throw new Error('Not a GIF file.'); // XXX: This should probably be handled more nicely.
            }
            hdr.width = _this._st.readUnsigned();
            hdr.height = _this._st.readUnsigned();
            var bits = byteToBitArr(_this._st.readByte());
            hdr.gctFlag = bits.shift();
            hdr.colorRes = bitsToNum(bits.splice(0, 3));
            hdr.sorted = bits.shift();
            hdr.globalColorTableSize = bitsToNum(bits.splice(0, 3));
            hdr.bgColor = _this._st.readByte();
            hdr.pixelAspectRatio = _this._st.readByte(); // if not 0, aspectRatio = (pixelAspectRatio + 15) / 64
            if (hdr.gctFlag) {
                hdr.globalColorTable = _this.parseColorTable(1 << (hdr.globalColorTableSize + 1));
                _this.globalColorTable = hdr.globalColorTable;
            }
            if (_this._handler.hdr && _this._handler.hdr(hdr)) {
                _this.checkBytes.push(_this._handler.hdr);
            }
        };
        this.parseExt = function (block) {
            var parseGCExt = function (block) {
                _this.checkBytes.push(_this._st.readByte()); // Always 4
                var bits = byteToBitArr(_this._st.readByte());
                block.reserved = bits.splice(0, 3); // Reserved; should be 000.
                block.disposalMethod = bitsToNum(bits.splice(0, 3));
                block.userInput = bits.shift();
                block.transparencyGiven = bits.shift();
                block.delayTime = _this._st.readUnsigned();
                block.transparencyIndex = _this._st.readByte();
                block.terminator = _this._st.readByte();
                if (_this._handler.gce && _this._handler.gce(block)) {
                    _this.checkBytes.push(_this._handler.gce);
                }
            };
            var parseComExt = function (block) {
                block.comment = _this.readSubBlocks();
                if (_this._handler.com && _this._handler.com(block)) {
                    _this.checkBytes.push(_this._handler.com);
                }
            };
            var parsePTExt = function (block) {
                _this.checkBytes.push(_this._st.readByte()); // Always 12
                block.ptHeader = _this._st.readBytes(12);
                block.ptData = _this.readSubBlocks();
                if (_this._handler.pte && _this._handler.pte(block)) {
                    _this.checkBytes.push(_this._handler.pte);
                }
            };
            var parseAppExt = function (block) {
                var parseNetscapeExt = function (block) {
                    _this.checkBytes.push(_this._st.readByte()); // Always 3
                    block.unknown = _this._st.readByte(); // Q: Always 1? What is this?
                    block.iterations = _this._st.readUnsigned();
                    block.terminator = _this._st.readByte();
                    if (_this._handler.app && _this._handler.app.NETSCAPE && _this._handler.app.NETSCAPE(block)) {
                        _this.checkBytes.push(_this._handler.app);
                    }
                };
                var parseUnknownAppExt = function (block) {
                    block.appData = _this.readSubBlocks();
                    // FIXME: This won't work if a handler wants to match on any identifier.
                    if (_this._handler.app && _this._handler.app[block.identifier] && _this._handler.app[block.identifier](block)) {
                        _this.checkBytes.push(_this._handler.app[block.identifier]);
                    }
                };
                _this.checkBytes.push(_this._st.readByte()); // Always 11
                block.identifier = _this._st.read(8);
                block.authCode = _this._st.read(3);
                switch (block.identifier) {
                    case 'NETSCAPE':
                        parseNetscapeExt(block);
                        break;
                    default:
                        parseUnknownAppExt(block);
                        break;
                }
            };
            var parseUnknownExt = function (block) {
                block.data = _this.readSubBlocks();
                if (_this._handler.unknown && _this._handler.unknown(block)) {
                    _this.checkBytes.push(_this._handler.unknown);
                }
            };
            block.label = _this._st.readByte();
            switch (block.label) {
                case 0xf9:
                    block.extType = 'gce';
                    parseGCExt(block);
                    break;
                case 0xfe:
                    block.extType = 'com';
                    parseComExt(block);
                    break;
                case 0x01:
                    block.extType = 'pte';
                    parsePTExt(block);
                    break;
                case 0xff:
                    block.extType = 'app';
                    parseAppExt(block);
                    break;
                default:
                    block.extType = 'unknown';
                    parseUnknownExt(block);
                    break;
            }
        };
        this.parseImg = function (img) {
            var deinterlace = function (pixels, width) {
                // Of course this defeats the purpose of interlacing. And it's *probably*
                // the least efficient way it's ever been implemented. But nevertheless...
                var newPixels = new Array(pixels.length);
                var rows = pixels.length / width;
                var cpRow = function (toRow, fromRow) {
                    var fromPixels = pixels.slice(fromRow * width, (fromRow + 1) * width);
                    newPixels.splice.apply(newPixels, [toRow * width, width].concat(fromPixels));
                };
                var offsets = [0, 4, 2, 1];
                var steps = [8, 8, 4, 2];
                var fromRow = 0;
                for (var pass = 0; pass < 4; pass++) {
                    for (var toRow = offsets[pass]; toRow < rows; toRow += steps[pass]) {
                        cpRow(toRow, fromRow);
                        fromRow++;
                    }
                }
                return newPixels;
            };
            img.leftPos = _this._st.readUnsigned();
            img.topPos = _this._st.readUnsigned();
            img.width = _this._st.readUnsigned();
            img.height = _this._st.readUnsigned();
            var bits = byteToBitArr(_this._st.readByte());
            img.lctFlag = bits.shift();
            img.interlaced = bits.shift();
            img.sorted = bits.shift();
            img.reserved = bits.splice(0, 2);
            img.lctSize = bitsToNum(bits.splice(0, 3));
            if (img.lctFlag) {
                img.lct = _this.parseColorTable(1 << (img.lctSize + 1));
            }
            img.lzwMinCodeSize = _this._st.readByte();
            var lzwData = _this.readSubBlocks();
            img.pixels = lzwDecode(img.lzwMinCodeSize, lzwData);
            if (img.interlaced) {
                // Move
                img.pixels = deinterlace(img.pixels, img.width);
            }
            _this.frames.push(img);
            _this.arrayToImage(img);
            if (_this._handler.img && _this._handler.img(img)) {
                _this.checkBytes.push(_this._handler);
            }
        };
        this.parseBlock = function () {
            var block = {
                sentinel: _this._st.readByte(),
                type: ''
            };
            var blockChar = String.fromCharCode(block.sentinel);
            switch (blockChar) {
                case '!':
                    block.type = 'ext';
                    _this.parseExt(block);
                    break;
                case ',':
                    block.type = 'img';
                    _this.parseImg(block);
                    break;
                case ';':
                    block.type = 'eof';
                    if (_this._handler.eof && _this._handler.eof(block)) {
                        _this.checkBytes.push(_this._handler.eof);
                    }
                    break;
                default:
                    throw new Error('Unknown block: 0x' + block.sentinel.toString(16));
            }
            if (block.type !== 'eof') {
                _this.parseBlock();
            }
        };
        this.arrayToImage = function (frame) {
            var count = 0;
            var c = document.createElement('canvas');
            c.id = count.toString();
            c.width = frame.width;
            c.height = frame.height;
            count++;
            var context = c.getContext('2d');
            var pixSize = 1;
            var y = 0;
            var x = 0;
            for (var i = 0; i < frame.pixels.length; i++) {
                if (x % frame.width === 0) {
                    y++;
                    x = 0;
                }
                if (_this.globalColorTable[frame.pixels[i]] === _this._transparentColor.toHex()) {
                    context.fillStyle = "rgba(0, 0, 0, 0)";
                }
                else {
                    context.fillStyle = _this.globalColorTable[frame.pixels[i]];
                }
                context.fillRect(x, y, pixSize, pixSize);
                x++;
            }
            var img = new Image();
            img.src = c.toDataURL();
            _this.images.push(img);
        };
        this._st = stream;
        this._handler = {};
        this._transparentColor = color;
        this.parseHeader();
        this.parseBlock();
    }
    return ParseGif;
}());
exports.ParseGif = ParseGif;
