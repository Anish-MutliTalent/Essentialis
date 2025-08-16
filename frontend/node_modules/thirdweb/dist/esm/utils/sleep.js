/**
 * Delay an async thread
 * @param ms Sleep time in millisecond
 * @internal
 */
export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
//# sourceMappingURL=sleep.js.map