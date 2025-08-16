import type * as ox__Abi from "ox/Abi";
import type { ThirdwebContract } from "../contract.js";
type FetchConstructorParamsOptions = {
    contract: ThirdwebContract;
    explorerApiUrl: string;
    explorerApiKey: string;
    abi: ox__Abi.Abi;
};
/**
 *
 * @param options
 * @example
 * @internal
 */
export declare function fetchConstructorParams(options: FetchConstructorParamsOptions): Promise<string>;
export {};
//# sourceMappingURL=constructor-params.d.ts.map