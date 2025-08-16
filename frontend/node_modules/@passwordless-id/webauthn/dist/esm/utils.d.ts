/********************************
     Encoding/Decoding Utils
********************************/
import { Base64URLString } from "./types.js";
export declare function toBuffer(txt: string): ArrayBuffer;
export declare function parseBuffer(buffer: ArrayBuffer): string;
export declare function isBase64url(txt: string): boolean;
export declare function toBase64url(buffer: ArrayBuffer): Base64URLString;
export declare function parseBase64url(txt: Base64URLString): ArrayBuffer;
export declare function sha256(buffer: ArrayBuffer): Promise<ArrayBuffer>;
export declare function bufferToHex(buffer: ArrayBuffer): string;
export declare function concatenateBuffers(buffer1: ArrayBuffer, buffer2: ArrayBuffer): Uint8Array;
