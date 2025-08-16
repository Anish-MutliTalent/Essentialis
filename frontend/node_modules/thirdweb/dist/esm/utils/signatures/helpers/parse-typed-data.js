import * as ox__Hex from "ox/Hex";
/**
 * @internal
 */
export function parseTypedData(typedData) {
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