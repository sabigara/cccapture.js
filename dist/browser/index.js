function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}
// @ts-nocheck
var $c1cb1ab2437bd8a4$var$lookup = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "+",
    "/", 
];
function $c1cb1ab2437bd8a4$var$clean(length) {
    var i, buffer = new Uint8Array(length);
    for(i = 0; i < length; i += 1)buffer[i] = 0;
    return buffer;
}
function $c1cb1ab2437bd8a4$var$pad(num, bytes, base = 8) {
    const _num = num.toString(base);
    return "000000000000".substr(_num.length + 12 - bytes) + _num;
}
function $c1cb1ab2437bd8a4$var$stringToUint8(input, out, offset = 0) {
    out = out ?? $c1cb1ab2437bd8a4$var$clean(input.length);
    offset = offset || 0;
    for(let i = 0, length = input.length; i < length; i += 1){
        out[offset] = input.charCodeAt(i);
        offset += 1;
    }
    return out;
}
function $c1cb1ab2437bd8a4$var$uint8ToBase64(uint8) {
    let i, extraBytes = uint8.length % 3, output = "", temp, length;
    function tripletToBase64(num) {
        return $c1cb1ab2437bd8a4$var$lookup[num >> 18 & 63] + $c1cb1ab2437bd8a4$var$lookup[num >> 12 & 63] + $c1cb1ab2437bd8a4$var$lookup[num >> 6 & 63] + $c1cb1ab2437bd8a4$var$lookup[num & 63];
    }
    // go through the array every three bytes, we'll deal with trailing stuff later
    for(i = 0, length = uint8.length - extraBytes; i < length; i += 3){
        temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + uint8[i + 2];
        output += tripletToBase64(temp);
    }
    // this prevents an ERR_INVALID_URL in Chrome (Firefox okay)
    switch(output.length % 4){
        case 1:
            output += "=";
            break;
        case 2:
            output += "==";
            break;
        default:
            break;
    }
    return output;
}
/*
struct posix_header {             // byte offset
	char name[100];               //   0
	char mode[8];                 // 100
	char uid[8];                  // 108
	char gid[8];                  // 116
	char size[12];                // 124
	char mtime[12];               // 136
	char chksum[8];               // 148
	char typeflag;                // 156
	char linkname[100];           // 157
	char magic[6];                // 257
	char version[2];              // 263
	char uname[32];               // 265
	char gname[32];               // 297
	char devmajor[8];             // 329
	char devminor[8];             // 337
	char prefix[155];             // 345
                                  // 500
};
*/ const $c1cb1ab2437bd8a4$var$headerFormat = [
    {
        field: "fileName",
        length: 100
    },
    {
        field: "fileMode",
        length: 8
    },
    {
        field: "uid",
        length: 8
    },
    {
        field: "gid",
        length: 8
    },
    {
        field: "fileSize",
        length: 12
    },
    {
        field: "mtime",
        length: 12
    },
    {
        field: "checksum",
        length: 8
    },
    {
        field: "type",
        length: 1
    },
    {
        field: "linkName",
        length: 100
    },
    {
        field: "ustar",
        length: 8
    },
    {
        field: "owner",
        length: 32
    },
    {
        field: "group",
        length: 32
    },
    {
        field: "majorNumber",
        length: 8
    },
    {
        field: "minorNumber",
        length: 8
    },
    {
        field: "filenamePrefix",
        length: 155
    },
    {
        field: "padding",
        length: 12
    }, 
];
function $c1cb1ab2437bd8a4$var$formatHeader(data, cb) {
    const buffer = $c1cb1ab2437bd8a4$var$clean(512);
    let offset = 0;
    $c1cb1ab2437bd8a4$var$headerFormat.forEach(function(value) {
        var str = data[value.field] ?? "", i, length;
        for(i = 0, length = str.length; i < length; i += 1){
            buffer[offset] = str.charCodeAt(i);
            offset += 1;
        }
        offset += value.length - i; // space it out with nulls
    });
    if (typeof cb === "function") return cb(buffer, offset);
    return buffer;
}
const $c1cb1ab2437bd8a4$var$header = {
    structure: $c1cb1ab2437bd8a4$var$headerFormat,
    format: $c1cb1ab2437bd8a4$var$formatHeader
};
const $c1cb1ab2437bd8a4$var$recordSize = 512;
class $c1cb1ab2437bd8a4$export$fea5dc1c42f671fe {
    constructor(recordsPerBlock = 20){
        this.written = 0;
        this.blocks = [];
        this.length = 0;
        this.blockSize = recordsPerBlock * $c1cb1ab2437bd8a4$var$recordSize;
        this.out = $c1cb1ab2437bd8a4$var$clean(this.blockSize);
    }
    append(filepath, input, opts = {
    }, callback) {
        var data, checksum, mode, mtime, uid, gid, headerArr;
        if (typeof input === "string") input = $c1cb1ab2437bd8a4$var$stringToUint8(input);
        if (typeof opts === "function") {
            callback = opts;
            opts = {
            };
        }
        opts = opts || {
        };
        mode = opts.mode || parseInt("777", 8) & 4095;
        mtime = opts.mtime || Math.floor(+new Date() / 1000);
        uid = opts.uid || 0;
        gid = opts.gid || 0;
        data = {
            fileName: filepath,
            fileMode: $c1cb1ab2437bd8a4$var$pad(mode, 7),
            uid: $c1cb1ab2437bd8a4$var$pad(uid, 7),
            gid: $c1cb1ab2437bd8a4$var$pad(gid, 7),
            fileSize: $c1cb1ab2437bd8a4$var$pad(input.length, 11),
            mtime: $c1cb1ab2437bd8a4$var$pad(mtime, 11),
            checksum: "        ",
            type: "0",
            ustar: "ustar  ",
            owner: opts.owner || "",
            group: opts.group || ""
        };
        // calculate the checksum
        checksum = 0;
        Object.keys(data).forEach(function(key) {
            var i, value = data[key], length;
            for(i = 0, length = value.length; i < length; i += 1)checksum += value.charCodeAt(i);
        });
        data.checksum = $c1cb1ab2437bd8a4$var$pad(checksum, 6) + "\u0000 ";
        headerArr = $c1cb1ab2437bd8a4$var$header.format(data);
        var headerLength = Math.ceil(headerArr.length / $c1cb1ab2437bd8a4$var$recordSize) * $c1cb1ab2437bd8a4$var$recordSize;
        var inputLength = Math.ceil(input.length / $c1cb1ab2437bd8a4$var$recordSize) * $c1cb1ab2437bd8a4$var$recordSize;
        this.blocks.push({
            header: headerArr,
            input: input,
            headerLength: headerLength,
            inputLength: inputLength
        });
    }
    save() {
        var buffers = [];
        var chunks = [];
        var length = 0;
        var max = Math.pow(2, 20);
        var chunk = [];
        this.blocks.forEach(function(b) {
            if (length + b.headerLength + b.inputLength > max) {
                chunks.push({
                    blocks: chunk,
                    length: length
                });
                chunk = [];
                length = 0;
            }
            chunk.push(b);
            length += b.headerLength + b.inputLength;
        });
        chunks.push({
            blocks: chunk,
            length: length
        });
        chunks.forEach(function(c) {
            var buffer = new Uint8Array(c.length);
            var written = 0;
            c.blocks.forEach(function(b) {
                buffer.set(b.header, written);
                written += b.headerLength;
                buffer.set(b.input, written);
                written += b.inputLength;
            });
            buffers.push(buffer);
        });
        buffers.push(new Uint8Array(2 * $c1cb1ab2437bd8a4$var$recordSize));
        return new Blob(buffers, {
            type: "octet/stream"
        });
    }
    clear() {
        this.written = 0;
        this.out = $c1cb1ab2437bd8a4$var$clean(this.blockSize);
    }
}


function $60b09ee0d5d2adab$export$5d04458e2a6c373e(n) {
    return String("0000000" + n).slice(-7);
}


let $2333999f12d36308$export$2b646eea95309f00 = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict';


let $b200f17ba1c2dd5c$export$4385e60b38654f68 = (bytes)=>crypto.getRandomValues(new Uint8Array(bytes))
;
let $b200f17ba1c2dd5c$export$a5cee9e955a615e5 = (alphabet, size, getRandom)=>{
    let mask = (2 << Math.log(alphabet.length - 1) / Math.LN2) - 1;
    let step = -~(1.6 * mask * size / alphabet.length);
    return ()=>{
        let id = '';
        while(true){
            let bytes = getRandom(step);
            let j = step;
            while(j--){
                id += alphabet[bytes[j] & mask] || '';
                if (id.length === size) return id;
            }
        }
    };
};
let $b200f17ba1c2dd5c$export$62e99e5c9f473d7f = (alphabet, size)=>$b200f17ba1c2dd5c$export$a5cee9e955a615e5(alphabet, size, $b200f17ba1c2dd5c$export$4385e60b38654f68)
;
let $b200f17ba1c2dd5c$export$ac4959f4f1338dfc = (size = 21)=>{
    let id = '';
    let bytes = crypto.getRandomValues(new Uint8Array(size));
    while(size--){
        let byte = bytes[size] & 63;
        if (byte < 36) id += byte.toString(36);
        else if (byte < 62) id += (byte - 26).toString(36).toUpperCase();
        else if (byte < 63) id += '_';
        else id += '-';
    }
    return id;
};


function $e100f5d6f33ae25b$export$2e2bcd8739ae039(n1) {
    return {
        all: n1 = n1 || new Map,
        on: function(t, e) {
            var i = n1.get(t);
            i ? i.push(e) : n1.set(t, [
                e
            ]);
        },
        off: function(t, e) {
            var i = n1.get(t);
            i && (e ? i.splice(i.indexOf(e) >>> 0, 1) : n1.set(t, []));
        },
        emit: function(t, e) {
            var i = n1.get(t);
            i && i.slice().map(function(n) {
                n(e);
            }), (i = n1.get("*")) && i.slice().map(function(n) {
                n(t, e);
            });
        }
    };
}


const $15fa7241024b4597$var$ws = new WebSocket("ws://localhost:8080/ws");
const $15fa7241024b4597$var$emitter = $e100f5d6f33ae25b$export$2e2bcd8739ae039();
function $15fa7241024b4597$export$62680b65e63e14ec() {
    return {
        format: "png",
        filename: $b200f17ba1c2dd5c$export$ac4959f4f1338dfc(),
        autoSaveTime: null,
        timeLimit: 0,
        frameLimit: 0,
        framerate: 60,
        startTime: 0,
        motionBlurFrames: 2,
        quality: 0.8,
        stepInterval: 1000 / 60,
        step: ()=>{
            throw new Error("tako");
        }
    };
}
class $15fa7241024b4597$var$TarEncoder {
    constructor(options){
        this.filename = "";
        this.tape = new $c1cb1ab2437bd8a4$export$fea5dc1c42f671fe();
        this.count = 0;
        this.part = 1;
        this.frames = 0;
        this.itemExtension = options.itemExtension;
        this.autoSaveTime = options.autoSaveTime;
        this.framerate = options.framerate;
        this.step = options.step;
        this.baseFilename = this.filename;
    }
    start() {
        this.dispose();
    }
    addFrame(blob) {
        const fileReader = new FileReader();
        fileReader.onload = (e)=>{
            if (!(e.target?.result instanceof ArrayBuffer)) throw new Error("Failed to load file.");
            this.tape.append($60b09ee0d5d2adab$export$5d04458e2a6c373e(this.count) + this.itemExtension, new Uint8Array(e.target.result));
            if (this.autoSaveTime && this.frames / this.framerate >= this.autoSaveTime) {
                const blob = this.save();
                this.filename = this.baseFilename + "-part-" + $60b09ee0d5d2adab$export$5d04458e2a6c373e(this.part);
                // download(blob, this.filename + ".tar", "application/x-tar");
                const count = this.count;
                this.dispose();
                this.count = count + 1;
                this.part++;
                this.filename = this.baseFilename + "-part-" + $60b09ee0d5d2adab$export$5d04458e2a6c373e(this.part);
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
        this.tape = new $c1cb1ab2437bd8a4$export$fea5dc1c42f671fe();
        this.count = 0;
    }
}
class $15fa7241024b4597$var$BlobListEncoder {
    constructor(options){
        this.filename = "";
        this.count = 0;
        this.part = 1;
        this.frames = 0;
        this.files = [];
        this.itemExtension = options.itemExtension;
        this.autoSaveTime = options.autoSaveTime;
        this.framerate = options.framerate;
        this.step = options.step;
        this.baseFilename = this.filename;
    }
    start() {
        this.dispose();
    }
    addFile(blob) {
        this.files.push(new File([
            blob
        ], $60b09ee0d5d2adab$export$5d04458e2a6c373e(this.count) + this.itemExtension));
        this.count++;
        this.frames++;
        this.step();
    }
    save() {
        return this.files;
    }
    dispose() {
        this.files = [];
        this.count = 0;
    }
}
class $15fa7241024b4597$export$e1eb6219a8613a99 {
    constructor(options){
        this.container = [];
        this.itemMimetype = "image/webp";
        this.emitter = $e100f5d6f33ae25b$export$2e2bcd8739ae039();
        this.step = options.step;
    }
    on(...args) {
        this.emitter.on(...args);
    }
    start() {
    }
    stop() {
    }
    addFrame(canvas) {
        canvas.toBlob((blob)=>{
            if (!blob) throw new Error("Failed to canvas.toBlob()");
            this.container.push(blob);
            $15fa7241024b4597$var$ws.send(blob);
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
function $15fa7241024b4597$export$cfdefa26d0a2e6bf(format, options) {
    switch(format){
        case "png":
            return new $15fa7241024b4597$export$e1eb6219a8613a99(options);
    }
}


var $df14bafafd4b4888$exports = {};
'use strict';
var $df14bafafd4b4888$var$isMergeableObject = function isMergeableObject(value) {
    return $df14bafafd4b4888$var$isNonNullObject(value) && !$df14bafafd4b4888$var$isSpecial(value);
};
function $df14bafafd4b4888$var$isNonNullObject(value) {
    return !!value && typeof value === 'object';
}
function $df14bafafd4b4888$var$isSpecial(value) {
    var stringValue = Object.prototype.toString.call(value);
    return stringValue === '[object RegExp]' || stringValue === '[object Date]' || $df14bafafd4b4888$var$isReactElement(value);
}
// see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
var $df14bafafd4b4888$var$canUseSymbol = typeof Symbol === 'function' && Symbol.for;
var $df14bafafd4b4888$var$REACT_ELEMENT_TYPE = $df14bafafd4b4888$var$canUseSymbol ? Symbol.for('react.element') : 60103;
function $df14bafafd4b4888$var$isReactElement(value) {
    return value.$$typeof === $df14bafafd4b4888$var$REACT_ELEMENT_TYPE;
}
function $df14bafafd4b4888$var$emptyTarget(val) {
    return Array.isArray(val) ? [] : {
    };
}
function $df14bafafd4b4888$var$cloneUnlessOtherwiseSpecified(value, options) {
    return options.clone !== false && options.isMergeableObject(value) ? $df14bafafd4b4888$var$deepmerge($df14bafafd4b4888$var$emptyTarget(value), value, options) : value;
}
function $df14bafafd4b4888$var$defaultArrayMerge(target, source, options) {
    return target.concat(source).map(function(element) {
        return $df14bafafd4b4888$var$cloneUnlessOtherwiseSpecified(element, options);
    });
}
function $df14bafafd4b4888$var$getMergeFunction(key, options) {
    if (!options.customMerge) return $df14bafafd4b4888$var$deepmerge;
    var customMerge = options.customMerge(key);
    return typeof customMerge === 'function' ? customMerge : $df14bafafd4b4888$var$deepmerge;
}
function $df14bafafd4b4888$var$getEnumerableOwnPropertySymbols(target) {
    return Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(target).filter(function(symbol) {
        return target.propertyIsEnumerable(symbol);
    }) : [];
}
function $df14bafafd4b4888$var$getKeys(target) {
    return Object.keys(target).concat($df14bafafd4b4888$var$getEnumerableOwnPropertySymbols(target));
}
function $df14bafafd4b4888$var$propertyIsOnObject(object, property) {
    try {
        return property in object;
    } catch (_) {
        return false;
    }
}
// Protects from prototype poisoning and unexpected merging up the prototype chain.
function $df14bafafd4b4888$var$propertyIsUnsafe(target, key) {
    return $df14bafafd4b4888$var$propertyIsOnObject(target, key) // Properties are safe to merge if they don't exist in the target yet,
     && !(Object.hasOwnProperty.call(target, key) // unsafe if they exist up the prototype chain,
     && Object.propertyIsEnumerable.call(target, key)) // and also unsafe if they're nonenumerable.
    ;
}
function $df14bafafd4b4888$var$mergeObject(target, source, options) {
    var destination = {
    };
    if (options.isMergeableObject(target)) $df14bafafd4b4888$var$getKeys(target).forEach(function(key) {
        destination[key] = $df14bafafd4b4888$var$cloneUnlessOtherwiseSpecified(target[key], options);
    });
    $df14bafafd4b4888$var$getKeys(source).forEach(function(key) {
        if ($df14bafafd4b4888$var$propertyIsUnsafe(target, key)) return;
        if ($df14bafafd4b4888$var$propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) destination[key] = $df14bafafd4b4888$var$getMergeFunction(key, options)(target[key], source[key], options);
        else destination[key] = $df14bafafd4b4888$var$cloneUnlessOtherwiseSpecified(source[key], options);
    });
    return destination;
}
function $df14bafafd4b4888$var$deepmerge(target, source, options) {
    options = options || {
    };
    options.arrayMerge = options.arrayMerge || $df14bafafd4b4888$var$defaultArrayMerge;
    options.isMergeableObject = options.isMergeableObject || $df14bafafd4b4888$var$isMergeableObject;
    // cloneUnlessOtherwiseSpecified is added to `options` so that custom arrayMerge()
    // implementations can use it. The caller may not replace it.
    options.cloneUnlessOtherwiseSpecified = $df14bafafd4b4888$var$cloneUnlessOtherwiseSpecified;
    var sourceIsArray = Array.isArray(source);
    var targetIsArray = Array.isArray(target);
    var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;
    if (!sourceAndTargetTypesMatch) return $df14bafafd4b4888$var$cloneUnlessOtherwiseSpecified(source, options);
    else if (sourceIsArray) return options.arrayMerge(target, source, options);
    else return $df14bafafd4b4888$var$mergeObject(target, source, options);
}
$df14bafafd4b4888$var$deepmerge.all = function deepmergeAll(array, options) {
    if (!Array.isArray(array)) throw new Error('first argument should be an array');
    return array.reduce(function(prev, next) {
        return $df14bafafd4b4888$var$deepmerge(prev, next, options);
    }, {
    });
};
var $df14bafafd4b4888$var$deepmerge_1 = $df14bafafd4b4888$var$deepmerge;
$df14bafafd4b4888$exports = $df14bafafd4b4888$var$deepmerge_1;


var $adb5af636214365a$exports = {};
(function(root, factory) {
    if (typeof define === 'function' && define.amd) // AMD. Register as an anonymous module.
    define([], factory);
    else if (typeof $adb5af636214365a$exports === 'object') // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    $adb5af636214365a$exports = factory();
    else // Browser globals (root is window)
    root.download = factory();
})($adb5af636214365a$exports, function() {
    return function download(data, strFileName, strMimeType) {
        var self = window, defaultMime = "application/octet-stream", mimeType = strMimeType || defaultMime, payload = data, url1 = !strFileName && !strMimeType && payload, anchor = document.createElement("a"), toString = function(a) {
            return String(a);
        }, myBlob = self.Blob || self.MozBlob || self.WebKitBlob || toString, fileName = strFileName || "download", blob, reader;
        myBlob = myBlob.call ? myBlob.bind(self) : Blob;
        if (String(this) === "true") {
            payload = [
                payload,
                mimeType
            ];
            mimeType = payload[0];
            payload = payload[1];
        }
        if (url1 && url1.length < 2048) {
            fileName = url1.split("/").pop().split("?")[0];
            anchor.href = url1; // assign href prop to temp anchor
            if (anchor.href.indexOf(url1) !== -1) {
                var ajax = new XMLHttpRequest();
                ajax.open("GET", url1, true);
                ajax.responseType = 'blob';
                ajax.onload = function(e) {
                    download(e.target.response, fileName, defaultMime);
                };
                setTimeout(function() {
                    ajax.send();
                }, 0); // allows setting custom ajax headers using the return:
                return ajax;
            } // end if valid url?
        } // end if url?
        //go ahead and download dataURLs right away
        if (/^data:([\w+-]+\/[\w+.-]+)?[,;]/.test(payload)) {
            if (payload.length > 2096103.424 && myBlob !== toString) {
                payload = dataUrlToBlob(payload);
                mimeType = payload.type || defaultMime;
            } else return navigator.msSaveBlob ? navigator.msSaveBlob(dataUrlToBlob(payload), fileName) : saver(payload); // everyone else can save dataURLs un-processed
        } else if (/([\x80-\xff])/.test(payload)) {
            var i = 0, tempUiArr = new Uint8Array(payload.length), mx = tempUiArr.length;
            for(; i < mx; ++i)tempUiArr[i] = payload.charCodeAt(i);
            payload = new myBlob([
                tempUiArr
            ], {
                type: mimeType
            });
        }
        blob = payload instanceof myBlob ? payload : new myBlob([
            payload
        ], {
            type: mimeType
        });
        function dataUrlToBlob(strUrl) {
            var parts = strUrl.split(/[:;,]/), type = parts[1], decoder = parts[2] == "base64" ? atob : decodeURIComponent, binData = decoder(parts.pop()), mx = binData.length, i = 0, uiArr = new Uint8Array(mx);
            for(; i < mx; ++i)uiArr[i] = binData.charCodeAt(i);
            return new myBlob([
                uiArr
            ], {
                type: type
            });
        }
        function saver(url, winMode) {
            if ('download' in anchor) {
                anchor.href = url;
                anchor.setAttribute("download", fileName);
                anchor.className = "download-js-link";
                anchor.innerHTML = "downloading...";
                anchor.style.display = "none";
                document.body.appendChild(anchor);
                setTimeout(function() {
                    anchor.click();
                    document.body.removeChild(anchor);
                    if (winMode === true) setTimeout(function() {
                        self.URL.revokeObjectURL(anchor.href);
                    }, 250);
                }, 66);
                return true;
            }
            // handle non-a[download] safari as best we can:
            if (/(Version)\/(\d+)\.(\d+)(?:\.(\d+))?.*Safari\//.test(navigator.userAgent)) {
                if (/^data:/.test(url)) url = "data:" + url.replace(/^data:([\w\/\-\+]+)/, defaultMime);
                if (!window.open(url)) {
                    if (confirm("Displaying New Document\n\nUse Save As... to download, then click back to return to this page.")) location.href = url;
                }
                return true;
            }
            //do iframe dataURL download (old ch+FF):
            var f = document.createElement("iframe");
            document.body.appendChild(f);
            if (!winMode && /^data:/.test(url)) url = "data:" + url.replace(/^data:([\w\/\-\+]+)/, defaultMime);
            f.src = url;
            setTimeout(function() {
                document.body.removeChild(f);
            }, 333);
        } //end saver
        if (navigator.msSaveBlob) return navigator.msSaveBlob(blob, fileName);
        if (self.URL) saver(self.URL.createObjectURL(blob), true);
        else {
            // handle non-Blob()+non-URL browsers:
            if (typeof blob === "string" || blob.constructor === toString) try {
                return saver("data:" + mimeType + ";base64," + self.btoa(blob));
            } catch (y) {
                return saver("data:" + mimeType + "," + encodeURIComponent(blob));
            }
            // Blob but not URL support:
            reader = new FileReader();
            reader.onload = function(e) {
                saver(this.result);
            };
            reader.readAsDataURL(blob);
        }
        return true;
    }; /* end download() */ 
});


var $ce77e17b5cf6f2c9$exports = {};
var $7d012cd6c5dc34ef$exports = {};
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var $7d012cd6c5dc34ef$var$runtime = function(exports) {
    var Op = Object.prototype;
    var hasOwn = Op.hasOwnProperty;
    var undefined; // More compressible than void 0.
    var $Symbol = typeof Symbol === "function" ? Symbol : {
    };
    var iteratorSymbol = $Symbol.iterator || "@@iterator";
    var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
    var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
    function define(obj, key, value) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
        return obj[key];
    }
    try {
        // IE 8 has a broken Object.defineProperty that only works on DOM objects.
        define({
        }, "");
    } catch (err1) {
        define = function(obj, key, value) {
            return obj[key] = value;
        };
    }
    function wrap(innerFn, outerFn, self, tryLocsList) {
        // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
        var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
        var generator = Object.create(protoGenerator.prototype);
        var context = new Context(tryLocsList || []);
        // The ._invoke method unifies the implementations of the .next,
        // .throw, and .return methods.
        generator._invoke = makeInvokeMethod(innerFn, self, context);
        return generator;
    }
    exports.wrap = wrap;
    // Try/catch helper to minimize deoptimizations. Returns a completion
    // record like context.tryEntries[i].completion. This interface could
    // have been (and was previously) designed to take a closure to be
    // invoked without arguments, but in all the cases we care about we
    // already have an existing method we want to call, so there's no need
    // to create a new function object. We can even get away with assuming
    // the method takes exactly one argument, since that happens to be true
    // in every case, so we don't have to touch the arguments object. The
    // only additional allocation required is the completion record, which
    // has a stable shape and so hopefully should be cheap to allocate.
    function tryCatch(fn, obj, arg) {
        try {
            return {
                type: "normal",
                arg: fn.call(obj, arg)
            };
        } catch (err) {
            return {
                type: "throw",
                arg: err
            };
        }
    }
    var GenStateSuspendedStart = "suspendedStart";
    var GenStateSuspendedYield = "suspendedYield";
    var GenStateExecuting = "executing";
    var GenStateCompleted = "completed";
    // Returning this object from the innerFn has the same effect as
    // breaking out of the dispatch switch statement.
    var ContinueSentinel = {
    };
    // Dummy constructor functions that we use as the .constructor and
    // .constructor.prototype properties for functions that return Generator
    // objects. For full spec compliance, you may wish to configure your
    // minifier not to mangle the names of these two functions.
    function Generator() {
    }
    function GeneratorFunction() {
    }
    function GeneratorFunctionPrototype() {
    }
    // This is a polyfill for %IteratorPrototype% for environments that
    // don't natively support it.
    var IteratorPrototype = {
    };
    define(IteratorPrototype, iteratorSymbol, function() {
        return this;
    });
    var getProto = Object.getPrototypeOf;
    var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
    if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
    var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
    GeneratorFunction.prototype = GeneratorFunctionPrototype;
    define(Gp, "constructor", GeneratorFunctionPrototype);
    define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
    GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction");
    // Helper for defining the .next, .throw, and .return methods of the
    // Iterator interface in terms of a single ._invoke method.
    function defineIteratorMethods(prototype) {
        [
            "next",
            "throw",
            "return"
        ].forEach(function(method) {
            define(prototype, method, function(arg) {
                return this._invoke(method, arg);
            });
        });
    }
    exports.isGeneratorFunction = function(genFun) {
        var ctor = typeof genFun === "function" && genFun.constructor;
        return ctor ? ctor === GeneratorFunction || // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
    };
    exports.mark = function(genFun) {
        if (Object.setPrototypeOf) Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
        else {
            genFun.__proto__ = GeneratorFunctionPrototype;
            define(genFun, toStringTagSymbol, "GeneratorFunction");
        }
        genFun.prototype = Object.create(Gp);
        return genFun;
    };
    // Within the body of any async function, `await x` is transformed to
    // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
    // `hasOwn.call(value, "__await")` to determine if the yielded value is
    // meant to be awaited.
    exports.awrap = function(arg) {
        return {
            __await: arg
        };
    };
    function AsyncIterator(generator, PromiseImpl) {
        function invoke(method, arg, resolve, reject) {
            var record = tryCatch(generator[method], generator, arg);
            if (record.type === "throw") reject(record.arg);
            else {
                var result = record.arg;
                var value1 = result.value;
                if (value1 && typeof value1 === "object" && hasOwn.call(value1, "__await")) return PromiseImpl.resolve(value1.__await).then(function(value) {
                    invoke("next", value, resolve, reject);
                }, function(err) {
                    invoke("throw", err, resolve, reject);
                });
                return PromiseImpl.resolve(value1).then(function(unwrapped) {
                    // When a yielded Promise is resolved, its final value becomes
                    // the .value of the Promise<{value,done}> result for the
                    // current iteration.
                    result.value = unwrapped;
                    resolve(result);
                }, function(error) {
                    // If a rejected Promise was yielded, throw the rejection back
                    // into the async generator function so it can be handled there.
                    return invoke("throw", error, resolve, reject);
                });
            }
        }
        var previousPromise;
        function enqueue(method, arg) {
            function callInvokeWithMethodAndArg() {
                return new PromiseImpl(function(resolve, reject) {
                    invoke(method, arg, resolve, reject);
                });
            }
            return previousPromise = // If enqueue has been called before, then we want to wait until
            // all previous Promises have been resolved before calling invoke,
            // so that results are always delivered in the correct order. If
            // enqueue has not been called before, then it is important to
            // call invoke immediately, without waiting on a callback to fire,
            // so that the async generator function has the opportunity to do
            // any necessary setup in a predictable way. This predictability
            // is why the Promise constructor synchronously invokes its
            // executor callback, and why async functions synchronously
            // execute code before the first await. Since we implement simple
            // async functions in terms of async generators, it is especially
            // important to get this right, even though it requires care.
            previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, // Avoid propagating failures to Promises returned by later
            // invocations of the iterator.
            callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
        }
        // Define the unified helper method that is used to implement .next,
        // .throw, and .return (see defineIteratorMethods).
        this._invoke = enqueue;
    }
    defineIteratorMethods(AsyncIterator.prototype);
    define(AsyncIterator.prototype, asyncIteratorSymbol, function() {
        return this;
    });
    exports.AsyncIterator = AsyncIterator;
    // Note that simple async functions are implemented on top of
    // AsyncIterator objects; they just return a Promise for the value of
    // the final result produced by the iterator.
    exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
        if (PromiseImpl === void 0) PromiseImpl = Promise;
        var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
        return exports.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
         : iter.next().then(function(result) {
            return result.done ? result.value : iter.next();
        });
    };
    function makeInvokeMethod(innerFn, self, context) {
        var state = GenStateSuspendedStart;
        return function invoke(method, arg) {
            if (state === GenStateExecuting) throw new Error("Generator is already running");
            if (state === GenStateCompleted) {
                if (method === "throw") throw arg;
                // Be forgiving, per 25.3.3.3.3 of the spec:
                // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
                return doneResult();
            }
            context.method = method;
            context.arg = arg;
            while(true){
                var delegate = context.delegate;
                if (delegate) {
                    var delegateResult = maybeInvokeDelegate(delegate, context);
                    if (delegateResult) {
                        if (delegateResult === ContinueSentinel) continue;
                        return delegateResult;
                    }
                }
                if (context.method === "next") // Setting context._sent for legacy support of Babel's
                // function.sent implementation.
                context.sent = context._sent = context.arg;
                else if (context.method === "throw") {
                    if (state === GenStateSuspendedStart) {
                        state = GenStateCompleted;
                        throw context.arg;
                    }
                    context.dispatchException(context.arg);
                } else if (context.method === "return") context.abrupt("return", context.arg);
                state = GenStateExecuting;
                var record = tryCatch(innerFn, self, context);
                if (record.type === "normal") {
                    // If an exception is thrown from innerFn, we leave state ===
                    // GenStateExecuting and loop back for another invocation.
                    state = context.done ? GenStateCompleted : GenStateSuspendedYield;
                    if (record.arg === ContinueSentinel) continue;
                    return {
                        value: record.arg,
                        done: context.done
                    };
                } else if (record.type === "throw") {
                    state = GenStateCompleted;
                    // Dispatch the exception by looping back around to the
                    // context.dispatchException(context.arg) call above.
                    context.method = "throw";
                    context.arg = record.arg;
                }
            }
        };
    }
    // Call delegate.iterator[context.method](context.arg) and handle the
    // result, either by returning a { value, done } result from the
    // delegate iterator, or by modifying context.method and context.arg,
    // setting context.delegate to null, and returning the ContinueSentinel.
    function maybeInvokeDelegate(delegate, context) {
        var method = delegate.iterator[context.method];
        if (method === undefined) {
            // A .throw or .return when the delegate iterator has no .throw
            // method always terminates the yield* loop.
            context.delegate = null;
            if (context.method === "throw") {
                // Note: ["return"] must be used for ES3 parsing compatibility.
                if (delegate.iterator["return"]) {
                    // If the delegate iterator has a return method, give it a
                    // chance to clean up.
                    context.method = "return";
                    context.arg = undefined;
                    maybeInvokeDelegate(delegate, context);
                    if (context.method === "throw") // If maybeInvokeDelegate(context) changed context.method from
                    // "return" to "throw", let that override the TypeError below.
                    return ContinueSentinel;
                }
                context.method = "throw";
                context.arg = new TypeError("The iterator does not provide a 'throw' method");
            }
            return ContinueSentinel;
        }
        var record = tryCatch(method, delegate.iterator, context.arg);
        if (record.type === "throw") {
            context.method = "throw";
            context.arg = record.arg;
            context.delegate = null;
            return ContinueSentinel;
        }
        var info = record.arg;
        if (!info) {
            context.method = "throw";
            context.arg = new TypeError("iterator result is not an object");
            context.delegate = null;
            return ContinueSentinel;
        }
        if (info.done) {
            // Assign the result of the finished delegate to the temporary
            // variable specified by delegate.resultName (see delegateYield).
            context[delegate.resultName] = info.value;
            // Resume execution at the desired location (see delegateYield).
            context.next = delegate.nextLoc;
            // If context.method was "throw" but the delegate handled the
            // exception, let the outer generator proceed normally. If
            // context.method was "next", forget context.arg since it has been
            // "consumed" by the delegate iterator. If context.method was
            // "return", allow the original .return call to continue in the
            // outer generator.
            if (context.method !== "return") {
                context.method = "next";
                context.arg = undefined;
            }
        } else // Re-yield the result returned by the delegate method.
        return info;
        // The delegate iterator is finished, so forget it and continue with
        // the outer generator.
        context.delegate = null;
        return ContinueSentinel;
    }
    // Define Generator.prototype.{next,throw,return} in terms of the
    // unified ._invoke helper method.
    defineIteratorMethods(Gp);
    define(Gp, toStringTagSymbol, "Generator");
    // A Generator should always return itself as the iterator object when the
    // @@iterator function is called on it. Some browsers' implementations of the
    // iterator prototype chain incorrectly implement this, causing the Generator
    // object to not be returned from this call. This ensures that doesn't happen.
    // See https://github.com/facebook/regenerator/issues/274 for more details.
    define(Gp, iteratorSymbol, function() {
        return this;
    });
    define(Gp, "toString", function() {
        return "[object Generator]";
    });
    function pushTryEntry(locs) {
        var entry = {
            tryLoc: locs[0]
        };
        if (1 in locs) entry.catchLoc = locs[1];
        if (2 in locs) {
            entry.finallyLoc = locs[2];
            entry.afterLoc = locs[3];
        }
        this.tryEntries.push(entry);
    }
    function resetTryEntry(entry) {
        var record = entry.completion || {
        };
        record.type = "normal";
        delete record.arg;
        entry.completion = record;
    }
    function Context(tryLocsList) {
        // The root entry object (effectively a try statement without a catch
        // or a finally block) gives us a place to store values thrown from
        // locations where there is no enclosing try statement.
        this.tryEntries = [
            {
                tryLoc: "root"
            }
        ];
        tryLocsList.forEach(pushTryEntry, this);
        this.reset(true);
    }
    exports.keys = function(object) {
        var keys = [];
        for(var key1 in object)keys.push(key1);
        keys.reverse();
        // Rather than returning an object with a next method, we keep
        // things simple and return the next function itself.
        return function next() {
            while(keys.length){
                var key = keys.pop();
                if (key in object) {
                    next.value = key;
                    next.done = false;
                    return next;
                }
            }
            // To avoid creating an additional object, we just hang the .value
            // and .done properties off the next function object itself. This
            // also ensures that the minifier will not anonymize the function.
            next.done = true;
            return next;
        };
    };
    function values(iterable) {
        if (iterable) {
            var iteratorMethod = iterable[iteratorSymbol];
            if (iteratorMethod) return iteratorMethod.call(iterable);
            if (typeof iterable.next === "function") return iterable;
            if (!isNaN(iterable.length)) {
                var i = -1, next1 = function next() {
                    while(++i < iterable.length)if (hasOwn.call(iterable, i)) {
                        next.value = iterable[i];
                        next.done = false;
                        return next;
                    }
                    next.value = undefined;
                    next.done = true;
                    return next;
                };
                return next1.next = next1;
            }
        }
        // Return an iterator with no values.
        return {
            next: doneResult
        };
    }
    exports.values = values;
    function doneResult() {
        return {
            value: undefined,
            done: true
        };
    }
    Context.prototype = {
        constructor: Context,
        reset: function(skipTempReset) {
            this.prev = 0;
            this.next = 0;
            // Resetting context._sent for legacy support of Babel's
            // function.sent implementation.
            this.sent = this._sent = undefined;
            this.done = false;
            this.delegate = null;
            this.method = "next";
            this.arg = undefined;
            this.tryEntries.forEach(resetTryEntry);
            if (!skipTempReset) {
                for(var name in this)// Not sure about the optimal order of these conditions:
                if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) this[name] = undefined;
            }
        },
        stop: function() {
            this.done = true;
            var rootEntry = this.tryEntries[0];
            var rootRecord = rootEntry.completion;
            if (rootRecord.type === "throw") throw rootRecord.arg;
            return this.rval;
        },
        dispatchException: function(exception) {
            if (this.done) throw exception;
            var context = this;
            function handle(loc, caught) {
                record.type = "throw";
                record.arg = exception;
                context.next = loc;
                if (caught) {
                    // If the dispatched exception was caught by a catch block,
                    // then let that catch block handle the exception normally.
                    context.method = "next";
                    context.arg = undefined;
                }
                return !!caught;
            }
            for(var i = this.tryEntries.length - 1; i >= 0; --i){
                var entry = this.tryEntries[i];
                var record = entry.completion;
                if (entry.tryLoc === "root") // Exception thrown outside of any try block that could handle
                // it, so set the completion value of the entire function to
                // throw the exception.
                return handle("end");
                if (entry.tryLoc <= this.prev) {
                    var hasCatch = hasOwn.call(entry, "catchLoc");
                    var hasFinally = hasOwn.call(entry, "finallyLoc");
                    if (hasCatch && hasFinally) {
                        if (this.prev < entry.catchLoc) return handle(entry.catchLoc, true);
                        else if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
                    } else if (hasCatch) {
                        if (this.prev < entry.catchLoc) return handle(entry.catchLoc, true);
                    } else if (hasFinally) {
                        if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
                    } else throw new Error("try statement without catch or finally");
                }
            }
        },
        abrupt: function(type, arg) {
            for(var i = this.tryEntries.length - 1; i >= 0; --i){
                var entry = this.tryEntries[i];
                if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
                    var finallyEntry = entry;
                    break;
                }
            }
            if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) // Ignore the finally entry if control is not jumping to a
            // location outside the try/catch block.
            finallyEntry = null;
            var record = finallyEntry ? finallyEntry.completion : {
            };
            record.type = type;
            record.arg = arg;
            if (finallyEntry) {
                this.method = "next";
                this.next = finallyEntry.finallyLoc;
                return ContinueSentinel;
            }
            return this.complete(record);
        },
        complete: function(record, afterLoc) {
            if (record.type === "throw") throw record.arg;
            if (record.type === "break" || record.type === "continue") this.next = record.arg;
            else if (record.type === "return") {
                this.rval = this.arg = record.arg;
                this.method = "return";
                this.next = "end";
            } else if (record.type === "normal" && afterLoc) this.next = afterLoc;
            return ContinueSentinel;
        },
        finish: function(finallyLoc) {
            for(var i = this.tryEntries.length - 1; i >= 0; --i){
                var entry = this.tryEntries[i];
                if (entry.finallyLoc === finallyLoc) {
                    this.complete(entry.completion, entry.afterLoc);
                    resetTryEntry(entry);
                    return ContinueSentinel;
                }
            }
        },
        "catch": function(tryLoc) {
            for(var i = this.tryEntries.length - 1; i >= 0; --i){
                var entry = this.tryEntries[i];
                if (entry.tryLoc === tryLoc) {
                    var record = entry.completion;
                    if (record.type === "throw") {
                        var thrown = record.arg;
                        resetTryEntry(entry);
                    }
                    return thrown;
                }
            }
            // The context.catch method must only be called with a location
            // argument that corresponds to a known catch block.
            throw new Error("illegal catch attempt");
        },
        delegateYield: function(iterable, resultName, nextLoc) {
            this.delegate = {
                iterator: values(iterable),
                resultName: resultName,
                nextLoc: nextLoc
            };
            if (this.method === "next") // Deliberately forget the last sent value so that we don't
            // accidentally pass it on to the delegate.
            this.arg = undefined;
            return ContinueSentinel;
        }
    };
    // Regardless of whether this script is executing as a CommonJS module
    // or not, return the runtime object so that we can declare the variable
    // regeneratorRuntime in the outer scope, which allows this module to be
    // injected easily by `bin/regenerator --include-runtime script.js`.
    return exports;
}(// If this script is executing as a CommonJS module, use module.exports
// as the regeneratorRuntime namespace. Otherwise create a new empty
// object. Either way, the resulting object will be used to initialize
// the regeneratorRuntime variable at the top of this file.
"object" === "object" ? $7d012cd6c5dc34ef$exports : {
});
try {
    regeneratorRuntime = $7d012cd6c5dc34ef$var$runtime;
} catch (accidentalStrictMode) {
    // This module should not be running in strict mode, so the above
    // assignment should always work unless something is misconfigured. Just
    // in case runtime.js accidentally runs in strict mode, in modern engines
    // we can explicitly access globalThis. In older engines we can escape
    // strict mode using a global Function call. This could conceivably fail
    // if a Content Security Policy forbids using Function, but in that case
    // the proper solution is to fix the accidental strict mode problem. If
    // you've misconfigured your bundler to force strict mode and applied a
    // CSP to forbid Function, and you're not willing to fix either of those
    // problems, please detail your unique predicament in a GitHub issue.
    if (typeof globalThis === "object") globalThis.regeneratorRuntime = $7d012cd6c5dc34ef$var$runtime;
    else Function("r", "regeneratorRuntime = r")($7d012cd6c5dc34ef$var$runtime);
}


var $76d5104c90f00421$exports = {};
var $e0b21aeb173e3aa1$exports = {};
$e0b21aeb173e3aa1$exports = {
    defaultArgs: [
        /* args[0] is always the binary path */ './ffmpeg',
        /* Disable interaction mode */ '-nostdin',
        /* Force to override output file */ '-y', 
    ],
    baseOptions: {
        /* Flag to turn on/off log messages in console */ log: false,
        /*
     * Custom logger to get ffmpeg.wasm output messages.
     * a sample logger looks like this:
     *
     * ```
     * logger = ({ type, message }) => {
     *   console.log(type, message);
     * }
     * ```
     *
     * type can be one of following:
     *
     * info: internal workflow debug messages
     * fferr: ffmpeg native stderr output
     * ffout: ffmpeg native stdout output
     */ logger: ()=>{
        },
        /*
     * Progress handler to get current progress of ffmpeg command.
     * a sample progress handler looks like this:
     *
     * ```
     * progress = ({ ratio }) => {
     *   console.log(ratio);
     * }
     * ```
     *
     * ratio is a float number between 0 to 1.
     */ progress: ()=>{
        },
        /*
     * Path to find/download ffmpeg.wasm-core,
     * this value should be overwriten by `defaultOptions` in
     * each environment.
     */ corePath: ''
    }
};


var $76d5104c90f00421$require$defaultArgs = $e0b21aeb173e3aa1$exports.defaultArgs;
var $76d5104c90f00421$require$baseOptions = $e0b21aeb173e3aa1$exports.baseOptions;
var $8f5f9c53d3f53cdd$exports = {};
let $8f5f9c53d3f53cdd$var$logging = false;
let $8f5f9c53d3f53cdd$var$customLogger = ()=>{
};
const $8f5f9c53d3f53cdd$var$setLogging = (_logging)=>{
    $8f5f9c53d3f53cdd$var$logging = _logging;
};
const $8f5f9c53d3f53cdd$var$setCustomLogger = (logger)=>{
    $8f5f9c53d3f53cdd$var$customLogger = logger;
};
const $8f5f9c53d3f53cdd$var$log = (type, message)=>{
    $8f5f9c53d3f53cdd$var$customLogger({
        type: type,
        message: message
    });
    if ($8f5f9c53d3f53cdd$var$logging) console.log(`[${type}] ${message}`);
};
$8f5f9c53d3f53cdd$exports = {
    logging: $8f5f9c53d3f53cdd$var$logging,
    setLogging: $8f5f9c53d3f53cdd$var$setLogging,
    setCustomLogger: $8f5f9c53d3f53cdd$var$setCustomLogger,
    log: $8f5f9c53d3f53cdd$var$log
};


var $76d5104c90f00421$require$setLogging = $8f5f9c53d3f53cdd$exports.setLogging;
var $76d5104c90f00421$require$setCustomLogger = $8f5f9c53d3f53cdd$exports.setCustomLogger;
var $76d5104c90f00421$require$log = $8f5f9c53d3f53cdd$exports.log;
var $f4e333035318decf$exports = {};
let $f4e333035318decf$var$duration = 0;
let $f4e333035318decf$var$ratio = 0;
const $f4e333035318decf$var$ts2sec = (ts)=>{
    const [h, m, s] = ts.split(':');
    return parseFloat(h) * 3600 + parseFloat(m) * 60 + parseFloat(s);
};
$f4e333035318decf$exports = (message, progress)=>{
    if (typeof message === 'string') {
        if (message.startsWith('  Duration')) {
            const ts = message.split(', ')[0].split(': ')[1];
            const d = $f4e333035318decf$var$ts2sec(ts);
            progress({
                duration: d,
                ratio: $f4e333035318decf$var$ratio
            });
            if ($f4e333035318decf$var$duration === 0 || $f4e333035318decf$var$duration > d) $f4e333035318decf$var$duration = d;
        } else if (message.startsWith('frame') || message.startsWith('size')) {
            const ts = message.split('time=')[1].split(' ')[0];
            const t = $f4e333035318decf$var$ts2sec(ts);
            $f4e333035318decf$var$ratio = t / $f4e333035318decf$var$duration;
            progress({
                ratio: $f4e333035318decf$var$ratio,
                time: t
            });
        } else if (message.startsWith('video:')) {
            progress({
                ratio: 1
            });
            $f4e333035318decf$var$duration = 0;
        }
    }
};


var $9b18af82c5ccdfc4$exports = {};
$9b18af82c5ccdfc4$exports = (Core, args)=>{
    const argsPtr = Core._malloc(args.length * Uint32Array.BYTES_PER_ELEMENT);
    args.forEach((s, idx)=>{
        const buf = Core._malloc(s.length + 1);
        Core.writeAsciiToMemory(s, buf);
        Core.setValue(argsPtr + Uint32Array.BYTES_PER_ELEMENT * idx, buf, 'i32');
    });
    return [
        args.length,
        argsPtr
    ];
};


var $b5a34a73ccff3134$exports = {};
var $08f0a8990b934420$exports = {};
var $4f87336fed7b16bf$exports = {};
(function(root, factory) {
    if (typeof define === "function" && define.amd) define(factory);
    else if (typeof $4f87336fed7b16bf$exports === "object") $4f87336fed7b16bf$exports = factory();
    else root.resolveUrl = factory();
})($4f87336fed7b16bf$exports, function() {
    function resolveUrl() {
        var numUrls = arguments.length;
        if (numUrls === 0) throw new Error("resolveUrl requires at least one argument; got none.");
        var base = document.createElement("base");
        base.href = arguments[0];
        if (numUrls === 1) return base.href;
        var head = document.getElementsByTagName("head")[0];
        head.insertBefore(base, head.firstChild);
        var a = document.createElement("a");
        var resolved;
        for(var index = 1; index < numUrls; index++){
            a.href = arguments[index];
            resolved = a.href;
            base.href = resolved;
        }
        head.removeChild(base);
        return resolved;
    }
    return resolveUrl;
});


var $6c8431b5f3857cd7$exports = {};
$6c8431b5f3857cd7$exports = JSON.parse("{\"name\":\"@ffmpeg/ffmpeg\",\"version\":\"0.10.1\",\"description\":\"FFmpeg WebAssembly version\",\"main\":\"src/index.js\",\"types\":\"src/index.d.ts\",\"directories\":{\"example\":\"examples\"},\"scripts\":{\"start\":\"node scripts/server.js\",\"build\":\"rimraf dist && webpack --config scripts/webpack.config.prod.js\",\"prepublishOnly\":\"npm run build\",\"lint\":\"eslint src\",\"wait\":\"rimraf dist && wait-on http://localhost:3000/dist/ffmpeg.dev.js\",\"test\":\"npm-run-all -p -r start test:all\",\"test:all\":\"npm-run-all wait test:browser:ffmpeg test:node:all\",\"test:node\":\"node --experimental-wasm-threads --experimental-wasm-bulk-memory node_modules/.bin/_mocha --exit --bail --require ./scripts/test-helper.js\",\"test:node:all\":\"npm run test:node -- ./tests/*.test.js\",\"test:browser\":\"mocha-headless-chrome -a allow-file-access-from-files -a incognito -a no-sandbox -a disable-setuid-sandbox -a disable-logging -t 300000\",\"test:browser:ffmpeg\":\"npm run test:browser -- -f ./tests/ffmpeg.test.html\"},\"browser\":{\"./src/node/index.js\":\"./src/browser/index.js\"},\"repository\":{\"type\":\"git\",\"url\":\"git+https://github.com/ffmpegwasm/ffmpeg.wasm.git\"},\"keywords\":[\"ffmpeg\",\"WebAssembly\",\"video\"],\"author\":\"Jerome Wu <jeromewus@gmail.com>\",\"license\":\"MIT\",\"bugs\":{\"url\":\"https://github.com/ffmpegwasm/ffmpeg.wasm/issues\"},\"engines\":{\"node\":\">=12.16.1\"},\"homepage\":\"https://github.com/ffmpegwasm/ffmpeg.wasm#readme\",\"dependencies\":{\"is-url\":\"^1.2.4\",\"node-fetch\":\"^2.6.1\",\"regenerator-runtime\":\"^0.13.7\",\"resolve-url\":\"^0.2.1\"},\"devDependencies\":{\"@babel/core\":\"^7.12.3\",\"@babel/preset-env\":\"^7.12.1\",\"@ffmpeg/core\":\"^0.10.0\",\"@types/emscripten\":\"^1.39.4\",\"babel-loader\":\"^8.1.0\",\"chai\":\"^4.2.0\",\"cors\":\"^2.8.5\",\"eslint\":\"^7.12.1\",\"eslint-config-airbnb-base\":\"^14.1.0\",\"eslint-plugin-import\":\"^2.22.1\",\"express\":\"^4.17.1\",\"mocha\":\"^8.2.1\",\"mocha-headless-chrome\":\"^2.0.3\",\"npm-run-all\":\"^4.1.5\",\"wait-on\":\"^5.3.0\",\"webpack\":\"^5.3.2\",\"webpack-cli\":\"^4.1.0\",\"webpack-dev-middleware\":\"^4.0.0\"}}");


var $08f0a8990b934420$require$devDependencies = $6c8431b5f3857cd7$exports.devDependencies;
/*
 * Default options for browser environment
 */ $08f0a8990b934420$exports = {
    corePath: `https://unpkg.com/@ffmpeg/core@${$08f0a8990b934420$require$devDependencies['@ffmpeg/core'].substring(1)}/dist/ffmpeg-core.js`
};


var $febd754571da4c10$exports = {};


var $febd754571da4c10$require$log = $8f5f9c53d3f53cdd$exports.log;
/*
 * Fetch data from remote URL and convert to blob URL
 * to avoid CORS issue
 */ const $febd754571da4c10$var$toBlobURL = async (url, mimeType)=>{
    $febd754571da4c10$require$log('info', `fetch ${url}`);
    const buf = await (await fetch(url)).arrayBuffer();
    $febd754571da4c10$require$log('info', `${url} file size = ${buf.byteLength} bytes`);
    const blob = new Blob([
        buf
    ], {
        type: mimeType
    });
    const blobURL = URL.createObjectURL(blob);
    $febd754571da4c10$require$log('info', `${url} blob URL = ${blobURL}`);
    return blobURL;
};
$febd754571da4c10$exports = async ({ corePath: _corePath  })=>{
    if (typeof _corePath !== 'string') throw Error('corePath should be a string!');
    const coreRemotePath = $4f87336fed7b16bf$exports(_corePath);
    const corePath = await $febd754571da4c10$var$toBlobURL(coreRemotePath, 'application/javascript');
    const wasmPath = await $febd754571da4c10$var$toBlobURL(coreRemotePath.replace('ffmpeg-core.js', 'ffmpeg-core.wasm'), 'application/wasm');
    const workerPath = await $febd754571da4c10$var$toBlobURL(coreRemotePath.replace('ffmpeg-core.js', 'ffmpeg-core.worker.js'), 'application/javascript');
    if (typeof createFFmpegCore === 'undefined') return new Promise((resolve)=>{
        const script = document.createElement('script');
        const eventHandler = ()=>{
            script.removeEventListener('load', eventHandler);
            $febd754571da4c10$require$log('info', 'ffmpeg-core.js script loaded');
            resolve({
                createFFmpegCore: createFFmpegCore,
                corePath: corePath,
                wasmPath: wasmPath,
                workerPath: workerPath
            });
        };
        script.src = corePath;
        script.type = 'text/javascript';
        script.addEventListener('load', eventHandler);
        document.getElementsByTagName('head')[0].appendChild(script);
    });
    $febd754571da4c10$require$log('info', 'ffmpeg-core.js script is loaded already');
    return Promise.resolve({
        createFFmpegCore: createFFmpegCore,
        corePath: corePath,
        wasmPath: wasmPath,
        workerPath: workerPath
    });
};


var $ebebc593b1702027$exports = {};

const $ebebc593b1702027$var$readFromBlobOrFile = (blob)=>new Promise((resolve, reject)=>{
        const fileReader = new FileReader();
        fileReader.onload = ()=>{
            resolve(fileReader.result);
        };
        fileReader.onerror = ({ target: { error: { code: code  }  }  })=>{
            reject(Error(`File could not be read! Code=${code}`));
        };
        fileReader.readAsArrayBuffer(blob);
    })
;
$ebebc593b1702027$exports = async (_data)=>{
    let data = _data;
    if (typeof _data === 'undefined') return new Uint8Array();
    if (typeof _data === 'string') {
        /* From base64 format */ if (/data:_data\/([a-zA-Z]*);base64,([^"]*)/.test(_data)) data = atob(_data.split(',')[1]).split('').map((c)=>c.charCodeAt(0)
        );
        else {
            const res = await fetch($4f87336fed7b16bf$exports(_data));
            data = await res.arrayBuffer();
        }
    } else if (_data instanceof File || _data instanceof Blob) data = await $ebebc593b1702027$var$readFromBlobOrFile(_data);
    return new Uint8Array(data);
};


$b5a34a73ccff3134$exports = {
    defaultOptions: $08f0a8990b934420$exports,
    getCreateFFmpegCore: $febd754571da4c10$exports,
    fetchFile: $ebebc593b1702027$exports
};


var $76d5104c90f00421$require$defaultOptions = $b5a34a73ccff3134$exports.defaultOptions;
var $76d5104c90f00421$require$getCreateFFmpegCore = $b5a34a73ccff3134$exports.getCreateFFmpegCore;

var $76d5104c90f00421$require$version = $6c8431b5f3857cd7$exports.version;
const $76d5104c90f00421$var$NO_LOAD = Error('ffmpeg.wasm is not ready, make sure you have completed load().');
$76d5104c90f00421$exports = (_options = {
})=>{
    const { log: logging , logger: logger , progress: optProgress , ...options } = {
        ...$76d5104c90f00421$require$baseOptions,
        ...$76d5104c90f00421$require$defaultOptions,
        ..._options
    };
    let Core = null;
    let ffmpeg = null;
    let runResolve = null;
    let running = false;
    let progress = optProgress;
    const detectCompletion = (message)=>{
        if (message === 'FFMPEG_END' && runResolve !== null) {
            runResolve();
            runResolve = null;
            running = false;
        }
    };
    const parseMessage = ({ type: type , message: message  })=>{
        $76d5104c90f00421$require$log(type, message);
        $f4e333035318decf$exports(message, progress);
        detectCompletion(message);
    };
    /*
   * Load ffmpeg.wasm-core script.
   * In browser environment, the ffmpeg.wasm-core script is fetch from
   * CDN and can be assign to a local path by assigning `corePath`.
   * In node environment, we use dynamic require and the default `corePath`
   * is `$ffmpeg/core`.
   *
   * Typically the load() func might take few seconds to minutes to complete,
   * better to do it as early as possible.
   *
   */ const load = async ()=>{
        $76d5104c90f00421$require$log('info', 'load ffmpeg-core');
        if (Core === null) {
            $76d5104c90f00421$require$log('info', 'loading ffmpeg-core');
            /*
       * In node environment, all paths are undefined as there
       * is no need to set them.
       */ const { createFFmpegCore: createFFmpegCore , corePath: corePath , workerPath: workerPath , wasmPath: wasmPath ,  } = await $76d5104c90f00421$require$getCreateFFmpegCore(options);
            Core = await createFFmpegCore({
                /*
         * Assign mainScriptUrlOrBlob fixes chrome extension web worker issue
         * as there is no document.currentScript in the context of content_scripts
         */ mainScriptUrlOrBlob: corePath,
                printErr: (message)=>parseMessage({
                        type: 'fferr',
                        message: message
                    })
                ,
                print: (message)=>parseMessage({
                        type: 'ffout',
                        message: message
                    })
                ,
                /*
         * locateFile overrides paths of files that is loaded by main script (ffmpeg-core.js).
         * It is critical for browser environment and we override both wasm and worker paths
         * as we are using blob URL instead of original URL to avoid cross origin issues.
         */ locateFile: (path, prefix)=>{
                    if (typeof window !== 'undefined') {
                        if (typeof wasmPath !== 'undefined' && path.endsWith('ffmpeg-core.wasm')) return wasmPath;
                        if (typeof workerPath !== 'undefined' && path.endsWith('ffmpeg-core.worker.js')) return workerPath;
                    }
                    return prefix + path;
                }
            });
            ffmpeg = Core.cwrap('proxy_main', 'number', [
                'number',
                'number'
            ]);
            $76d5104c90f00421$require$log('info', 'ffmpeg-core loaded');
        } else throw Error('ffmpeg.wasm was loaded, you should not load it again, use ffmpeg.isLoaded() to check next time.');
    };
    /*
   * Determine whether the Core is loaded.
   */ const isLoaded = ()=>Core !== null
    ;
    /*
   * Run ffmpeg command.
   * This is the major function in ffmpeg.wasm, you can just imagine it
   * as ffmpeg native cli and what you need to pass is the same.
   *
   * For example, you can convert native command below:
   *
   * ```
   * $ ffmpeg -i video.avi -c:v libx264 video.mp4
   * ```
   *
   * To
   *
   * ```
   * await ffmpeg.run('-i', 'video.avi', '-c:v', 'libx264', 'video.mp4');
   * ```
   *
   */ const run = (..._args)=>{
        $76d5104c90f00421$require$log('info', `run ffmpeg command: ${_args.join(' ')}`);
        if (Core === null) throw $76d5104c90f00421$var$NO_LOAD;
        else if (running) throw Error('ffmpeg.wasm can only run one command at a time');
        else {
            running = true;
            return new Promise((resolve)=>{
                const args = [
                    ...$76d5104c90f00421$require$defaultArgs,
                    ..._args
                ].filter((s)=>s.length !== 0
                );
                runResolve = resolve;
                ffmpeg(...$9b18af82c5ccdfc4$exports(Core, args));
            });
        }
    };
    /*
   * Run FS operations.
   * For input/output file of ffmpeg.wasm, it is required to save them to MEMFS
   * first so that ffmpeg.wasm is able to consume them. Here we rely on the FS
   * methods provided by Emscripten.
   *
   * Common methods to use are:
   * ffmpeg.FS('writeFile', 'video.avi', new Uint8Array(...)): writeFile writes
   * data to MEMFS. You need to use Uint8Array for binary data.
   * ffmpeg.FS('readFile', 'video.mp4'): readFile from MEMFS.
   * ffmpeg.FS('unlink', 'video.map'): delete file from MEMFS.
   *
   * For more info, check https://emscripten.org/docs/api_reference/Filesystem-API.html
   *
   */ const FS = (method, ...args)=>{
        $76d5104c90f00421$require$log('info', `run FS.${method} ${args.map((arg)=>typeof arg === 'string' ? arg : `<${arg.length} bytes binary file>`
        ).join(' ')}`);
        if (Core === null) throw $76d5104c90f00421$var$NO_LOAD;
        else {
            let ret = null;
            try {
                ret = Core.FS[method](...args);
            } catch (e) {
                if (method === 'readdir') throw Error(`ffmpeg.FS('readdir', '${args[0]}') error. Check if the path exists, ex: ffmpeg.FS('readdir', '/')`);
                else if (method === 'readFile') throw Error(`ffmpeg.FS('readFile', '${args[0]}') error. Check if the path exists`);
                else throw Error('Oops, something went wrong in FS operation.');
            }
            return ret;
        }
    };
    /**
   * forcibly terminate the ffmpeg program.
   */ const exit = ()=>{
        if (Core === null) throw $76d5104c90f00421$var$NO_LOAD;
        else {
            running = false;
            Core.exit(1);
            Core = null;
            ffmpeg = null;
            runResolve = null;
        }
    };
    const setProgress = (_progress)=>{
        progress = _progress;
    };
    const setLogger = (_logger)=>{
        $76d5104c90f00421$require$setCustomLogger(_logger);
    };
    $76d5104c90f00421$require$setLogging(logging);
    $76d5104c90f00421$require$setCustomLogger(logger);
    $76d5104c90f00421$require$log('info', `use ffmpeg.wasm v${$76d5104c90f00421$require$version}`);
    return {
        setProgress: setProgress,
        setLogger: setLogger,
        setLogging: $76d5104c90f00421$require$setLogging,
        load: load,
        isLoaded: isLoaded,
        run: run,
        exit: exit,
        FS: FS
    };
};



var $ce77e17b5cf6f2c9$require$fetchFile = $b5a34a73ccff3134$exports.fetchFile;
$ce77e17b5cf6f2c9$exports = {
    createFFmpeg: /*
   * Create ffmpeg instance.
   * Each ffmpeg instance owns an isolated MEMFS and works
   * independently.
   *
   * For example:
   *
   * ```
   * const ffmpeg = createFFmpeg({
   *  log: true,
   *  logger: () => {},
   *  progress: () => {},
   *  corePath: '',
   * })
   * ```
   *
   * For the usage of these four arguments, check config.js
   *
   */ $76d5104c90f00421$exports,
    fetchFile: $ce77e17b5cf6f2c9$require$fetchFile
};



class $f0d540db358c20b7$export$2dc8a8a184d336b8 {
    constructor(settings){
        this._date = new Date();
        this._verbose = true;
        this._time = 0;
        this._startTime = 0;
        this._performanceTime = 0;
        this._performanceStartTime = 0;
        this._timeouts = [];
        this._intervals = [];
        this._frameCount = 0;
        this._intermediateFrameCount = 0;
        this._lastFrame = null;
        this._requestAnimationFrameCallbacks = [];
        this._capturing = false;
        this._handlers = {
        };
        this.mediaArray = [];
        this.originalTimeFns = {
            setTimeout: window.setTimeout.bind(window),
            setInterval: window.setInterval.bind(window),
            clearInterval: window.clearInterval.bind(window),
            clearTimeout: window.clearTimeout.bind(window),
            requestAnimationFrame: window.requestAnimationFrame.bind(window),
            performanceNow: window.performance.now,
            dateNow: window.Date.now.bind(Date),
            getTime: window.Date.prototype.getTime
        };
        this._settings = (/*@__PURE__*/$parcel$interopDefault($df14bafafd4b4888$exports))($15fa7241024b4597$export$62680b65e63e14ec(), settings);
        this.motionBlurCanvas = document.createElement("canvas");
        const ctx = this.motionBlurCanvas.getContext("2d");
        if (!ctx) throw new Error("Failed to get canvas context");
        this.motionBlurCanvasCtx = ctx;
        this._log("Step is set to " + this._settings.stepInterval + "ms");
        this._encoder = $15fa7241024b4597$export$cfdefa26d0a2e6bf(this._settings.format, {
            ...this._settings,
            step: this._step.bind(this)
        });
    // this._encoder.on("process", this._process);
    // this._encoder.on("progress", this._progress);
    }
    _init() {
        this._log("Capturer start");
        this._startTime = window.Date.now();
        this._time = this._startTime + this._settings.startTime;
        this._performanceStartTime = window.performance.now();
        this._performanceTime = this._performanceStartTime + this._settings.startTime;
        window.Date.prototype.getTime = ()=>{
            return this._time;
        };
        window.Date.now = ()=>{
            return this._time;
        };
        window.setTimeout = (callback, time)=>{
            const t = {
                callback: callback,
                time: time ?? 0,
                triggerTime: this._time + (time ?? 0)
            };
            this._timeouts.push(t);
            this._log("Timeout set to " + t.time);
            // ?????
            // return t;
            return 0;
        };
        window.clearTimeout = (id)=>{
            for(let j = 0; j < this._timeouts.length; j++);
        };
        window.setInterval = (callback, time)=>{
            const t = {
                callback: callback,
                time: time ?? 0,
                triggerTime: this._time + (time ?? 0)
            };
            this._intervals.push(t);
            this._log("Interval set to " + t.time);
            // ??????
            // return t;
            return 0;
        };
        window.clearInterval = (id)=>{
            this._log("clear Interval");
            return null;
        };
        window.requestAnimationFrame = (callback)=>{
            this._requestAnimationFrameCallbacks.push(callback);
            return 0;
        };
        window.performance.now = ()=>{
            return this._performanceTime;
        };
        // Extension of HTMLVideoElement.
        function hookCurrentTime() {
            // this is HTMLVideoElement
            // @ts-ignore
            const _this = this;
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
                get: hookCurrentTime
            });
            Object.defineProperty(HTMLAudioElement.prototype, "currentTime", {
                get: hookCurrentTime
            });
        } catch (err) {
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
        const dt = (this._frameCount + this._intermediateFrameCount / this._settings.motionBlurFrames) * step;
        this._time = this._startTime + dt;
        this._performanceTime = this._performanceStartTime + dt;
        this.mediaArray.forEach((v)=>{
            v._hookedTime = dt / 1000;
        });
        this._updateTime();
        this._log("Frame: " + this._frameCount + " " + this._intermediateFrameCount);
        for(var j = 0; j < this._timeouts.length; j++)if (this._time >= this._timeouts[j].triggerTime) {
            this.originalTimeFns.setTimeout(this._timeouts[j].callback);
            this._timeouts.splice(j, 1);
            continue;
        }
        for(var j = 0; j < this._intervals.length; j++)if (this._time >= this._intervals[j].triggerTime) {
            this.originalTimeFns.setTimeout(this._intervals[j].callback);
            this._intervals[j].triggerTime += this._intervals[j].time;
            continue;
        }
        this._requestAnimationFrameCallbacks.forEach((cb)=>{
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
        if (this._settings.frameLimit && this._frameCount >= this._settings.frameLimit || this._settings.timeLimit && seconds >= this._settings.timeLimit) {
            this.stop();
            this.save();
        }
        new Date().setSeconds(seconds);
    }
    _checkFrame(canvas) {
        if (this.motionBlurCanvas.width !== canvas.width || this.motionBlurCanvas.height !== canvas.height) {
            this.motionBlurCanvas.width = canvas.width;
            this.motionBlurCanvas.height = canvas.height;
            this.motionBlurBuffer = new Uint16Array(this.motionBlurCanvas.height * this.motionBlurCanvas.width * 4);
            this.motionBlurCanvasCtx.fillStyle = "#0";
            this.motionBlurCanvasCtx.fillRect(0, 0, this.motionBlurCanvas.width, this.motionBlurCanvas.height);
        }
    }
    _blendFrame(canvas) {
        this.motionBlurCanvasCtx.drawImage(canvas, 0, 0);
        this.imageData = this.motionBlurCanvasCtx.getImageData(0, 0, this.motionBlurCanvas.width, this.motionBlurCanvas.height);
        if (this.motionBlurBuffer) for(let j = 0; j < this.motionBlurBuffer.length; j += 4){
            this.motionBlurBuffer[j] += this.imageData.data[j];
            this.motionBlurBuffer[j + 1] += this.imageData.data[j + 1];
            this.motionBlurBuffer[j + 2] += this.imageData.data[j + 2];
        }
        this._intermediateFrameCount++;
    }
    saveFrame() {
        if (!this.motionBlurBuffer || !this.imageData) return;
        const data = this.imageData.data;
        for(var j = 0; j < this.motionBlurBuffer.length; j += 4){
            data[j] = this.motionBlurBuffer[j] * 2 / this._settings.motionBlurFrames;
            data[j + 1] = this.motionBlurBuffer[j + 1] * 2 / this._settings.motionBlurFrames;
            data[j + 2] = this.motionBlurBuffer[j + 2] * 2 / this._settings.motionBlurFrames;
        }
        this.motionBlurCanvasCtx.putImageData(this.imageData, 0, 0);
        this._encoder.addFrame(this.motionBlurCanvas);
        this._frameCount++;
        this._intermediateFrameCount = 0;
        this._log("Full MB Frame! " + this._frameCount + " " + this._time);
        for(var j = 0; j < this.motionBlurBuffer.length; j += 4){
            this.motionBlurBuffer[j] = 0;
            this.motionBlurBuffer[j + 1] = 0;
            this.motionBlurBuffer[j + 2] = 0;
        }
    }
    capture(canvas) {
        if (this._capturing) {
            if (this._settings.motionBlurFrames > 2) {
                this._checkFrame(canvas);
                this._blendFrame(canvas);
                if (this._intermediateFrameCount >= 0.5 * this._settings.motionBlurFrames) this.saveFrame();
                else this._step();
            } else {
                this._encoder.addFrame(canvas);
                this._frameCount++;
                this._log("Full Frame! " + this._frameCount);
            }
        }
    }
    save() {
        return this._encoder.save();
    }
    _log(message) {
        if (this._verbose) console.log(message);
    }
}
async function $f0d540db358c20b7$export$2763da690c5cff24(blobArray) {
    const outputFilename = "output.mp4";
    const ffmpeg = $ce77e17b5cf6f2c9$exports.createFFmpeg({
        log: true
    });
    await ffmpeg.load();
    await Promise.all(blobArray.map(async (blob, i)=>{
        ffmpeg.FS("writeFile", $60b09ee0d5d2adab$export$5d04458e2a6c373e(i) + ".webp", new Uint8Array(await blob.arrayBuffer()));
    }));
    await ffmpeg.run("-framerate", "30", "-i", "%07d.webp", outputFilename);
    return ffmpeg.FS("readFile", outputFilename);
}
function $f0d540db358c20b7$export$24422be91ad4011f(data) {
    (/*@__PURE__*/$parcel$interopDefault($adb5af636214365a$exports))(data, "output.mp4", "video/mp4");
}


export {$f0d540db358c20b7$export$2dc8a8a184d336b8 as CCapture, $f0d540db358c20b7$export$2763da690c5cff24 as toMp4, $f0d540db358c20b7$export$24422be91ad4011f as download};
//# sourceMappingURL=index.js.map
