import type { ThirdwebClient } from "../../../../../client/client.js";
import type { ClientScopedStorage } from "../../../core/authentication/client-scoped-storage.js";
import type { AuthStoredTokenWithCookieReturnType } from "../../../core/authentication/types.js";
import type { UserWallet } from "../../../core/wallet/enclave-wallet.js";
/**
 * Migrate a sharded wallet to an enclave wallet.
 *
 * @param args - The arguments for the migration process.
 * @returns The migrated user wallet.
 */
export declare function migrateToEnclaveWallet(args: {
    client: ThirdwebClient;
    storage: ClientScopedStorage;
    storedToken: AuthStoredTokenWithCookieReturnType["storedToken"];
    encryptionKey?: string;
}): Promise<UserWallet>;
//# sourceMappingURL=migration.d.ts.map