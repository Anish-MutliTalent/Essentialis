import { Navigate, useLocation } from 'react-router-dom';
import { useActiveAccount } from 'thirdweb/react';

const AccessGuard = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();
    const account = useActiveAccount();
    const hasAccess = sessionStorage.getItem('access_granted') === 'true';

    // If user is already logged in (wallet connected), they implicitly have access (skip gate).
    // Or if they have the session token.
    if (!hasAccess && !account) {
        console.log("[AccessGuard] Redirecting to /access (No access, no account)");
        return <Navigate to="/access" replace state={{ from: location }} />;
    }

    console.log("[AccessGuard] Granting Access");
    return <>{children}</>;
};

export default AccessGuard;
