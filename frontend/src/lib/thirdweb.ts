// src/lib/thirdweb.ts
import { createThirdwebClient } from "thirdweb";

const clientId = 'cc209168f439bfb60ef6659d4de3c6d1';

if (!clientId) {
  throw new Error(
    "Missing VITE_THIRDWEB_CLIENT_ID environment variable. " +
    "Please create a .env file in your frontend root with VITE_THIRDWEB_CLIENT_ID="
  );
}

export const client = createThirdwebClient({
  clientId: clientId,
});