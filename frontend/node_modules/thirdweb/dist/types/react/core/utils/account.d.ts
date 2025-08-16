import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { type SupportedFiatCurrency } from "../../../pay/convert/type.js";
import { type Address } from "../../../utils/address.js";
export declare const COLOR_OPTIONS: string[][];
/**
 * @component
 * @wallet
 */
export type AccountBalanceInfo = {
    /**
     * Represents either token balance or fiat balance.
     */
    balance: number;
    /**
     * Represents either token symbol or fiat symbol
     */
    symbol: string;
};
/**
 * @internal Exported for tests
 */
export declare function loadAccountBalance(props: {
    chain?: Chain;
    client: ThirdwebClient;
    address: Address;
    tokenAddress?: Address;
    showBalanceInFiat?: SupportedFiatCurrency;
}): Promise<AccountBalanceInfo>;
/**
 * Format the display balance for both crypto and fiat, in the Details button and Modal
 * If both crypto balance and fiat balance exist, we have to keep the string very short to avoid UI issues.
 * @internal
 * Used internally for the Details button and the Details Modal
 */
export declare function formatAccountTokenBalance(props: AccountBalanceInfo & {
    decimals: number;
}): string;
/**
 * Used internally for the Details button and Details Modal
 * @internal
 */
export declare function formatAccountFiatBalance(props: AccountBalanceInfo & {
    decimals: number;
}): string;
//# sourceMappingURL=account.d.ts.map