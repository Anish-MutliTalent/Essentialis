"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAuthorization = signAuthorization;
/**
 * Sign the given EIP-7702 authorization object.
 * @param options - The options for `signAuthorization`
 * Refer to the type [`SignAuthorizationOptions`](https://portal.thirdweb.com/references/typescript/v5/SignAuthorizationOptions)
 * @returns The signed authorization object
 *
 * ```ts
 * import { signAuthorization } from "thirdweb";
 *
 * const authorization = await signAuthorization({
 *     request: {
 *         address: "0x...",
 *         chainId: 911867,
 *         nonce: 100n,
 *     },
 *     account: myAccount,
 * });
 * ```
 *
 * @beta
 * @transaction
 */
async function signAuthorization(options) {
    const { account, request } = options;
    if (typeof account.signAuthorization === "undefined") {
        throw new Error("This account type does not yet support signing EIP-7702 authorizations");
    }
    return account.signAuthorization(request);
}
//# sourceMappingURL=authorization.js.map