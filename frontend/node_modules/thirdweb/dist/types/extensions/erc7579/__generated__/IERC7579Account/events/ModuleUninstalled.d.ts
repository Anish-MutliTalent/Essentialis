/**
 * Creates an event object for the ModuleUninstalled event.
 * @returns The prepared event object.
 * @extension ERC7579
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { moduleUninstalledEvent } from "thirdweb/extensions/erc7579";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  moduleUninstalledEvent()
 * ],
 * });
 * ```
 */
export declare function moduleUninstalledEvent(): import("../../../../../event/prepare-event.js").PreparedEvent<{
    readonly name: "ModuleUninstalled";
    readonly type: "event";
    readonly inputs: readonly [{
        readonly type: "uint256";
        readonly name: "moduleTypeId";
    }, {
        readonly type: "address";
        readonly name: "module";
    }];
}>;
//# sourceMappingURL=ModuleUninstalled.d.ts.map