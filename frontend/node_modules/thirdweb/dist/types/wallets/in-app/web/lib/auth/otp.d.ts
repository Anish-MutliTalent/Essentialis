import type { ThirdwebClient } from "../../../../../client/client.js";
import type { AuthStoredTokenWithCookieReturnType, MultiStepAuthArgsType, PreAuthArgsType } from "../../../core/authentication/types.js";
import type { Ecosystem } from "../../../core/wallet/types.js";
/**
 * @internal
 */
export declare const sendOtp: (args: PreAuthArgsType) => Promise<void>;
/**
 * @internal
 */
export declare const verifyOtp: (args: MultiStepAuthArgsType & {
    client: ThirdwebClient;
    ecosystem?: Ecosystem;
}) => Promise<AuthStoredTokenWithCookieReturnType>;
//# sourceMappingURL=otp.d.ts.map