"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHex = isHex;
const ox__Hex = require("ox/Hex");
/**
 * Checks if a value is a valid hexadecimal string.
 * @param value - The value to be checked.
 * @param options - Optional configuration for the validation.
 * @returns True if the value is a valid hexadecimal string, false otherwise.
 * @example
 * ```ts
 * import { isHex } from "thirdweb/utils";
 * const result = isHex("0x1a4");
 * console.log(result); // true
 * ```
 * @utils
 */
function isHex(value, options = {}) {
    return ox__Hex.validate(value, options);
}
//# sourceMappingURL=is-hex.js.map