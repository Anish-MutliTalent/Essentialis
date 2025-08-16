"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addChecksum = void 0;
const ethers_1 = require("ethers");
const stringifyReplacer = (_, value) => value === undefined ? null : value;
const serializeJSONObject = (json) => {
    if (Array.isArray(json)) {
        return `[${json.map((el) => serializeJSONObject(el)).join(',')}]`;
    }
    if (typeof json === 'object' && json !== null) {
        let acc = '';
        const keys = Object.keys(json).sort();
        acc += `{${JSON.stringify(keys, stringifyReplacer)}`;
        for (const key of keys) {
            acc += `${serializeJSONObject(json[key])},`;
        }
        return `${acc}}`;
    }
    return `${JSON.stringify(json, stringifyReplacer)}`;
};
const calculateChecksum = (batchFile) => {
    const serialized = serializeJSONObject(Object.assign(Object.assign({}, batchFile), { meta: Object.assign(Object.assign({}, batchFile.meta), { name: null }) }));
    const sha = ethers_1.ethers.utils.solidityKeccak256(['string'], [serialized]);
    return sha || undefined;
};
const addChecksum = (batchFile) => {
    return Object.assign(Object.assign({}, batchFile), { meta: Object.assign(Object.assign({}, batchFile.meta), { checksum: calculateChecksum(batchFile) }) });
};
exports.addChecksum = addChecksum;
//# sourceMappingURL=gnosis-safe-checksum.js.map