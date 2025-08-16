import type * as ox__Abi from "ox/Abi";
import type { ThirdwebContract } from "../../contract/contract.js";
import type { Hex } from "../encoding/hex.js";
/**
 * Decodes an error.
 * @param options - The options object.
 * @returns The decoded error.
 * @example
 * ```ts
 * import { decodeError } from "thirdweb/utils";
 *
 * const data = "0x...";
 * const error = await decodeError({ contract, data });
 * ```
 *
 * @utils
 */
export declare function decodeError<abi extends ox__Abi.Abi>(options: {
    contract: ThirdwebContract<abi>;
    data: Hex;
}): Promise<unknown>;
//# sourceMappingURL=decodeError.d.ts.map