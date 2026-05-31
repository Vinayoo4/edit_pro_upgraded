import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import PlansList from './pages/PlansList';
import PlanDetail from './pages/PlanDetail';
import RecipeDetail from './pages/RecipeDetail';
import GroceryList from './pages/GroceryList';
import Admin from './pages/Admin';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Membership from './pages/Membership';
import Login from './pages/Login';
import InstallPrompt from './components/pwa/InstallPrompt';
import UpdateBanner from './components/pwa/UpdateBanner';
import { useAppStore } from './store/useAppStore';

const ProtectedRoute: React.FC<{ children: React.ReactNode, adminOnly?: boolean }> = ({ children, adminOnly }) => {
    const { isAuthenticated, currentUser } = useAppStore();

    if (!isAuthenticated || !currentUser) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && !currentUser.isAdmin) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};

const App: React.FC = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <BrowserRouter>
      <UpdateBanner />
      {isOffline && (
        <div className="bg-yellow-500 text-white text-center py-1 text-sm font-medium sticky top-0 z-40">
          Offline — progress saves locally
        </div>
      )}
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="plans" element={<PlansList />} />
          <Route path="plan/:id" element={<PlanDetail />} />
          <Route path="recipe/:id" element={<RecipeDetail />} />
          <Route path="groceries" element={<GroceryList />} />
          <Route path="membership" element={<Membership />} />
          <Route path="profile" element={<Profile />} />
          <Route path="admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
        </Route>
      </Routes>
      <InstallPrompt />
    </BrowserRouter>
  );
};

export default App;
