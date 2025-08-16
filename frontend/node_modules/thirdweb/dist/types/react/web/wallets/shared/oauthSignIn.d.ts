import type { ThirdwebClient } from "../../../../client/client.js";
import type { Ecosystem, InAppWalletSocialAuth } from "../../../../wallets/in-app/core/wallet/types.js";
import type { Theme } from "../../../core/design-system/index.js";
/**
 * @internal
 */
export declare function openOauthSignInWindow({ authOption, themeObj, client, ecosystem, }: {
    authOption: InAppWalletSocialAuth;
    themeObj: Theme;
    client: ThirdwebClient;
    ecosystem?: Ecosystem;
}): Window | null;
//# sourceMappingURL=oauthSignIn.d.ts.map