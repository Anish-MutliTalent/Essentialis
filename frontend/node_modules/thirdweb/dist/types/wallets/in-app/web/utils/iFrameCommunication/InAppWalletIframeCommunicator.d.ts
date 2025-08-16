import type { Ecosystem } from "../../../core/wallet/types.js";
import { IframeCommunicator } from "./IframeCommunicator.js";
/**
 * @internal
 */
export declare class InAppWalletIframeCommunicator<T extends {
    [key: string]: any;
}> extends IframeCommunicator<T> {
    /**
     * @internal
     */
    constructor({ clientId, baseUrl, ecosystem, }: {
        clientId: string;
        baseUrl: string;
        ecosystem?: Ecosystem;
    });
}
//# sourceMappingURL=InAppWalletIframeCommunicator.d.ts.map