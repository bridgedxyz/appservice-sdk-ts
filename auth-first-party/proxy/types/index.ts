/**
 * (This is not a OAuth) Proxy mode designed for internal bridged's product authentication for non-browser platforms.
 */
export enum ProxyAuthenticationMode {
    /**
     * resolves the async request with ws connection.
     * authenticate using bridged's official websocket proxy for non browser url callback supported platforms.
     */
    ws = "ws",
    /**
     * resolves the async request with sse result. - not recommanded. only available for request within under 6 seconds.
     */
    sse = "sse",
    /**
     * if mode is none, the request client will have to check the result manually with time interval based long-polling.
     */
    long_polling = "long-polling",
    none = "none",
}

/**
 * Client model
 * 
 * 
 * e.g.
 * ``` json
{
  "id": "0a446c8b-11c4-455e-a410-2ebabf457896",
  "expiresAt": "2021-05-30T00:10:47.681Z",
  "mode": "websocket-proxy",
  "authUrl": "https://accounts.bridged.xyz"
}
 * ```
 */
export interface AuthProxySessionStartResult {
    id: string;
    mode: ProxyAuthenticationMode;
    expiresAt: Date;
    authUrl: string;
}

/**
 * the request dto
 */
export interface AuthProxySessionStartRequest {
    appId: _BridgedFirstPartyAuthProxyEnabledApp;
    /**
     * the client instance id. - this may be managed locally.
     */
    clientId: string;
    mode: ProxyAuthenticationMode;
    /**
     * redirect after authentication is complete.
     * e.g. `https://bridged.xyz` | `bridged://app-main` | `any_uri`
     *
     * exceptionally follows snake_case naming convention to match url param.
     * If non specified, it will use the default fallback logic for each app's central configuration - e.g. `xyz.bridged.assistant.figma` will automatically redirect to `figma://`
     */
    redirect_uri?: string;
}

/**
 * solid & static app id of auth proxy enabled (allowed) bridged apps. other than below will be blocked to perform auth proxy.
 * use .(dot) and _(underscore) for specifing app id. (also package id)
 */
export type _BridgedFirstPartyAuthProxyEnabledApp =
    | "xyz.bridged.developer_sandbox" // bridged developer sandbox abstract dummy app
    | "xyz.bridged.assistant" // bridged assistant
    | "xyz.bridged.assistant.figma" // bridged assistant (on figma)
    | "xyz.bridged.assistant.sketch" // bridged assistant (on sketch)
    | "xyz.bridged.assistant.xd" // bridged assistant (on xd)
    | "xyz.bridged.bridged" // bridged desktop app
    | "xyz.bridged.cli" // bridged cli login
    | "xyz.bridged.vscode" // bridged vscode extension
    | "xyz.bridged.jetbrains"; // bridged jetbrains plugin

/**
 * result object of proxy auth. this exposes the access_token.
 *
 * this is not used on a browser environment, safely used preventing attacks.
 *
 * this token is requested by the user, only exposed to the requester.
 *
 * e.g. CLI login uses the proxy auth. request from cli, login from browser, token via proxy (ws, sse, grpc, etc..)
 */
export interface ProxyAuthResult {
    /**
     * ping of the clientId. same as request.
     */
    clientId: string;
    /**
     * success result of the process. success can be false when user cancel the process on the browser, or proxy session is expired (timeout)
     */
    success: boolean;
    message: string;
    /**
     * access token issued by proxy auth request. saved on a secure place, for only non-browser environment.
     *
     * `+` this field exceptionally follows snake_case naming.
     *
     * `access_token` will be empty when process failed (success is false)
     */
    access_token?: string;
}
