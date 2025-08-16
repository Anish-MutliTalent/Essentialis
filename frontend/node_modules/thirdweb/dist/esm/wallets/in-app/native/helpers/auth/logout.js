import { removeLoggedInWalletUserId } from "../storage/local.js";
export async function logoutUser(args) {
    const isLoggedUserOutIncognito = await args.storage.removeAuthCookie();
    await removeLoggedInWalletUserId(args.client.clientId); // TODO (enclave): move this to client scoped storage
    return { success: isLoggedUserOutIncognito };
}
//# sourceMappingURL=logout.js.map