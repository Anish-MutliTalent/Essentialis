import type * as ox__TypedData from "ox/TypedData";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { ClientScopedStorage } from "../authentication/client-scoped-storage.js";
export declare function signTypedData<const typedData extends ox__TypedData.TypedData | Record<string, unknown>, primaryType extends keyof typedData | "EIP712Domain" = keyof typedData>({ client, payload, storage, }: {
    client: ThirdwebClient;
    payload: ox__TypedData.Definition<typedData, primaryType>;
    storage: ClientScopedStorage;
}): Promise<{
    r: string;
    s: string;
    v: number;
    signature: string;
    hash: string;
}>;
//# sourceMappingURL=sign-typed-data.enclave.d.ts.map