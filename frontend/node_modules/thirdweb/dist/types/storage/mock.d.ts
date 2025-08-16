/**
 * Extracts file contents from FormData and stores it as JSON
 * @returns The storage key with filename if present
 */
export declare function addToMockStorage(value: FormData): Promise<string[]>;
/**
 * Retrieves parsed JSON data from storage
 * @returns The parsed data object or undefined if not found
 */
export declare function getFromMockStorage(key: string): unknown;
//# sourceMappingURL=mock.d.ts.map