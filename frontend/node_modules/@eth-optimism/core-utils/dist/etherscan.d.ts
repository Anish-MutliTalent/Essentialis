interface NetworkData {
    chainId: number;
    names: string[];
    etherscanApiUrl: string;
}
export declare class Etherscan {
    private readonly apiKey;
    private readonly network;
    net: NetworkData;
    constructor(apiKey: string, network: string | number);
    getContractSource(address: string): Promise<any>;
    getContractABI(address: string): Promise<any>;
}
export {};
