import type { AbiParameterToPrimitiveType } from "abitype";
/**
 * Represents the filters for the "ProxyDeployedV2" event.
 */
export type ProxyDeployedV2EventFilters = Partial<{
    implementation: AbiParameterToPrimitiveType<{
        type: "address";
        name: "implementation";
        indexed: true;
    }>;
    proxy: AbiParameterToPrimitiveType<{
        type: "address";
        name: "proxy";
        indexed: true;
    }>;
    deployer: AbiParameterToPrimitiveType<{
        type: "address";
        name: "deployer";
        indexed: true;
    }>;
}>;
/**
 * Creates an event object for the ProxyDeployedV2 event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { proxyDeployedV2Event } from "thirdweb/extensions/thirdweb";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  proxyDeployedV2Event({
 *  implementation: ...,
 *  proxy: ...,
 *  deployer: ...,
 * })
 * ],
 * });
 * ```
 */
export declare function proxyDeployedV2Event(filters?: ProxyDeployedV2EventFilters): import("../../../../../event/prepare-event.js").PreparedEvent<{
    readonly name: "ProxyDeployedV2";
    readonly type: "event";
    readonly inputs: readonly [{
        readonly type: "address";
        readonly name: "implementation";
        readonly indexed: true;
    }, {
        readonly type: "address";
        readonly name: "proxy";
        readonly indexed: true;
    }, {
        readonly type: "address";
        readonly name: "deployer";
        readonly indexed: true;
    }, {
        readonly type: "bytes32";
        readonly name: "inputSalt";
    }, {
        readonly type: "bytes";
        readonly name: "data";
    }, {
        readonly type: "bytes";
        readonly name: "extraData";
    }];
}>;
//# sourceMappingURL=ProxyDeployedV2.d.ts.map