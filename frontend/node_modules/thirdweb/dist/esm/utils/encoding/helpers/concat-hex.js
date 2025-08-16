import * as ox__Hex from "ox/Hex";
/**
 * Concatenates an array of hexadecimal values into a single hexadecimal value.
 *
 * @param values - An array of hexadecimal values to concatenate.
 * @returns The concatenated hexadecimal value.
 * @utils
 */
export function concatHex(values) {
    return ox__Hex.concat(...values);
}
//# sourceMappingURL=concat-hex.js.map