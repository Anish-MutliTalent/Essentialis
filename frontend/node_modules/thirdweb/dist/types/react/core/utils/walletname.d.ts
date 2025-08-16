import type { UseQueryOptions } from "@tanstack/react-query";
import type { WalletId } from "../../../wallets/wallet-types.js";
/**
 * @internal
 */
export declare function useWalletName(props: {
    formatFn?: (str: string) => string;
    queryOptions?: Omit<UseQueryOptions<string>, "queryFn" | "queryKey">;
}): import("@tanstack/react-query").UseQueryResult<string, Error>;
/**
 * @internal Exported for tests only
 */
export declare function getQueryKeys(props: {
    id: WalletId;
    formatFn?: (str: string) => string;
}): readonly ["walletName", WalletId] | readonly ["walletName", WalletId, {
    readonly resolver: string;
}];
/**
 * @internal Exported for tests only
 */
export declare function fetchWalletName(props: {
    id: WalletId;
    formatFn?: (str: string) => string;
}): Promise<string>;
//# sourceMappingURL=walletname.d.ts.map