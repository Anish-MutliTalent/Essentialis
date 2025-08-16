import { stringify } from "../../../../utils/json.js";
export const ErrorMessages = {
    invalidOtp: "Your OTP code is invalid or expired. Please request a new code or try again.",
    missingRecoveryCode: "Missing encryption key for user",
};
export const createErrorMessage = (message, error) => {
    if (error instanceof Error) {
        return `${message}: ${error.message}`;
    }
    return `${message}: ${stringify(error)}`;
};
//# sourceMappingURL=errors.js.map