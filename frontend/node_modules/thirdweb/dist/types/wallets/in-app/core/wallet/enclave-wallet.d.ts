import type { ThirdwebClient } from "../../../../client/client.js";
import type { Prettify } from "../../../../utils/type-utils.js";
import type { Account } from "../../../interfaces/wallet.js";
import type { ClientScopedStorage } from "../authentication/client-scoped-storage.js";
import type { AuthResultAndRecoveryCode, GetUser } from "../authentication/types.js";
import type { Ecosystem } from "./types.js";
import type { IWebWallet } from "./web-wallet.js";
export type UserStatus = {
    linkedAccounts: {
        type: string;
        details: {
            email: string;
            [key: string]: string;
        } | {
            phone: string;
            [key: string]: string;
        } | {
            address: string;
            [key: string]: string;
        } | {
            id: string;
            [key: string]: string;
        };
    }[];
    wallets: UserWallet[];
    id: string;
};
export type UserWallet = {
    address: string;
    createdAt: string;
    type: "sharded" | "enclave";
};
export declare class EnclaveWallet implements IWebWallet {
    private client;
    private ecosystem?;
    private address;
    private localStorage;
    constructor({ client, ecosystem, address, storage, }: Prettify<{
        client: ThirdwebClient;
        ecosystem?: Ecosystem;
        address: string;
        storage: ClientScopedStorage;
    }>);
    /**
     * Store the auth token for use
     * @returns `{walletAddress: string }` The user's wallet details
     * @internal
     */
    postWalletSetUp(authResult: AuthResultAndRecoveryCode): Promise<void>;
    /**
     * Gets the current user's details
     * @internal
     */
    getUserWalletStatus(): Promise<GetUser>;
    /**
     * Returns an account to perform wallet operations
     * @internal
     */
    getAccount(): Promise<Account>;
}
//# sourceMappingURL=enclave-wallet.d.ts.map