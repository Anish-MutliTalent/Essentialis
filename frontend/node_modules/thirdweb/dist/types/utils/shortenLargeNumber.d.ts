/**
 * Shorten the string for large value
 * Mainly used for
 * Examples:
 * 10_000 -> 10k
 * 1_000_000 -> 1M
 * 1_000_000_000 -> 1B
 * @example
 * ```ts
 * import { shortenLargeNumber } from "thirdweb/utils";
 * const numStr = shortenLargeNumber(1_000_000_000, )
 * ```
 * @utils
 */
export declare function shortenLargeNumber(value: number): string;
//# sourceMappingURL=shortenLargeNumber.d.ts.map