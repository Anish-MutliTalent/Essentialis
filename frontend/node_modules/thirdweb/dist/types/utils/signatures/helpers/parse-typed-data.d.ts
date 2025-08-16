import type * as ox__TypedData from "ox/TypedData";
/**
 * @internal
 */
export declare function parseTypedData<typedData extends ox__TypedData.TypedData | Record<string, unknown> = ox__TypedData.TypedData, primaryType extends keyof typedData | "EIP712Domain" = keyof typedData>(typedData: ox__TypedData.Definition<typedData, primaryType>): ox__TypedData.Definition<typedData, primaryType>;
//# sourceMappingURL=parse-typed-data.d.ts.map