import type { ClientScopedStorage } from "../../../../../wallets/in-app/core/authentication/client-scoped-storage.js";
import type { Ecosystem } from "../../../../../wallets/in-app/core/wallet/types.js";
type IFrameCommunicatorProps = {
    link: string;
    baseUrl: string;
    iframeId: string;
    container?: HTMLElement;
    onIframeInitialize?: () => void;
    localStorage: ClientScopedStorage;
    clientId: string;
    ecosystem?: Ecosystem;
};
/**
 * @internal
 */
export declare class IframeCommunicator<T extends {
    [key: string]: any;
}> {
    private iframe?;
    private POLLING_INTERVAL_SECONDS;
    private iframeBaseUrl;
    protected localStorage: ClientScopedStorage;
    protected clientId: string;
    protected ecosystem?: Ecosystem;
    /**
     * @internal
     */
    constructor({ link, baseUrl, iframeId, container, onIframeInitialize, localStorage, clientId, ecosystem, }: IFrameCommunicatorProps);
    protected onIframeLoadedInitVariables(): Promise<Record<string, any>>;
    /**
     * @internal
     */
    onIframeLoadHandler(iframe: HTMLIFrameElement, onIframeInitialize?: () => void): () => Promise<void>;
    /**
     * @internal
     */
    call<ReturnData>({ procedureName, params, showIframe, }: {
        procedureName: keyof T;
        params: T[keyof T];
        showIframe?: boolean;
    }): Promise<ReturnData>;
    /**
     * This has to be called by any iframe that will be removed from the DOM.
     * Use to make sure that we reset the global loaded state of the particular iframe.src
     * @internal
     */
    destroy(): void;
}
export {};
//# sourceMappingURL=IframeCommunicator.d.ts.map