// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { useActiveAccount } from 'thirdweb/react';

// Dashboard content components
import DashboardHome from './components/UI/dashboard/content/DashboardHome';
import MyDocs from './components/UI/dashboard/content/MyDocs';
import Settings from './components/UI/dashboard/content/Settings';
import CompleteProfileForm from './components/UI/dashboard/content/CompleteProfileForm';
import MintDocPage from './components/UI/dashboard/content/MintDocPage';
import DocView from './components/UI/dashboard/content/DocView';
import EditDocPage from './components/UI/dashboard/content/EditDocPage';
import DocHistory from './components/UI/dashboard/content/DocHistory';

// ProtectedRoute component
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
      <div className="min-h-screen bg-black">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          >
            {/* Nested Routes - these will render inside DashboardPage's <Outlet /> */}
            <Route index element={<DashboardHome />} />
            <Route path="my-docs" element={<MyDocs />} />
            <Route path="mint-doc" element={<MintDocPage />} />
            <Route path="settings" element={<Settings />} />
            <Route path="complete-profile" element={<CompleteProfileForm />} />
            <Route path="my-docs/:tokenId/view" element={<DocView />} />
            <Route path="my-docs/:tokenId/edit" element={<EditDocPage />} />
            <Route path="my-docs/:tokenId/history" element={<DocHistory />} />
          </Route>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;