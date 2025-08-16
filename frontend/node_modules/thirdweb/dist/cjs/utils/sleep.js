"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = sleep;
/**
 * Delay an async thread
 * @param ms Sleep time in millisecond
 * @internal
 */
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
//# sourceMappingURL=sleep.js.map