import * as ox__TypedData from "ox/TypedData";
import { type Hex } from "../encoding/hex.js";
export type HashTypedDataParams<typedData extends ox__TypedData.TypedData | Record<string, unknown> = ox__TypedData.TypedData, primaryType extends keyof typedData | "EIP712Domain" = keyof typedData> = ox__TypedData.Definition<typedData, primaryType>;
/**
 * @internal
 */
export declare function hashTypedData<const typedData extends ox__TypedData.TypedData | Record<string, unknown>, primaryType extends keyof typedData | "EIP712Domain">(parameters: HashTypedDataParams<typedData, primaryType>): Hex;
//# sourceMappingURL=hashTypedData.d.ts.map