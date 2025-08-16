import type { ThirdwebClient } from "../../../../client/client.js";
import type { Prettify } from "../../../../utils/type-utils.js";
import type { Account } from "../../../interfaces/wallet.js";
import type { ClientScopedStorage } from "../../core/authentication/client-scoped-storage.js";
import type { AuthResultAndRecoveryCode, GetUser } from "../../core/authentication/types.js";
import type { Ecosystem } from "../../core/wallet/types.js";
import type { IWebWallet } from "../../core/wallet/web-wallet.js";
import type { ClientIdWithQuerierType } from "../types.js";
import type { InAppWalletIframeCommunicator } from "../utils/iFrameCommunication/InAppWalletIframeCommunicator.js";
type WalletManagementTypes = {
    createWallet: undefined;
    setUpNewDevice: undefined;
    getUserStatus: undefined;
};
type WalletManagementUiTypes = {
    createWalletUi: undefined;
    setUpNewDeviceUi: undefined;
};
/**
 *
 */
export declare class IFrameWallet implements IWebWallet {
    client: ThirdwebClient;
    ecosystem?: Ecosystem;
    protected walletManagerQuerier: InAppWalletIframeCommunicator<WalletManagementTypes & WalletManagementUiTypes>;
    protected localStorage: ClientScopedStorage;
    /**
     * Not meant to be initialized directly. Call {@link initializeUser} to get an instance
     * @internal
     */
    constructor({ client, ecosystem, querier, localStorage, }: Prettify<ClientIdWithQuerierType & {
        ecosystem?: Ecosystem;
        localStorage: ClientScopedStorage;
    }>);
    /**
     * Used to set-up the user device in the case that they are using incognito
     * @returns `{walletAddress : string }` The user's wallet details
     * @internal
     */
    postWalletSetUp(authResult: AuthResultAndRecoveryCode): Promise<void>;
    /**
     * Gets the various status states of the user
     * @example
     * ```typescript
     *  const userStatus = await Paper.getUserWalletStatus();
     *  switch (userStatus.status) {
     *  case UserWalletStatus.LOGGED_OUT: {
     *    // User is logged out, call one of the auth methods on Paper.auth to authenticate the user
     *    break;
     *  }
     *  case UserWalletStatus.LOGGED_IN_WALLET_UNINITIALIZED: {
     *    // User is logged in, but does not have a wallet associated with it
     *    // you also have access to the user's details
     *    userStatus.user.authDetails;
     *    break;
     *  }
     *  case UserWalletStatus.LOGGED_IN_NEW_DEVICE: {
     *    // User is logged in and created a wallet already, but is missing the device shard
     *    // You have access to:
     *    userStatus.user.authDetails;
     *    userStatus.user.walletAddress;
     *    break;
     *  }
     *  case UserWalletStatus.LOGGED_IN_WALLET_INITIALIZED: {
     *    // user is logged in and wallet is all set up.
     *    // You have access to:
     *    userStatus.user.authDetails;
     *    userStatus.user.walletAddress;
     *    userStatus.user.wallet;
     *    break;
     *  }
     *}
     *```
     * @returns `{GetUserWalletStatusFnReturnType}` an object to containing various information on the user statuses
     * @internal
     */
    getUserWalletStatus(): Promise<GetUser>;
    /**
     * Returns an account that communicates with the iFrame for signing operations
     * @internal
     */
    getAccount(): Promise<Account>;
}
export {};
//# sourceMappingURL=iframe-wallet.d.ts.map