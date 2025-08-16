import { randomBytesHex } from "../utils/random.js";
const mockStorage = new Map();
/**
 * Extracts file contents from FormData and stores it as JSON
 * @returns The storage key with filename if present
 */
export async function addToMockStorage(value) {
    const key = randomBytesHex();
    // Get the first file from FormData
    const files = value.getAll("file");
    if (!files) {
        throw new Error("No file found in FormData");
    }
    // Read file contents
    return Promise.all(files.map(async (file) => {
        const text = await file.text();
        let data;
        try {
            // Parse the contents as JSON
            data = JSON.parse(text);
        }
        catch {
            throw new Error("File contents must be valid JSON");
        }
        // If file has a name, return key/filename format
        const filename = "name" in file && file.name ? file.name.replace("files/", "") : "";
        //   console.log("mockStorage upload", key, data, filename);
        const hash = `${key}${filename ? `/${filename}` : ""}`;
        mockStorage.set(hash, data);
        return `ipfs://${hash}`;
    }));
}
/**
 * Retrieves parsed JSON data from storage
 * @returns The parsed data object or undefined if not found
 */
export function getFromMockStorage(key) {
    const data = mockStorage.get(key);
    //   console.log("mockStorage get", key, data);
    return data;
}
//# sourceMappingURL=mock.js.map