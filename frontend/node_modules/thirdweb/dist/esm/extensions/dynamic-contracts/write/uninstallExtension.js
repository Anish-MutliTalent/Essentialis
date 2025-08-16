import { removeExtension } from "../__generated__/IExtensionManager/write/removeExtension.js";
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
export function uninstallExtension(options) {
    const { contract, extensionName } = options;
    return removeExtension({
        contract,
        extensionName,
    });
}
//# sourceMappingURL=uninstallExtension.js.map