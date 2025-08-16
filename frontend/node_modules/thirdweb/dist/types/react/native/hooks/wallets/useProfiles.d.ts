import { type UseQueryResult } from "@tanstack/react-query";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { Profile } from "../../../../wallets/in-app/core/authentication/types.js";
/**
 * Retrieves all linked profiles of the connected in-app or ecosystem account.
 *
 * @returns A React Query result containing the linked profiles for the connected in-app account.
 *  This hook will only run if the connected wallet supports account linking.
 *
 * @example
 * ```jsx
 * import { useProfiles } from "thirdweb/react";
 *
 * const { data: profiles } = useProfiles({
 *   client,
 * });
 *
 * console.log("Type:", profiles[0].type); // "discord"
 * console.log("Email:", profiles[0].details.email); // "john.doe@example.com"
 * ```
 *
 * @wallet
 */
export declare function useProfiles(args: {
    client: ThirdwebClient;
}): UseQueryResult<Profile[]>;
//# sourceMappingURL=useProfiles.d.ts.map