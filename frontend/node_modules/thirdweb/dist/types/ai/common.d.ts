import type { Chain } from "../chains/types.js";
import type { ThirdwebClient } from "../client/client.js";
import { type PreparedTransaction } from "../transaction/prepare-transaction.js";
import type { Account } from "../wallets/interfaces/wallet.js";
export type Input = {
    client: ThirdwebClient;
    account?: Account;
    contextFilter?: {
        chains?: Chain[];
        walletAddresses?: string[];
        contractAddresses?: string[];
    };
    sessionId?: string;
} & ({
    messages: {
        role: "user" | "assistant";
        content: string;
    }[];
} | {
    message: string;
});
export type Output = {
    message: string;
    sessionId: string;
    transactions: PreparedTransaction[];
};
export declare function nebulaFetch(mode: "execute" | "chat", input: Input): Promise<Output>;
//# sourceMappingURL=common.d.ts.map