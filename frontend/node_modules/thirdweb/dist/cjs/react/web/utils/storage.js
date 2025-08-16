"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLastAuthProvider = getLastAuthProvider;
const webStorage_js_1 = require("../../../utils/storage/webStorage.js");
const storage_js_1 = require("../../core/utils/storage.js");
/**
 * Retrieves the last authentication provider used from local storage.
 *
 * This function is designed to work only in a browser environment.
 *
 * @returns {Promise<AuthArgsType["strategy"] | null>} A promise that resolves to the last
 * authentication provider strategy used, or `null` if none is found.
 *
 * @example
 * ```typescript
 * import { getLastAuthProvider } from "thirdweb/react";
 *
 * const lastAuthProvider = await getLastAuthProvider();
 * ```
 *
 * @utils
 */
async function getLastAuthProvider() {
    return (0, storage_js_1.getLastAuthProvider)(webStorage_js_1.webLocalStorage);
}
//# sourceMappingURL=storage.js.map