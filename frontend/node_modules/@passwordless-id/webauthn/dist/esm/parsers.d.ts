import { Base64URLString, CollectedClientData, NamedAlgo, AuthenticatorParsed, RegistrationJSON, RegistrationInfo, AuthenticationInfo, AuthenticationJSON } from './types.js';
export declare function parseClient(data: Base64URLString | ArrayBuffer): CollectedClientData;
export declare function parseAuthenticator(authData: Base64URLString | ArrayBuffer): AuthenticatorParsed;
export declare function getAlgoName(num: COSEAlgorithmIdentifier): NamedAlgo;
export declare function parseRegistration(registrationJson: RegistrationJSON): RegistrationInfo;
export declare function toRegistrationInfo(registrationJson: RegistrationJSON, authenticator: AuthenticatorParsed): RegistrationInfo;
export declare function toAuthenticationInfo(authenticationJson: AuthenticationJSON, authenticator: AuthenticatorParsed): AuthenticationInfo;
export declare function parseAuthentication(authenticationJson: AuthenticationJSON): AuthenticationInfo;
