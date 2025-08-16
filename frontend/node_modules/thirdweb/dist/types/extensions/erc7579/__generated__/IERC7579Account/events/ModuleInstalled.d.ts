/**
 * Creates an event object for the ModuleInstalled event.
 * @returns The prepared event object.
 * @extension ERC7579
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { moduleInstalledEvent } from "thirdweb/extensions/erc7579";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  moduleInstalledEvent()
 * ],
 * });
 * ```
 */
export declare function moduleInstalledEvent(): import("../../../../../event/prepare-event.js").PreparedEvent<{
    readonly name: "ModuleInstalled";
    readonly type: "event";
    readonly inputs: readonly [{
        readonly type: "uint256";
        readonly name: "moduleTypeId";
    }, {
        readonly type: "address";
        readonly name: "module";
    }];
}>;
//# sourceMappingURL=ModuleInstalled.d.ts.map