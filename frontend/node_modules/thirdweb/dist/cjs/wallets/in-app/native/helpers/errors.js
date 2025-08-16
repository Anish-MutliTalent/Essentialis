"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createErrorMessage = exports.ErrorMessages = void 0;
const json_js_1 = require("../../../../utils/json.js");
exports.ErrorMessages = {
    invalidOtp: "Your OTP code is invalid or expired. Please request a new code or try again.",
    missingRecoveryCode: "Missing encryption key for user",
};
const createErrorMessage = (message, error) => {
    if (error instanceof Error) {
        return `${message}: ${error.message}`;
    }
    return `${message}: ${(0, json_js_1.stringify)(error)}`;
};
exports.createErrorMessage = createErrorMessage;
//# sourceMappingURL=errors.js.map