/* tslint:disable */
/* eslint-disable */
/**
* @param {PublicKey} delegating_pk
* @param {Uint8Array} plaintext
* @returns {[Capsule, Uint8Array]}
*/
export function encrypt(delegating_pk: PublicKey, plaintext: Uint8Array): [Capsule, Uint8Array];
/**
* @param {SecretKey} delegating_sk
* @param {Capsule} capsule
* @param {Uint8Array} ciphertext
* @returns {Uint8Array}
*/
export function decryptOriginal(delegating_sk: SecretKey, capsule: Capsule, ciphertext: Uint8Array): Uint8Array;
/**
* @param {SecretKey} receiving_sk
* @param {PublicKey} delegating_pk
* @param {Capsule} capsule
* @param {VerifiedCapsuleFrag[]} vcfrags
* @param {Uint8Array} ciphertext
* @returns {Uint8Array}
*/
export function decryptReencrypted(receiving_sk: SecretKey, delegating_pk: PublicKey, capsule: Capsule, vcfrags: VerifiedCapsuleFrag[], ciphertext: Uint8Array): Uint8Array;
/**
* @param {SecretKey} delegating_sk
* @param {PublicKey} receiving_pk
* @param {Signer} signer
* @param {number} threshold
* @param {number} shares
* @param {boolean} sign_delegating_key
* @param {boolean} sign_receiving_key
* @returns {VerifiedKeyFrag[]}
*/
export function generateKFrags(delegating_sk: SecretKey, receiving_pk: PublicKey, signer: Signer, threshold: number, shares: number, sign_delegating_key: boolean, sign_receiving_key: boolean): VerifiedKeyFrag[];
/**
* @param {Capsule} capsule
* @param {VerifiedKeyFrag} kfrag
* @returns {VerifiedCapsuleFrag}
*/
export function reencrypt(capsule: Capsule, kfrag: VerifiedKeyFrag): VerifiedCapsuleFrag;
/**
*/
export class Capsule {
  free(): void;
/**
* @returns {string}
*/
  __getClassname(): string;
/**
* @returns {Uint8Array}
*/
  toBytes(): Uint8Array;
/**
* @returns {Uint8Array}
*/
  toBytesSimple(): Uint8Array;
/**
* @param {Uint8Array} data
* @returns {Capsule}
*/
  static fromBytes(data: Uint8Array): Capsule;
/**
* @returns {string}
*/
  toString(): string;
/**
* @param {Capsule} other
* @returns {boolean}
*/
  equals(other: Capsule): boolean;
}
/**
*/
export class CapsuleFrag {
  free(): void;
/**
* @param {Capsule} capsule
* @param {PublicKey} verifying_pk
* @param {PublicKey} delegating_pk
* @param {PublicKey} receiving_pk
* @returns {VerifiedCapsuleFrag}
*/
  verify(capsule: Capsule, verifying_pk: PublicKey, delegating_pk: PublicKey, receiving_pk: PublicKey): VerifiedCapsuleFrag;
/**
* @returns {Uint8Array}
*/
  toBytes(): Uint8Array;
/**
* @returns {Uint8Array}
*/
  toBytesSimple(): Uint8Array;
/**
* @param {Uint8Array} data
* @returns {CapsuleFrag}
*/
  static fromBytes(data: Uint8Array): CapsuleFrag;
/**
* @returns {string}
*/
  toString(): string;
/**
* @returns {VerifiedCapsuleFrag}
*/
  skipVerification(): VerifiedCapsuleFrag;
/**
* @param {CapsuleFrag} other
* @returns {boolean}
*/
  equals(other: CapsuleFrag): boolean;
}
/**
*/
export class CurvePoint {
  free(): void;
/**
* @returns {[Uint8Array, Uint8Array] | undefined}
*/
  coordinates(): [Uint8Array, Uint8Array] | undefined;
}
/**
*/
export class KeyFrag {
  free(): void;
/**
* @param {PublicKey} verifying_pk
* @param {PublicKey | null} delegating_pk
* @param {PublicKey | null} receiving_pk
* @returns {VerifiedKeyFrag}
*/
  verify(verifying_pk: PublicKey, delegating_pk: PublicKey | null, receiving_pk: PublicKey | null): VerifiedKeyFrag;
/**
* @returns {Uint8Array}
*/
  toBytes(): Uint8Array;
/**
* @param {Uint8Array} data
* @returns {KeyFrag}
*/
  static fromBytes(data: Uint8Array): KeyFrag;
/**
* @returns {string}
*/
  toString(): string;
/**
* @returns {VerifiedKeyFrag}
*/
  skipVerification(): VerifiedKeyFrag;
/**
* @param {KeyFrag} other
* @returns {boolean}
*/
  equals(other: KeyFrag): boolean;
}
/**
*/
export class Parameters {
  free(): void;
/**
*/
  constructor();
/**
*/
  readonly u: CurvePoint;
}
/**
*/
export class PublicKey {
  free(): void;
/**
* @returns {string}
*/
  __getClassname(): string;
/**
* @returns {Uint8Array}
*/
  toCompressedBytes(): Uint8Array;
/**
* @param {Uint8Array} data
* @returns {PublicKey}
*/
  static fromCompressedBytes(data: Uint8Array): PublicKey;
/**
* @param {Uint8Array} prehash
* @param {RecoverableSignature} signature
* @returns {PublicKey}
*/
  static recoverFromPrehash(prehash: Uint8Array, signature: RecoverableSignature): PublicKey;
/**
* @returns {string}
*/
  toString(): string;
/**
* @param {PublicKey} other
* @returns {boolean}
*/
  equals(other: PublicKey): boolean;
}
/**
*/
export class RecoverableSignature {
  free(): void;
/**
* @returns {Uint8Array}
*/
  toBEBytes(): Uint8Array;
/**
* @param {Uint8Array} data
* @returns {RecoverableSignature}
*/
  static fromBEBytes(data: Uint8Array): RecoverableSignature;
/**
* @returns {string}
*/
  toString(): string;
/**
* @param {RecoverableSignature} other
* @returns {boolean}
*/
  equals(other: RecoverableSignature): boolean;
}
/**
*/
export class ReencryptionEvidence {
  free(): void;
/**
* @param {Capsule} capsule
* @param {VerifiedCapsuleFrag} vcfrag
* @param {PublicKey} verifying_pk
* @param {PublicKey} delegating_pk
* @param {PublicKey} receiving_pk
*/
  constructor(capsule: Capsule, vcfrag: VerifiedCapsuleFrag, verifying_pk: PublicKey, delegating_pk: PublicKey, receiving_pk: PublicKey);
/**
* @returns {Uint8Array}
*/
  toBytes(): Uint8Array;
/**
* @param {Uint8Array} data
* @returns {ReencryptionEvidence}
*/
  static fromBytes(data: Uint8Array): ReencryptionEvidence;
/**
*/
  readonly e: CurvePoint;
/**
*/
  readonly e1: CurvePoint;
/**
*/
  readonly e1h: CurvePoint;
/**
*/
  readonly e2: CurvePoint;
/**
*/
  readonly ez: CurvePoint;
/**
*/
  readonly kfragSignatureV: boolean;
/**
*/
  readonly kfragValidityMessageHash: Uint8Array;
/**
*/
  readonly u1: CurvePoint;
/**
*/
  readonly u1h: CurvePoint;
/**
*/
  readonly u2: CurvePoint;
/**
*/
  readonly uz: CurvePoint;
/**
*/
  readonly v: CurvePoint;
/**
*/
  readonly v1: CurvePoint;
/**
*/
  readonly v1h: CurvePoint;
/**
*/
  readonly v2: CurvePoint;
/**
*/
  readonly vz: CurvePoint;
}
/**
*/
export class SecretKey {
  free(): void;
/**
* Generates a secret key using the default RNG and returns it.
* @returns {SecretKey}
*/
  static random(): SecretKey;
/**
* @returns {Uint8Array}
*/
  toBEBytes(): Uint8Array;
/**
* @param {Uint8Array} data
* @returns {SecretKey}
*/
  static fromBEBytes(data: Uint8Array): SecretKey;
/**
* Generates a secret key using the default RNG and returns it.
* @returns {PublicKey}
*/
  publicKey(): PublicKey;
/**
* @returns {string}
*/
  toString(): string;
}
/**
*/
export class SecretKeyFactory {
  free(): void;
/**
* Generates a secret key factory using the default RNG and returns it.
* @returns {SecretKeyFactory}
*/
  static random(): SecretKeyFactory;
/**
* @returns {number}
*/
  static seedSize(): number;
/**
* @param {Uint8Array} seed
* @returns {SecretKeyFactory}
*/
  static fromSecureRandomness(seed: Uint8Array): SecretKeyFactory;
/**
* @param {Uint8Array} label
* @returns {Uint8Array}
*/
  makeSecret(label: Uint8Array): Uint8Array;
/**
* @param {Uint8Array} label
* @returns {SecretKey}
*/
  makeKey(label: Uint8Array): SecretKey;
/**
* @param {Uint8Array} label
* @returns {SecretKeyFactory}
*/
  makeFactory(label: Uint8Array): SecretKeyFactory;
/**
* @returns {string}
*/
  toString(): string;
}
/**
*/
export class Signature {
  free(): void;
/**
* @param {PublicKey} verifying_pk
* @param {Uint8Array} message
* @returns {boolean}
*/
  verify(verifying_pk: PublicKey, message: Uint8Array): boolean;
/**
* @returns {Uint8Array}
*/
  toDerBytes(): Uint8Array;
/**
* @param {Uint8Array} data
* @returns {Signature}
*/
  static fromDerBytes(data: Uint8Array): Signature;
/**
* @returns {Uint8Array}
*/
  toBEBytes(): Uint8Array;
/**
* @param {Uint8Array} data
* @returns {Signature}
*/
  static fromBEBytes(data: Uint8Array): Signature;
/**
* @returns {string}
*/
  toString(): string;
/**
* @param {Signature} other
* @returns {boolean}
*/
  equals(other: Signature): boolean;
}
/**
*/
export class Signer {
  free(): void;
/**
* @param {SecretKey} secret_key
*/
  constructor(secret_key: SecretKey);
/**
* @param {Uint8Array} message
* @returns {Signature}
*/
  sign(message: Uint8Array): Signature;
/**
* @returns {PublicKey}
*/
  verifyingKey(): PublicKey;
/**
* @returns {string}
*/
  toString(): string;
}
/**
*/
export class VerifiedCapsuleFrag {
  free(): void;
/**
* @returns {string}
*/
  __getClassname(): string;
/**
* @returns {CapsuleFrag}
*/
  unverify(): CapsuleFrag;
/**
* @returns {Uint8Array}
*/
  toBytes(): Uint8Array;
/**
* @returns {Uint8Array}
*/
  toBytesSimple(): Uint8Array;
/**
* @returns {string}
*/
  toString(): string;
/**
* @param {VerifiedCapsuleFrag} other
* @returns {boolean}
*/
  equals(other: VerifiedCapsuleFrag): boolean;
}
/**
*/
export class VerifiedKeyFrag {
  free(): void;
/**
* @returns {string}
*/
  __getClassname(): string;
/**
* @returns {Uint8Array}
*/
  toBytes(): Uint8Array;
/**
* @returns {string}
*/
  toString(): string;
/**
* @param {VerifiedKeyFrag} other
* @returns {boolean}
*/
  equals(other: VerifiedKeyFrag): boolean;
}
