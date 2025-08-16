/**
 * @internal
 */
type Semver = {
    major: number;
    minor: number;
    patch: number;
    versionString: string;
};
/**
 * @internal
 * @param version - The version to convert to a Semver
 */
export declare function toSemver(version: string): Semver;
/**
 * @internal
 * @param current - The current version
 * @param next - The next version
 */
export declare function isIncrementalVersion(current: string, next: string): boolean;
export {};
//# sourceMappingURL=semver.d.ts.map