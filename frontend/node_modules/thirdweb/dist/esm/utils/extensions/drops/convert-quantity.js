import { maxUint256 } from "ox/Solidity";
import { toUnits } from "../../units.js";
export function convertQuantity(options) {
    const { quantity, tokenDecimals } = options;
    if (quantity === "unlimited") {
        return maxUint256;
    }
    return toUnits(quantity, tokenDecimals);
}
//# sourceMappingURL=convert-quantity.js.map