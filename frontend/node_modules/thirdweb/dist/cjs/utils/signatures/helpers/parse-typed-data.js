"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTypedData = parseTypedData;
const ox__Hex = require("ox/Hex");
/**
 * @internal
 */
function parseTypedData(typedData) {
    const domain = typedData.domain;
    if (domain?.chainId !== undefined && ox__Hex.validate(domain.chainId)) {
        typedData.domain = {
            ...typedData.domain,
            chainId: ox__Hex.toNumber(typedData.domain.chainId),
        };
    }
    return typedData;
}
//# sourceMappingURL=parse-typed-data.js.map