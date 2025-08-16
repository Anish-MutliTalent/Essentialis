import type { Abi } from "abitype";
/**
 * @contract
 */
export type CompilerMetadata = {
    name: string;
    abi: Abi;
    metadata: Record<string, any> & {
        sources: Record<string, {
            content: string;
        } | {
            urls: string[];
        }>;
        output: {
            abi: Abi;
            devdoc?: Record<string, Record<string, {
                details: string;
            }>>;
            userdoc?: Record<string, Record<string, {
                notice: string;
            }>>;
        };
    };
    info: {
        title?: string;
        author?: string;
        details?: string;
        notice?: string;
    };
    licenses: string[];
    isPartialAbi?: boolean;
    zk_version?: string;
};
/**
 * Formats the compiler metadata into a standardized format.
 * @param metadata - The compiler metadata to be formatted.
 * @returns The formatted metadata.
 * @internal
 */
export declare function formatCompilerMetadata(metadata: any): CompilerMetadata;
//# sourceMappingURL=compiler-metadata.d.ts.map