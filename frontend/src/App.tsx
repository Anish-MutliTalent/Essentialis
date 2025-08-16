// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import DashboardPage from './pages/DashboardPage'; // Import the new page
import { useActiveAccount } from 'thirdweb/react';

// Placeholder content components for nested routes
import DashboardHome from './components/UI/dashboard/content/DashboardHome';
import MyDocs from './components/UI/dashboard/content/MyDocs';
import Settings from './components/UI/dashboard/content/Settings';
import CompleteProfileForm from './components/UI/dashboard/content/CompleteProfileForm'; // Import the form
import MintDocPage from './components/UI/dashboard/content/MintDocPage'; // Import the new Mint Doc page
import DocView from './components/UI/dashboard/content/DocView'; // Import the Doc view component
import EditDocPage from './components/UI/dashboard/content/EditDocPage'; // Import the Edit Doc page
import DocHistory from './components/UI/dashboard/content/DocHistory'; // Import the Doc history component

// ProtectedRoute remains the same
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const account = useActiveAccount();
  if (!account) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      {/* Removed the global nav bar as requested for the dashboard view */}
      {/* You might want a different approach if you need nav on login page */}
      <div className="min-h-screen bg-gray-900"> {/* Ensure base background */}
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard" // Parent route for dashboard layout
            element={
              <ProtectedRoute>
                <DashboardPage /> {/* Renders the layout (sidebars + content outlet) */}
              </ProtectedRoute>
            }
          >
            {/* Nested Routes - these will render inside DashboardPage's <Outlet /> */}
            <Route index element={<DashboardHome />} /> {/* Default view at /dashboard */}
            <Route path="my-docs" element={<MyDocs />} />
            <Route path="mint-doc" element={<MintDocPage />} /> {/* Add new route for minting */}
            <Route path="settings" element={<Settings />} />
            {/* Add a route for the profile completion form */}
            <Route path="complete-profile" element={<CompleteProfileForm />} />
            <Route path="my-docs/:tokenId/view" element={<DocView />} /> {/* Add route for Doc view */}
            <Route path="my-docs/:tokenId/edit" element={<EditDocPage />} /> {/* Add route for editing Doc */}
            <Route path="my-docs/:tokenId/history" element={<DocHistory />} /> {/* Add route for Doc history */}
             {/* Add more nested routes as needed */}
          </Route>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;