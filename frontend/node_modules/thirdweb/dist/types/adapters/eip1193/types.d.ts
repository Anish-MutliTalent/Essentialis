export type EIP1193Provider = {
    on(event: any, listener: (params: any) => any): void;
    removeListener(event: any, listener: (params: any) => any): void;
    request: (params: any) => Promise<any>;
};
//# sourceMappingURL=types.d.ts.map