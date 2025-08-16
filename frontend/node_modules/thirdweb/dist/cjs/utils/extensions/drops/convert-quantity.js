"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertQuantity = convertQuantity;
const Solidity_1 = require("ox/Solidity");
const units_js_1 = require("../../units.js");
function convertQuantity(options) {
    const { quantity, tokenDecimals } = options;
    if (quantity === "unlimited") {
        return Solidity_1.maxUint256;
    }
    return (0, units_js_1.toUnits)(quantity, tokenDecimals);
}
//# sourceMappingURL=convert-quantity.js.map