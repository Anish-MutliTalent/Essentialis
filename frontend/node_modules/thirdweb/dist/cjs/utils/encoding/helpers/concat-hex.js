"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.concatHex = concatHex;
const ox__Hex = require("ox/Hex");
/**
 * Concatenates an array of hexadecimal values into a single hexadecimal value.
 *
 * @param values - An array of hexadecimal values to concatenate.
 * @returns The concatenated hexadecimal value.
 * @utils
 */
function concatHex(values) {
    return ox__Hex.concat(...values);
}
//# sourceMappingURL=concat-hex.js.map