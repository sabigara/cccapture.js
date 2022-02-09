import { Tar } from "./tar";
import { pad } from "./utils";
import { nanoid } from "nanoid";
import mitt from "mitt";
import deepmerge from "deepmerge";

type CanvasEncoderEvent = {
  process: () => void;
  progress: () => void;
};

const emitter = mitt<CanvasEncoderEvent>();

export interface CanvasEncoder {
  mimetype: string;
  extension: string;
  settings: CanvasEncoderSettings;

  on: typeof emitter.on;
  start: () => void;
  stop: () => void;
  addFrame: (canvas: HTMLCanvasElement) => void;
  save: (callback?: (blob: Blob) => void) => void;
}

export type CanvasEncoderSettings = {
  format: CanvasEncoderFormat;
  filename: string;
  autoSaveTime: number | null;
  framerate: number;
  quality: number; // 0 to 1
  stepInterval: number;
  motionBlurFrames: number;
  timeLimit: number;
  frameLimit: number;
  startTime: number;
  step: () => void;
};

export type CanvasEncoderSettingsOptions = Partial<CanvasEncoderSettings>;

export function defaultSettings(): CanvasEncoderSettings {
  return {
    format: "png",
    filename: nanoid(),
    autoSaveTime: null,
    timeLimit: 0,
    frameLimit: 0,
    framerate: 60,
    startTime: 0,
    motionBlurFrames: 2,
    quality: 0.8,
    stepInterval: 1000 / 60,
    step: () => {
      throw new Error("tako");
    },
  } as const;
}

export type CanvasEncoderFormat = "png" | "jpeg" | "webm";

class TarEncoder {
  settings: CanvasEncoderSettings;
  extension = ".tar";
  mimetype = "application/x-tar";
  filename = "";
  baseFilename: string;
  tape = new Tar();
  count = 0;
  part = 1;
  frames = 0;

  constructor(settings: CanvasEncoderSettings) {
    this.settings = settings;
    this.baseFilename = this.settings.filename;
  }

  start() {
    this.dispose();
  }

  stop() {}

  addFrame(blob: Blob) {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      if (!(e.target?.result instanceof ArrayBuffer)) {
        throw new Error("Failed to load file.");
      }
      this.tape.append(
        pad(this.count) + this.extension,
        new Uint8Array(e.target.result)
      );

      if (
        this.settings.autoSaveTime &&
        this.frames / this.settings.framerate >= this.settings.autoSaveTime
      ) {
        this.save((blob: Blob) => {
          this.filename = this.baseFilename + "-part-" + pad(this.part);
          // download(blob, this.filename + this.extension, this.mimeType);
          const count = this.count;
          this.dispose();
          this.count = count + 1;
          this.part++;
          this.filename = this.baseFilename + "-part-" + pad(this.part);
          this.frames = 0;
          this.settings.step();
        });
      } else {
        this.count++;
        this.frames++;
        this.settings.step();
      }
    };
    fileReader.readAsArrayBuffer(blob);
  }

  save(callback?: (blob: Blob) => void) {
    callback?.(this.tape.save());
  }

  dispose() {
    this.tape = new Tar();
    this.count = 0;
  }
}

export class CanvasToPngEncoder implements CanvasEncoder {
  mimetype = "image/png";
  extension = ".png";
  settings: CanvasEncoderSettings;
  tarEncoder: TarEncoder;
  emitter = mitt<CanvasEncoderEvent>();

  constructor(options: CanvasEncoderSettingsOptions = {}) {
    this.settings = deepmerge(defaultSettings(), options);
    this.tarEncoder = new TarEncoder(this.settings);
  }

  on(...args: Parameters<CanvasEncoder["on"]>) {
    this.emitter.on(...args);
  }

  start() {
    this.tarEncoder.start();
  }

  stop() {
    this.tarEncoder.stop();
  }

  addFrame(canvas: HTMLCanvasElement) {
    canvas.toBlob((blob: Blob | null) => {
      if (!blob) {
        throw new Error("Failed to canvas.toBlob()");
      }
      this.tarEncoder.addFrame(blob);
    }, this.mimetype);
  }

  save(callback?: (blob: Blob) => void) {
    this.tarEncoder.save(callback);
  }
}

// class JpegEncoder {
//   type = "image/jpeg";
//   fileExtension = ".jpg";
//   tarEncoder: TarEncoder;

//   constructor(settings: CanvasEncoderSettings) {
//     this.tarEncoder = new TarEncoder(settings);
//   }

//   add(canvas: HTMLCanvasElement) {
//     canvas.toBlob(
//       function (blob) {
//         TarEncoder.prototype.addFrame.call(this, blob);
//       }.bind(this),
//       this.type,
//       this.quality
//     );
//   }
// }

// class WebMEncoder {
//   constructor(settings) {
//     const canvas = document.createElement("canvas");
//     if (canvas.toDataURL("image/webp").substr(5, 10) !== "image/webp") {
//       console.log("WebP not supported - try another export format");
//     }
//   }

//   quality = settings.quality / 100 || 0.8;

//   extension = ".webm";
//   mimeType = "video/webm";
//   baseFilename = this.filename;
//   framerate = settings.framerate;

//   frames = 0;
//   part = 1;

//   videoWriter = new WebMWriter({
//     quality: this.quality,
//     fileWriter: null,
//     fd: null,
//     frameRate: this.framerate,
//   });

//   start(canvas: HTMLCanvasElement) {
//     this.dispose(canvas);
//   }

//   add(canvas: HTMLCanvasElement) {
//     this.videoWriter.addFrame(canvas);

//     if (
//       this.settings.autoSaveTime > 0 &&
//       this.frames / this.settings.framerate >= this.settings.autoSaveTime
//     ) {
//       this.save(
//         function (blob) {
//           this.filename = this.baseFilename + "-part-" + pad(this.part);
//           download(blob, this.filename + this.extension, this.mimeType);
//           this.dispose();
//           this.part++;
//           this.filename = this.baseFilename + "-part-" + pad(this.part);
//           this.step();
//         }.bind(this)
//       );
//     } else {
//       this.frames++;
//       this.step();
//     }
//   }

//   save(callback) {
//     this.videoWriter.complete().then(callback);
//   }

//   dispose(canvas: HTMLCanvasElement) {
//     this.frames = 0;
//     this.videoWriter = new WebMWriter({
//       quality: this.quality,
//       fileWriter: null,
//       fd: null,
//       frameRate: this.framerate,
//     });
//   }
// }

// class FFMpegServerEncoder {
//   constructor(settings) {
//     settings.quality = settings.quality / 100 || 0.8;

//     this.encoder = new FFMpegServer.Video(settings);
//     this.encoder.on(
//       "process",
//       function () {
//         this.emit("process");
//       }.bind(this)
//     );
//     this.encoder.on(
//       "finished",
//       function (url, size) {
//         const cb = this.callback;
//         if (cb) {
//           this.callback = undefined;
//           cb(url, size);
//         }
//       }.bind(this)
//     );
//     this.encoder.on(
//       "progress",
//       function (progress) {
//         if (this.settings.onProgress) {
//           this.settings.onProgress(progress);
//         }
//       }.bind(this)
//     );
//     this.encoder.on(
//       "error",
//       function (data) {
//         alert(JSON.stringify(data, null, 2));
//       }.bind(this)
//     );
//   }

//   start() {
//     this.encoder.start(this.settings);
//   }

//   add(canvas) {
//     this.encoder.add(canvas);
//   }

//   save(callback) {
//     this.callback = callback;
//     this.encoder.end();
//   }

//   safeToProceed() {
//     return this.encoder.safeToProceed();
//   }
// }

// class StreamEncoder {
//   type = "video/webm";
//   extension = ".webm";
//   stream = null;
//   mediaRecorder = null;
//   chunks = [];

//   constructor(settings) {
//     this.framerate = this.settings.framerate;
//   }

//   add(canvas: HTMLCanvasElement) {
//     if (!this.stream) {
//       this.stream = canvas.captureStream(this.framerate);
//       this.mediaRecorder = new MediaRecorder(this.stream);
//       this.mediaRecorder.start();

//       this.mediaRecorder.ondataavailable = (e) => {
//         this.chunks.push(e.data);
//       };
//     }
//     this.step();
//   }

//   save(callback) {
//     this.mediaRecorder.onstop = (e) => {
//       const blob = new Blob(this.chunks, { type: "video/webm" });
//       this.chunks = [];
//       callback(blob);
//     };

//     this.mediaRecorder.stop();
//   }
// }

export function newCanvasEncoder(
  format: CanvasEncoderFormat,
  options: CanvasEncoderSettingsOptions = {}
) {
  switch (format) {
    case "jpeg":
      throw new Error();
    case "png":
      return new CanvasToPngEncoder(options);
    case "webm":
      throw new Error();
  }
}
