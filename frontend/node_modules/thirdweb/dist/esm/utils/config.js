let transactionDecorator = null;
/**
 * @internal
 */
export function setTransactionDecorator(decoratorFunction) {
    transactionDecorator = decoratorFunction;
}
/**
 * @internal
 */
export function clearTransactionDecorator() {
    transactionDecorator = null;
}
/**
 * @internal
 */
export function getTransactionDecorator() {
    return transactionDecorator;
}
//# sourceMappingURL=config.js.map