import { Tar } from "./tar";
import { pad } from "./utils";
import { nanoid } from "nanoid";
import mitt from "mitt";

type CanvasEncoderEvent = {
  process: () => void;
  progress: () => void;
};

const emitter = mitt<CanvasEncoderEvent>();

export interface CanvasEncoder {
  on: typeof emitter.on;
  start: () => void;
  stop: () => void;
  addFrame: (canvas: HTMLCanvasElement) => void;
  save: () => Blob;
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

export type CanvasEncoderFormat = "png";

class TarEncoder {
  itemExtension: string;
  filename = "";
  baseFilename: string;
  autoSaveTime: number | null;
  framerate: number;
  tape = new Tar();
  count = 0;
  part = 1;
  frames = 0;
  step: () => void;

  constructor(options: {
    itemExtension: string;
    autoSaveTime: number | null;
    framerate: number;
    step: () => void;
  }) {
    this.itemExtension = options.itemExtension;
    this.autoSaveTime = options.autoSaveTime;
    this.framerate = options.framerate;
    this.step = options.step;
    this.baseFilename = this.filename;
  }

  start() {
    this.dispose();
  }

  addFrame(blob: Blob) {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      if (!(e.target?.result instanceof ArrayBuffer)) {
        throw new Error("Failed to load file.");
      }
      this.tape.append(
        pad(this.count) + this.itemExtension,
        new Uint8Array(e.target.result)
      );
      if (
        this.autoSaveTime &&
        this.frames / this.framerate >= this.autoSaveTime
      ) {
        const blob = this.save();
        this.filename = this.baseFilename + "-part-" + pad(this.part);
        // download(blob, this.filename + ".tar", "application/x-tar");
        const count = this.count;
        this.dispose();
        this.count = count + 1;
        this.part++;
        this.filename = this.baseFilename + "-part-" + pad(this.part);
        this.frames = 0;
        this.step();
      } else {
        this.count++;
        this.frames++;
        this.step();
      }
    };
    fileReader.readAsArrayBuffer(blob);
  }

  save() {
    return this.tape.save();
  }

  dispose() {
    this.tape = new Tar();
    this.count = 0;
  }
}

class BlobListEncoder {
  itemExtension: string;
  filename = "";
  baseFilename: string;
  autoSaveTime: number | null;
  framerate: number;
  count = 0;
  part = 1;
  frames = 0;
  step: () => void;
  files: File[] = [];

  constructor(options: {
    itemExtension: string;
    autoSaveTime: number | null;
    framerate: number;
    step: () => void;
  }) {
    this.itemExtension = options.itemExtension;
    this.autoSaveTime = options.autoSaveTime;
    this.framerate = options.framerate;
    this.step = options.step;
    this.baseFilename = this.filename;
  }

  start() {
    this.dispose();
  }

  addFile(blob: Blob) {
    this.files.push(new File([blob], pad(this.count) + this.itemExtension));
    this.count++;
    this.frames++;
    this.step();
  }

  save(): File[] {
    return this.files;
  }

  dispose() {
    this.files = [];
    this.count = 0;
  }
}

export class CanvasToWebpEncoder {
  container: Blob[] = [];

  private itemMimetype = "image/webp";
  private emitter = mitt<CanvasEncoderEvent>();
  private step: () => void;

  constructor(options: {
    autoSaveTime: number | null;
    framerate: number;
    step: () => void;
  }) {
    this.step = options.step;
  }

  on(...args: Parameters<CanvasEncoder["on"]>) {
    this.emitter.on(...args);
  }

  start() {}

  stop() {}

  addFrame(canvas: HTMLCanvasElement) {
    canvas.toBlob((blob: Blob | null) => {
      if (!blob) {
        throw new Error("Failed to canvas.toBlob()");
      }
      this.container.push(blob);
      this.step();
    }, this.itemMimetype);
  }

  dispose() {
    this.container = [];
  }

  save() {
    return this.container;
  }
}

export function newCanvasEncoder(
  format: CanvasEncoderFormat,
  options: CanvasEncoderSettings
) {
  switch (format) {
    case "png":
      return new CanvasToWebpEncoder(options);
  }
}
