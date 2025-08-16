"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceBigInts = void 0;
exports.min = min;
exports.max = max;
exports.toBigInt = toBigInt;
const hex_js_1 = require("./encoding/hex.js");
/**
 * Returns the minimum of two BigInt values.
 * @param a - The first BigInt value.
 * @param b - The second BigInt value.
 * @returns The smaller of the two BigInt values.
 * @utils
 * @example
 * ```ts
 * min(1n, 2n)
 * // 1n
 */
function min(a, b) {
    return a < b ? a : b;
}
/**
 * Returns the maximum of two BigInt values.
 * @param a - The first BigInt value.
 * @param b - The second BigInt value.
 * @returns The larger of the two BigInt values.
 * @utils
 * @example
 * ```ts
 * max(1n, 2n)
 * // 2n
 */
function max(a, b) {
    return a > b ? a : b;
}
/**
 * Provides error checking on string or number bigint inputs.
 * @param value - A possibly integer-like string, number, or bigint.
 * @returns The bigint representation of the input.
 * @example
 * ```ts
 * toBigInt("2")
 * // 2n
 */
function toBigInt(value) {
    if (["string", "number"].includes(typeof value) &&
        !Number.isInteger(Number(value))) {
        throw new Error(`Expected value to be an integer to convert to a bigint, got ${value} of type ${typeof value}`);
    }
    if (value instanceof Uint8Array) {
        return BigInt((0, hex_js_1.uint8ArrayToHex)(value));
    }
    return BigInt(value);
}
const replaceBigInts = (obj, replacer) => {
    if (typeof obj === "bigint")
        return replacer(obj);
    if (Array.isArray(obj))
        return obj.map((x) => (0, exports.replaceBigInts)(x, replacer));
    if (obj && typeof obj === "object")
        return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, (0, exports.replaceBigInts)(v, replacer)]));
    return obj;
};
exports.replaceBigInts = replaceBigInts;
//# sourceMappingURL=bigint.js.map