"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = logoutUser;
const local_js_1 = require("../storage/local.js");
async function logoutUser(args) {
    const isLoggedUserOutIncognito = await args.storage.removeAuthCookie();
    await (0, local_js_1.removeLoggedInWalletUserId)(args.client.clientId); // TODO (enclave): move this to client scoped storage
    return { success: isLoggedUserOutIncognito };
}
//# sourceMappingURL=logout.js.map