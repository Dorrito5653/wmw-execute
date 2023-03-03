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
exports.Sound = void 0;
var AudioImplementation_1 = require("../../Interfaces/AudioImplementation");
var Resource_1 = require("../Resource");
var WebAudioInstance_1 = require("./WebAudioInstance");
var AudioContext_1 = require("./AudioContext");
var MediaEvents_1 = require("../../Events/MediaEvents");
var Sound_1 = require("../../Util/Sound");
var Log_1 = require("../../Util/Log");
var Class_1 = require("../../Class");
/**
 * The [[Sound]] object allows games built in Excalibur to load audio
 * components, from soundtracks to sound effects. [[Sound]] is an [[Loadable]]
 * which means it can be passed to a [[Loader]] to pre-load before a game or level.
 */
var Sound = /** @class */ (function (_super) {
    __extends(Sound, _super);
    /**
     * @param paths A list of audio sources (clip.wav, clip.mp3, clip.ogg) for this audio clip. This is done for browser compatibility.
     */
    function Sound() {
        var paths = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            paths[_i] = arguments[_i];
        }
        var _this = _super.call(this) || this;
        _this.logger = Log_1.Logger.getInstance();
        _this._loop = false;
        _this._volume = 1;
        _this._isStopped = false;
        // private _isPaused = false;
        _this._tracks = [];
        _this._wasPlayingOnHidden = false;
        _this._playbackRate = 1.0;
        _this._audioContext = AudioContext_1.AudioContextFactory.create();
        _this._resource = new Resource_1.Resource('', AudioImplementation_1.ExResponse.type.arraybuffer);
        /**
         * Chrome : MP3, WAV, Ogg
         * Firefox : WAV, Ogg,
         * IE : MP3, WAV coming soon
         * Safari MP3, WAV, Ogg
         */
        for (var _a = 0, paths_1 = paths; _a < paths_1.length; _a++) {
            var path = paths_1[_a];
            if ((0, Sound_1.canPlayFile)(path)) {
                _this.path = path;
                break;
            }
        }
        if (!_this.path) {
            _this.logger.warn('This browser does not support any of the audio files specified:', paths.join(', '));
            _this.logger.warn('Attempting to use', paths[0]);
            _this.path = paths[0]; // select the first specified
        }
        return _this;
    }
    Object.defineProperty(Sound.prototype, "loop", {
        get: function () {
            return this._loop;
        },
        /**
         * Indicates whether the clip should loop when complete
         * @param value  Set the looping flag
         */
        set: function (value) {
            this._loop = value;
            for (var _i = 0, _a = this._tracks; _i < _a.length; _i++) {
                var track = _a[_i];
                track.loop = this._loop;
            }
            this.logger.debug('Set loop for all instances of sound', this.path, 'to', this._loop);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sound.prototype, "volume", {
        get: function () {
            return this._volume;
        },
        set: function (value) {
            this._volume = value;
            for (var _i = 0, _a = this._tracks; _i < _a.length; _i++) {
                var track = _a[_i];
                track.volume = this._volume;
            }
            this.emit('volumechange', new MediaEvents_1.NativeSoundEvent(this));
            this.logger.debug('Set loop for all instances of sound', this.path, 'to', this._volume);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sound.prototype, "duration", {
        /**
         * Get the duration that this audio should play. If unset the total natural playback duration will be used.
         */
        get: function () {
            return this._duration;
        },
        /**
         * Set the duration that this audio should play. If unset the total natural playback duration will be used.
         *
         * Note: if you seek to a specific point the duration will start from that point, for example
         *
         * If you have a 10 second clip, seek to 5 seconds, then set the duration to 2, it will play the clip from 5-7 seconds.
         */
        set: function (duration) {
            this._duration = duration;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sound.prototype, "instances", {
        /**
         * Return array of Current AudioInstances playing or being paused
         */
        get: function () {
            return this._tracks;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sound.prototype, "path", {
        get: function () {
            return this._resource.path;
        },
        set: function (val) {
            this._resource.path = val;
        },
        enumerable: false,
        configurable: true
    });
    Sound.prototype.isLoaded = function () {
        return !!this.data;
    };
    Sound.prototype.load = function () {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var arraybuffer, audiobuffer;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (this.data) {
                            return [2 /*return*/, this.data];
                        }
                        return [4 /*yield*/, this._resource.load()];
                    case 1:
                        arraybuffer = _c.sent();
                        return [4 /*yield*/, this.decodeAudio(arraybuffer.slice(0))];
                    case 2:
                        audiobuffer = _c.sent();
                        this._duration = (_b = (_a = this._duration) !== null && _a !== void 0 ? _a : audiobuffer === null || audiobuffer === void 0 ? void 0 : audiobuffer.duration) !== null && _b !== void 0 ? _b : undefined;
                        this.emit('processed', new MediaEvents_1.NativeSoundProcessedEvent(this, audiobuffer));
                        return [2 /*return*/, this.data = audiobuffer];
                }
            });
        });
    };
    Sound.prototype.decodeAudio = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 4]);
                        return [4 /*yield*/, this._audioContext.decodeAudioData(data.slice(0))];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        e_1 = _a.sent();
                        this.logger.error('Unable to decode ' +
                            ' this browser may not fully support this format, or the file may be corrupt, ' +
                            'if this is an mp3 try removing id3 tags and album art from the file.');
                        return [4 /*yield*/, Promise.reject()];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Sound.prototype.wireEngine = function (engine) {
        var _this = this;
        if (engine) {
            this._engine = engine;
            this._engine.on('hidden', function () {
                if (engine.pauseAudioWhenHidden && _this.isPlaying()) {
                    _this._wasPlayingOnHidden = true;
                    _this.pause();
                }
            });
            this._engine.on('visible', function () {
                if (engine.pauseAudioWhenHidden && _this._wasPlayingOnHidden) {
                    _this.play();
                    _this._wasPlayingOnHidden = false;
                }
            });
            this._engine.on('start', function () {
                _this._isStopped = false;
            });
            this._engine.on('stop', function () {
                _this.stop();
                _this._isStopped = true;
            });
        }
    };
    /**
     * Returns how many instances of the sound are currently playing
     */
    Sound.prototype.instanceCount = function () {
        return this._tracks.length;
    };
    /**
     * Whether or not the sound is playing right now
     */
    Sound.prototype.isPlaying = function () {
        return this._tracks.some(function (t) { return t.isPlaying(); });
    };
    Sound.prototype.isPaused = function () {
        return this._tracks.some(function (t) { return t.isPaused(); });
    };
    /**
     * Play the sound, returns a promise that resolves when the sound is done playing
     * An optional volume argument can be passed in to play the sound. Max volume is 1.0
     */
    Sound.prototype.play = function (volume) {
        if (!this.isLoaded()) {
            this.logger.warn('Cannot start playing. Resource', this.path, 'is not loaded yet');
            return Promise.resolve(true);
        }
        if (this._isStopped) {
            this.logger.warn('Cannot start playing. Engine is in a stopped state.');
            return Promise.resolve(false);
        }
        this.volume = volume || this.volume;
        if (this.isPaused()) {
            return this._resumePlayback();
        }
        else {
            return this._startPlayback();
        }
    };
    /**
     * Stop the sound, and do not rewind
     */
    Sound.prototype.pause = function () {
        if (!this.isPlaying()) {
            return;
        }
        for (var _i = 0, _a = this._tracks; _i < _a.length; _i++) {
            var track = _a[_i];
            track.pause();
        }
        this.emit('pause', new MediaEvents_1.NativeSoundEvent(this));
        this.logger.debug('Paused all instances of sound', this.path);
    };
    /**
     * Stop the sound if it is currently playing and rewind the track. If the sound is not playing, rewinds the track.
     */
    Sound.prototype.stop = function () {
        for (var _i = 0, _a = this._tracks; _i < _a.length; _i++) {
            var track = _a[_i];
            track.stop();
        }
        this.emit('stop', new MediaEvents_1.NativeSoundEvent(this));
        this._tracks.length = 0;
        this.logger.debug('Stopped all instances of sound', this.path);
    };
    Object.defineProperty(Sound.prototype, "playbackRate", {
        get: function () {
            return this._playbackRate;
        },
        set: function (playbackRate) {
            var _this = this;
            this._playbackRate = playbackRate;
            this._tracks.forEach(function (t) {
                t.playbackRate = _this._playbackRate;
            });
        },
        enumerable: false,
        configurable: true
    });
    Sound.prototype.seek = function (position, trackId) {
        if (trackId === void 0) { trackId = 0; }
        if (this._tracks.length === 0) {
            this._getTrackInstance(this.data);
        }
        this._tracks[trackId].seek(position);
    };
    Sound.prototype.getTotalPlaybackDuration = function () {
        return this.data.duration;
    };
    /**
     * Return the current playback time of the playing track in seconds from the start.
     *
     * Optionally specify the track to query if multiple are playing at once.
     * @param trackId
     */
    Sound.prototype.getPlaybackPosition = function (trackId) {
        if (trackId === void 0) { trackId = 0; }
        if (this._tracks.length) {
            return this._tracks[trackId].getPlaybackPosition();
        }
        return 0;
    };
    /**
     * Get Id of provided AudioInstance in current trackList
     * @param track [[Audio]] which Id is to be given
     */
    Sound.prototype.getTrackId = function (track) {
        return this._tracks.indexOf(track);
    };
    Sound.prototype._resumePlayback = function () {
        return __awaiter(this, void 0, void 0, function () {
            var resumed, _loop_1, _i, _a, track;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.isPaused) return [3 /*break*/, 2];
                        resumed = [];
                        _loop_1 = function (track) {
                            resumed.push(track.play().then(function () {
                                _this.emit('playbackend', new MediaEvents_1.NativeSoundEvent(_this, track));
                                _this._tracks.splice(_this.getTrackId(track), 1);
                                return true;
                            }));
                        };
                        // ensure we resume *current* tracks (if paused)
                        for (_i = 0, _a = this._tracks; _i < _a.length; _i++) {
                            track = _a[_i];
                            _loop_1(track);
                        }
                        this.emit('resume', new MediaEvents_1.NativeSoundEvent(this));
                        this.logger.debug('Resuming paused instances for sound', this.path, this._tracks);
                        // resolve when resumed tracks are done
                        return [4 /*yield*/, Promise.all(resumed)];
                    case 1:
                        // resolve when resumed tracks are done
                        _b.sent();
                        _b.label = 2;
                    case 2: return [2 /*return*/, true];
                }
            });
        });
    };
    /**
     * Starts playback, returns a promise that resolves when playback is complete
     */
    Sound.prototype._startPlayback = function () {
        return __awaiter(this, void 0, void 0, function () {
            var track, complete;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._getTrackInstance(this.data)];
                    case 1:
                        track = _a.sent();
                        return [4 /*yield*/, track.play(function () {
                                _this.emit('playbackstart', new MediaEvents_1.NativeSoundEvent(_this, track));
                                _this.logger.debug('Playing new instance for sound', _this.path);
                            })];
                    case 2:
                        complete = _a.sent();
                        // when done, remove track
                        this.emit('playbackend', new MediaEvents_1.NativeSoundEvent(this, track));
                        this._tracks.splice(this.getTrackId(track), 1);
                        return [2 /*return*/, complete];
                }
            });
        });
    };
    Sound.prototype._getTrackInstance = function (data) {
        var newTrack = new WebAudioInstance_1.WebAudioInstance(data);
        newTrack.loop = this.loop;
        newTrack.volume = this.volume;
        newTrack.duration = this.duration;
        newTrack.playbackRate = this._playbackRate;
        this._tracks.push(newTrack);
        return newTrack;
    };
    return Sound;
}(Class_1.Class));
exports.Sound = Sound;
