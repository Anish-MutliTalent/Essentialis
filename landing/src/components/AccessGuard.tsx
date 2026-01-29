import { Navigate, useLocation } from 'react-router-dom';

const AccessGuard = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();
    const hasAccess = sessionStorage.getItem('access_granted') === 'true';

    if (!hasAccess) {
        return <Navigate to="/access" replace state={{ from: location }} />;
    }

    return <>{children}</>;
};

export default AccessGuard;
