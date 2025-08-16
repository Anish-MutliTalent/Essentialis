/**
 * Checks if a string is a valid ENS name.
 * It does not check if the ENS name is currently registered or resolves to an address - it only validates the string format.
 *
 * @param name - The ENS name to check.
 *
 * @example
 * ```ts
 * isValidENSName("thirdweb.eth"); // true
 * isValidENSName("foo.bar.com"); // true
 * isValidENSName("xyz"); // false
 */
export declare function isValidENSName(name: string): boolean;
//# sourceMappingURL=isValidENSName.d.ts.map