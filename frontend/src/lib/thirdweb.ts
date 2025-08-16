// src/lib/thirdweb.ts
import { createThirdwebClient } from "thirdweb";

const clientId = '2983fcb839dcac274ead62facc1aa529';

if (!clientId) {
  throw new Error(
    "Missing VITE_THIRDWEB_CLIENT_ID environment variable. " +
    "Please create a .env file in your frontend root with VITE_THIRDWEB_CLIENT_ID="
  );
}

export const client = createThirdwebClient({
  clientId: clientId,
});