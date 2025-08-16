import type { ThirdwebClient } from "../../../../client/client.js";
import type { ClientScopedStorage } from "../authentication/client-scoped-storage.js";
export declare function signMessage({ client, payload: { message, isRaw, originalMessage, chainId }, storage, }: {
    client: ThirdwebClient;
    payload: {
        message: string;
        isRaw: boolean;
        originalMessage?: string;
        chainId?: number;
    };
    storage: ClientScopedStorage;
}): Promise<{
    r: string;
    s: string;
    v: number;
    signature: string;
    hash: string;
}>;
//# sourceMappingURL=sign-message.enclave.d.ts.map