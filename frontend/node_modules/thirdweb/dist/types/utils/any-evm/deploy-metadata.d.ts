import type { Abi } from "abitype";
import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import type { Prettify } from "../type-utils.js";
type FetchDeployMetadataOptions = {
    uri: string;
    client: ThirdwebClient;
};
export type FetchDeployMetadataResult = Partial<ExtendedMetadata> & CompilerMetadata;
/**
 * Fetches the deployment metadata.
 * @param options - The options for fetching the deploy metadata.
 * @returns An object containing the compiler metadata and extended metadata.
 * @internal
 */
export declare function fetchDeployMetadata(options: FetchDeployMetadataOptions): Promise<FetchDeployMetadataResult>;
export declare function fetchBytecodeFromCompilerMetadata(options: {
    compilerMetadata: FetchDeployMetadataResult;
    client: ThirdwebClient;
    chain: Chain;
}): Promise<`0x${string}`>;
type RawCompilerMetadata = {
    name: string;
    metadataUri: string;
    bytecodeUri: string;
    analytics?: any;
    version?: string;
    [key: string]: unknown;
};
type ParsedCompilerMetadata = {
    name: string;
    abi: Abi;
    metadata: {
        compiler: {
            version: string;
        };
        language: string;
        output: {
            abi: Abi;
            devdoc: Record<string, unknown>;
            userdoc: Record<string, unknown>;
        };
        settings: {
            compilationTarget: Record<string, unknown>;
            evmVersion: string;
            libraries: Record<string, string>;
            optimizer: Record<string, unknown>;
            remappings: string[];
        };
        sources: Record<string, {
            keccak256: string;
        } & ({
            content: string;
        } | {
            urls: string[];
            license?: string;
        })>;
        [key: string]: unknown;
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
export type DynamicParams = {
    type: "address" | "address[]" | "bytes" | "bytes[]";
    refContracts?: Array<{
        contractId: string;
        publisherAddress: string;
        version: string;
        salt?: string;
    }>;
    paramsToEncode?: Array<Array<{
        type: string;
        defaultValue?: string;
        dynamicValue?: DynamicParams;
    }>>;
};
export type CompilerMetadata = Prettify<RawCompilerMetadata & ParsedCompilerMetadata>;
export type ExtendedMetadata = {
    name: string;
    version: string;
    metadataUri: string;
    bytecodeUri: string;
    description?: string | undefined;
    defaultExtensions?: {
        extensionName: string;
        extensionVersion: string;
        publisherAddress: string;
    }[] | undefined;
    defaultModules?: Array<{
        moduleName: string;
        moduleVersion: string;
        publisherAddress: string;
    }> | undefined;
    publisher?: string | undefined;
    audit?: string | undefined;
    logo?: string | undefined;
    displayName?: string | undefined;
    readme?: string | undefined;
    tags?: string[] | undefined;
    changelog?: string | undefined;
    isDeployableViaFactory?: boolean | undefined;
    isDeployableViaProxy?: boolean | undefined;
    factoryDeploymentData?: {
        implementationAddresses: Record<string, string>;
        implementationInitializerFunction: string;
        customFactoryInput?: {
            factoryFunction: string;
            params: Array<{
                name: string;
                type: string;
            }>;
            customFactoryAddresses: Record<string, string>;
        };
        modularFactoryInput?: {
            hooksParamName: string;
        };
        factoryAddresses?: Record<string, string>;
    } | undefined;
    deployType?: "standard" | "autoFactory" | "customFactory";
    routerType?: "none" | "plugin" | "dynamic" | "modular";
    networksForDeployment?: {
        allNetworks?: boolean;
        networksEnabled?: number[];
    };
    constructorParams?: Record<string, {
        displayName?: string;
        description?: string;
        defaultValue?: string;
        hidden?: boolean;
        dynamicValue?: DynamicParams;
    }>;
    implConstructorParams?: Record<string, {
        defaultValue?: string;
        dynamicValue?: DynamicParams;
    }>;
    compositeAbi?: Abi;
    compilers?: Record<"solc" | "zksolc" | "stylus", {
        evmVersion: string;
        compilerVersion: string;
        metadataUri: string;
        bytecodeUri: string;
    }[]>;
    externalLinks?: Array<{
        name: string;
        url: string;
    }>;
    [key: string]: unknown;
};
export {};
//# sourceMappingURL=deploy-metadata.d.ts.map