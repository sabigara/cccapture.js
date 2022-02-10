import {
  CanvasEncoder,
  CanvasEncoderFormat,
  CanvasEncoderSettings,
  CanvasEncoderSettingsOptions,
  CanvasToWebpEncoder,
  defaultSettings,
  newCanvasEncoder,
} from "./Encoders";
import deepmerge from "deepmerge";
import _download from "downloadjs";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { pad } from "./utils";

type Timer = { callback: () => void; time: number; triggerTime: number };

export class CCapture {
  _settings: CanvasEncoderSettings;
  _date = new Date();
  _verbose = true;
  _time = 0;
  _startTime = 0;
  _performanceTime = 0;
  _performanceStartTime = 0;
  _encoder: CanvasToWebpEncoder;
  _timeouts: Timer[] = [];
  _intervals: Timer[] = [];
  _frameCount = 0;
  _intermediateFrameCount = 0;
  _lastFrame = null;
  _requestAnimationFrameCallbacks: (() => void)[] = [];
  _capturing = false;
  _handlers = {};
  motionBlurCanvas: HTMLCanvasElement;
  motionBlurCanvasCtx: CanvasRenderingContext2D;
  motionBlurBuffer?: Uint16Array;
  imageData?: ImageData;
  mediaArray: (HTMLVideoElement | HTMLAudioElement)[] = [];

  originalTimeFns = {
    setTimeout: window.setTimeout.bind(window),
    setInterval: window.setInterval.bind(window),
    clearInterval: window.clearInterval.bind(window),
    clearTimeout: window.clearTimeout.bind(window),
    requestAnimationFrame: window.requestAnimationFrame.bind(window),
    performanceNow: window.performance.now,
    dateNow: window.Date.now.bind(Date),
    getTime: window.Date.prototype.getTime,
  };

  constructor(settings: CanvasEncoderSettingsOptions) {
    this._settings = deepmerge(defaultSettings(), settings);
    this.motionBlurCanvas = document.createElement("canvas");
    const ctx = this.motionBlurCanvas.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to get canvas context");
    }
    this.motionBlurCanvasCtx = ctx;

    this._log("Step is set to " + this._settings.stepInterval + "ms");

    this._encoder = newCanvasEncoder(this._settings.format, {
      ...this._settings,
      step: this._step.bind(this),
    });

    // this._encoder.on("process", this._process);
    // this._encoder.on("progress", this._progress);
  }

  _init() {
    this._log("Capturer start");

    this._startTime = window.Date.now();
    this._time = this._startTime + this._settings.startTime;
    this._performanceStartTime = window.performance.now();
    this._performanceTime =
      this._performanceStartTime + this._settings.startTime;

    window.Date.prototype.getTime = () => {
      return this._time;
    };
    window.Date.now = () => {
      return this._time;
    };

    (window.setTimeout as any) = (callback: () => void, time: number) => {
      const t = {
        callback,
        time: time ?? 0,
        triggerTime: this._time + (time ?? 0),
      };
      this._timeouts.push(t);
      this._log("Timeout set to " + t.time);
      // ?????
      // return t;
      return 0;
    };
    window.clearTimeout = (id) => {
      for (let j = 0; j < this._timeouts.length; j++) {
        // ??????
        // if (this._timeouts[j] === id) {
        //   this._timeouts.splice(j, 1);
        //   this._log("Timeout cleared");
        //   continue;
        // }
      }
    };
    (window.setInterval as any) = (callback: () => void, time: number) => {
      const t = {
        callback,
        time: time ?? 0,
        triggerTime: this._time + (time ?? 0),
      };
      this._intervals.push(t);
      this._log("Interval set to " + t.time);
      // ??????
      // return t;
      return 0;
    };
    window.clearInterval = (id) => {
      this._log("clear Interval");
      return null;
    };
    (window.requestAnimationFrame as any) = (callback: () => void) => {
      this._requestAnimationFrameCallbacks.push(callback);
      return 0;
    };
    window.performance.now = () => {
      return this._performanceTime;
    };

    // Extension of HTMLVideoElement.
    function hookCurrentTime() {
      // this is HTMLVideoElement
      // @ts-ignore
      const _this = this as any;
      if (!_this._hooked) {
        _this._hooked = true;
        _this._hookedTime = _this.currentTime;
        _this.pause();
        _this.mediaArray.push(_this);
      }
      return _this._hookedTime + _this._settings.startTime;
    }

    try {
      Object.defineProperty(HTMLVideoElement.prototype, "currentTime", {
        get: hookCurrentTime,
      });
      Object.defineProperty(HTMLAudioElement.prototype, "currentTime", {
        get: hookCurrentTime,
      });
    } catch (err: any) {
      this._log(err);
    }
  }

  start() {
    this._init();
    this._encoder.start();
    this._capturing = true;
  }

  stop() {
    this._capturing = false;
    this._encoder.stop();
    this._destroy();
  }

  _step() {
    const step = 1000 / this._settings.framerate;
    const dt =
      (this._frameCount +
        this._intermediateFrameCount / this._settings.motionBlurFrames) *
      step;

    this._time = this._startTime + dt;
    this._performanceTime = this._performanceStartTime + dt;

    this.mediaArray.forEach((v) => {
      (v as any)._hookedTime = dt / 1000;
    });

    this._updateTime();
    this._log(
      "Frame: " + this._frameCount + " " + this._intermediateFrameCount
    );

    for (var j = 0; j < this._timeouts.length; j++) {
      if (this._time >= this._timeouts[j].triggerTime) {
        this.originalTimeFns.setTimeout(this._timeouts[j].callback);
        this._timeouts.splice(j, 1);
        continue;
      }
    }

    for (var j = 0; j < this._intervals.length; j++) {
      if (this._time >= this._intervals[j].triggerTime) {
        this.originalTimeFns.setTimeout(this._intervals[j].callback);
        this._intervals[j].triggerTime += this._intervals[j].time;
        continue;
      }
    }

    this._requestAnimationFrameCallbacks.forEach((cb) => {
      this.originalTimeFns.setTimeout(cb);
    });
    this._requestAnimationFrameCallbacks = [];
  }

  _destroy() {
    this._log("Capturer stop");
    window.setTimeout = this.originalTimeFns.setTimeout;
    window.setInterval = this.originalTimeFns.setInterval;
    window.clearInterval = this.originalTimeFns.clearInterval;
    window.clearTimeout = this.originalTimeFns.clearTimeout;
    window.requestAnimationFrame = this.originalTimeFns.requestAnimationFrame;
    window.performance.now = this.originalTimeFns.performanceNow;
    window.Date.prototype.getTime = this.originalTimeFns.getTime;
    window.Date.now = this.originalTimeFns.dateNow;
  }

  _updateTime() {
    const seconds = this._frameCount / this._settings.framerate;
    if (
      (this._settings.frameLimit &&
        this._frameCount >= this._settings.frameLimit) ||
      (this._settings.timeLimit && seconds >= this._settings.timeLimit)
    ) {
      this.stop();
      this.save();
    }
    new Date().setSeconds(seconds);
  }

  _checkFrame(canvas: HTMLCanvasElement) {
    if (
      this.motionBlurCanvas.width !== canvas.width ||
      this.motionBlurCanvas.height !== canvas.height
    ) {
      this.motionBlurCanvas.width = canvas.width;
      this.motionBlurCanvas.height = canvas.height;
      this.motionBlurBuffer = new Uint16Array(
        this.motionBlurCanvas.height * this.motionBlurCanvas.width * 4
      );
      this.motionBlurCanvasCtx.fillStyle = "#0";
      this.motionBlurCanvasCtx.fillRect(
        0,
        0,
        this.motionBlurCanvas.width,
        this.motionBlurCanvas.height
      );
    }
  }

  _blendFrame(canvas: HTMLCanvasElement) {
    this.motionBlurCanvasCtx.drawImage(canvas, 0, 0);
    this.imageData = this.motionBlurCanvasCtx.getImageData(
      0,
      0,
      this.motionBlurCanvas.width,
      this.motionBlurCanvas.height
    );
    if (this.motionBlurBuffer) {
      for (let j = 0; j < this.motionBlurBuffer.length; j += 4) {
        this.motionBlurBuffer[j] += this.imageData.data[j];
        this.motionBlurBuffer[j + 1] += this.imageData.data[j + 1];
        this.motionBlurBuffer[j + 2] += this.imageData.data[j + 2];
      }
    }
    this._intermediateFrameCount++;
  }

  saveFrame() {
    if (!this.motionBlurBuffer || !this.imageData) {
      return;
    }
    const data = this.imageData.data;
    for (var j = 0; j < this.motionBlurBuffer.length; j += 4) {
      data[j] =
        (this.motionBlurBuffer[j] * 2) / this._settings.motionBlurFrames;
      data[j + 1] =
        (this.motionBlurBuffer[j + 1] * 2) / this._settings.motionBlurFrames;
      data[j + 2] =
        (this.motionBlurBuffer[j + 2] * 2) / this._settings.motionBlurFrames;
    }
    this.motionBlurCanvasCtx.putImageData(this.imageData, 0, 0);
    this._encoder.addFrame(this.motionBlurCanvas);
    this._frameCount++;
    this._intermediateFrameCount = 0;
    this._log("Full MB Frame! " + this._frameCount + " " + this._time);
    for (var j = 0; j < this.motionBlurBuffer.length; j += 4) {
      this.motionBlurBuffer[j] = 0;
      this.motionBlurBuffer[j + 1] = 0;
      this.motionBlurBuffer[j + 2] = 0;
    }
  }

  capture(canvas: HTMLCanvasElement) {
    if (this._capturing) {
      if (this._settings.motionBlurFrames > 2) {
        this._checkFrame(canvas);
        this._blendFrame(canvas);

        if (
          this._intermediateFrameCount >=
          0.5 * this._settings.motionBlurFrames
        ) {
          this.saveFrame();
        } else {
          this._step();
        }
      } else {
        this._encoder.addFrame(canvas);
        this._frameCount++;
        this._log("Full Frame! " + this._frameCount);
      }
    }
  }

  save(): Blob[] {
    return this._encoder.save();
  }

  _log(message: string) {
    if (this._verbose) {
      console.log(message);
    }
  }
}

export async function toMp4(blobArray: Blob[]) {
  const outputFilename = "output.mp4";
  const ffmpeg = createFFmpeg({ log: true });
  await ffmpeg.load();

  await Promise.all(
    blobArray.map(async (blob, i) => {
      ffmpeg.FS(
        "writeFile",
        pad(i) + ".webp",
        new Uint8Array(await blob.arrayBuffer())
      );
    })
  );
  await ffmpeg.run("-framerate", "30", "-i", "%07d.webp", outputFilename);
  return ffmpeg.FS("readFile", outputFilename);
}

export function download(data: Uint8Array) {
  _download(data, "output.mp4", "video/mp4");
}
