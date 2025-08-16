"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setTransactionDecorator = setTransactionDecorator;
exports.clearTransactionDecorator = clearTransactionDecorator;
exports.getTransactionDecorator = getTransactionDecorator;
let transactionDecorator = null;
/**
 * @internal
 */
function setTransactionDecorator(decoratorFunction) {
    transactionDecorator = decoratorFunction;
}
/**
 * @internal
 */
function clearTransactionDecorator() {
    transactionDecorator = null;
}
/**
 * @internal
 */
function getTransactionDecorator() {
    return transactionDecorator;
}
//# sourceMappingURL=config.js.map