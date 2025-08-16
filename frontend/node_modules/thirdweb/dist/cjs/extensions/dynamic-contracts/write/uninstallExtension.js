"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uninstallExtension = uninstallExtension;
const removeExtension_js_1 = require("../__generated__/IExtensionManager/write/removeExtension.js");
/**
 * Uninstall an extension on a dynamic contract
 * @param options - The options for uninstalling an extension
 * @returns A prepared transaction to send
 * @example
 * ```ts
 * import { uninstallExtension } from "thirdweb/dynamic-contracts";
 * const transaction = uninstallExtension({
 *  client,
 *  chain,
 *  account,
 *  contract,
 *  extensionName: "MyExtension",
 * });
 * await sendTransaction({ transaction, account });
 * ```
 */
function uninstallExtension(options) {
    const { contract, extensionName } = options;
    return (0, removeExtension_js_1.removeExtension)({
        contract,
        extensionName,
    });
}
//# sourceMappingURL=uninstallExtension.js.map