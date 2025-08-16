/**
 * @internal
 */
export declare function isHttpUrl(url: string): boolean;
type LinkingRecord = {
    redirect: string;
    href: string;
};
/**
 * @internal
 */
export declare function formatUniversalUrl(appUrl: string, wcUri: string): LinkingRecord;
/**
 * @internal
 */
export declare function formatNativeUrl(appUrl: string, wcUri: string): LinkingRecord;
/**
 * @internal
 */
export declare function formatWalletConnectUrl(appUrl: string, wcUri: string): LinkingRecord;
export declare function formatExplorerTxUrl(explorerUrl: string, txHash: string): string;
export declare function formatExplorerAddressUrl(explorerUrl: string, address: string): string;
export {};
//# sourceMappingURL=url.d.ts.map