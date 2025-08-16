import type { ThirdwebClient } from "../../../../client/client.js";
/**
 * This component (file) will eventually be replaced with the ChainIcon prebuilt version.
 * @internal
 */
export declare const ChainIcon: React.FC<{
    chainIconUrl?: string;
    size: string;
    active?: boolean;
    className?: string;
    loading?: "lazy" | "eager";
    client: ThirdwebClient;
}>;
/**
 * @internal
 */
export declare const getSrcChainIcon: (props: {
    client: ThirdwebClient;
    chainIconUrl?: string;
}) => string;
//# sourceMappingURL=ChainIcon.d.ts.map