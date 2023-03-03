"use strict";
exports.__esModule = true;
exports.WebAudioInstance = void 0;
var StateMachine_1 = require("../../Util/StateMachine");
var util_1 = require("../../Math/util");
var AudioContext_1 = require("./AudioContext");
/**
 * Internal class representing a Web Audio AudioBufferSourceNode instance
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
 */
var WebAudioInstance = /** @class */ (function () {
    function WebAudioInstance(_src) {
        var _this = this;
        this._src = _src;
        this._audioContext = AudioContext_1.AudioContextFactory.create();
        this._volumeNode = this._audioContext.createGain();
        this._playingPromise = new Promise(function (resolve) {
            _this._playingResolve = resolve;
        });
        this._stateMachine = StateMachine_1.StateMachine.create({
            start: 'STOPPED',
            states: {
                PLAYING: {
                    onEnter: function (_a) {
                        var data = _a.data;
                        // Buffer nodes are single use
                        _this._createNewBufferSource();
                        _this._handleEnd();
                        _this._instance.start(0, data.pausedAt * _this._playbackRate, _this.duration);
                        data.startedAt = (_this._audioContext.currentTime - data.pausedAt);
                        data.pausedAt = 0;
                    },
                    onState: function () { return _this._playStarted(); },
                    onExit: function (_a) {
                        var to = _a.to;
                        // If you've exited early only resolve if explicitly STOPPED
                        if (to === 'STOPPED') {
                            _this._playingResolve(true);
                        }
                        // Whenever you're not playing... you stop!
                        _this._instance.onended = null; // disconnect the wired on-end handler
                        _this._instance.disconnect();
                        _this._instance.stop(0);
                        _this._instance = null;
                    },
                    transitions: ['STOPPED', 'PAUSED', 'SEEK']
                },
                SEEK: {
                    onEnter: function (_a) {
                        var position = _a.eventData, data = _a.data;
                        data.pausedAt = (position !== null && position !== void 0 ? position : 0) / _this._playbackRate;
                        data.startedAt = 0;
                    },
                    transitions: ['*']
                },
                STOPPED: {
                    onEnter: function (_a) {
                        var data = _a.data;
                        data.pausedAt = 0;
                        data.startedAt = 0;
                        _this._playingResolve(true);
                    },
                    transitions: ['PLAYING', 'PAUSED', 'SEEK']
                },
                PAUSED: {
                    onEnter: function (_a) {
                        var data = _a.data;
                        // Playback rate will be a scale factor of how fast/slow the audio is being played
                        // default is 1.0
                        // we need to invert it to get the time scale
                        data.pausedAt = (_this._audioContext.currentTime - data.startedAt);
                    },
                    transitions: ['PLAYING', 'STOPPED', 'SEEK']
                }
            }
        }, {
            startedAt: 0,
            pausedAt: 0
        });
        this._volume = 1;
        this._loop = false;
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        this._playStarted = function () { };
        this._playbackRate = 1.0;
        this._createNewBufferSource();
    }
    WebAudioInstance.prototype._createNewBufferSource = function () {
        this._instance = this._audioContext.createBufferSource();
        this._instance.buffer = this._src;
        this._instance.loop = this.loop;
        this._instance.playbackRate.value = this._playbackRate;
        this._instance.connect(this._volumeNode);
        this._volumeNode.connect(this._audioContext.destination);
    };
    WebAudioInstance.prototype._handleEnd = function () {
        var _this = this;
        if (!this.loop) {
            this._instance.onended = function () {
                _this._playingResolve(true);
            };
        }
    };
    Object.defineProperty(WebAudioInstance.prototype, "loop", {
        get: function () {
            return this._loop;
        },
        set: function (value) {
            var _this = this;
            this._loop = value;
            if (this._instance) {
                this._instance.loop = value;
                if (!this.loop) {
                    this._instance.onended = function () {
                        _this._playingResolve(true);
                    };
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WebAudioInstance.prototype, "volume", {
        get: function () {
            return this._volume;
        },
        set: function (value) {
            value = (0, util_1.clamp)(value, 0, 1.0);
            this._volume = value;
            if (this._stateMachine["in"]('PLAYING') && this._volumeNode.gain.setTargetAtTime) {
                // https://developer.mozilla.org/en-US/docs/Web/API/AudioParam/setTargetAtTime
                // After each .1 seconds timestep, the target value will ~63.2% closer to the target value.
                // This exponential ramp provides a more pleasant transition in gain
                this._volumeNode.gain.setTargetAtTime(value, this._audioContext.currentTime, 0.1);
            }
            else {
                this._volumeNode.gain.value = value;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WebAudioInstance.prototype, "duration", {
        /**
         * Returns the set duration to play, otherwise returns the total duration if unset
         */
        get: function () {
            var _a;
            return (_a = this._duration) !== null && _a !== void 0 ? _a : this.getTotalPlaybackDuration();
        },
        /**
         * Set the duration that this audio should play.
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
    WebAudioInstance.prototype.isPlaying = function () {
        return this._stateMachine["in"]('PLAYING');
    };
    WebAudioInstance.prototype.isPaused = function () {
        return this._stateMachine["in"]('PAUSED') || this._stateMachine["in"]('SEEK');
    };
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    WebAudioInstance.prototype.play = function (playStarted) {
        if (playStarted === void 0) { playStarted = function () { }; }
        this._playStarted = playStarted;
        this._stateMachine.go('PLAYING');
        return this._playingPromise;
    };
    WebAudioInstance.prototype.pause = function () {
        this._stateMachine.go('PAUSED');
    };
    WebAudioInstance.prototype.stop = function () {
        this._stateMachine.go('STOPPED');
    };
    WebAudioInstance.prototype.seek = function (position) {
        this._stateMachine.go('PAUSED');
        this._stateMachine.go('SEEK', position);
    };
    WebAudioInstance.prototype.getTotalPlaybackDuration = function () {
        return this._src.duration;
    };
    WebAudioInstance.prototype.getPlaybackPosition = function () {
        var _a = this._stateMachine.data, pausedAt = _a.pausedAt, startedAt = _a.startedAt;
        if (pausedAt) {
            return pausedAt * this._playbackRate;
        }
        if (startedAt) {
            return (this._audioContext.currentTime - startedAt) * this._playbackRate;
        }
        return 0;
    };
    Object.defineProperty(WebAudioInstance.prototype, "playbackRate", {
        get: function () {
            return this._instance.playbackRate.value;
        },
        set: function (playbackRate) {
            this._instance.playbackRate.value = this._playbackRate = playbackRate;
        },
        enumerable: false,
        configurable: true
    });
    return WebAudioInstance;
}());
exports.WebAudioInstance = WebAudioInstance;
