import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Leaf, ShoppingCart, Settings, Calendar, Menu } from 'lucide-react';

const Layout: React.FC = () => {
  const { currentUser, toggleMembershipTier } = useAppStore();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-green-600 font-bold text-xl">
            <Leaf className="w-6 h-6" />
            <span>VeganHub</span>
          </Link>

          <nav className="hidden md:flex gap-6 items-center">
            <Link to="/" className="text-gray-600 hover:text-green-600 font-medium">Plans</Link>
            <Link to="/groceries" className="text-gray-600 hover:text-green-600 font-medium flex items-center gap-1">
              <ShoppingCart className="w-4 h-4" /> Groceries
            </Link>
            <Link to="/admin" className="text-gray-600 hover:text-green-600 font-medium flex items-center gap-1">
              <Settings className="w-4 h-4" /> Admin
            </Link>

            <div className="ml-4 flex items-center gap-2">
              <span className="text-sm text-gray-500">Tier: {currentUser.tier}</span>
              <button
                onClick={toggleMembershipTier}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
              >
                Toggle
              </button>
            </div>
          </nav>

          <button className="md:hidden text-gray-600">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="flex-grow max-w-5xl mx-auto w-full px-4 py-8">
        <Outlet />
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden bg-white border-t flex justify-around p-3 fixed bottom-0 w-full">
        <Link to="/" className="flex flex-col items-center text-gray-600">
          <Calendar className="w-6 h-6" />
          <span className="text-xs mt-1">Plans</span>
        </Link>
        <Link to="/groceries" className="flex flex-col items-center text-gray-600">
          <ShoppingCart className="w-6 h-6" />
          <span className="text-xs mt-1">List</span>
        </Link>
        <Link to="/admin" className="flex flex-col items-center text-gray-600">
          <Settings className="w-6 h-6" />
          <span className="text-xs mt-1">Admin</span>
        </Link>
      </nav>
      {/* Padding for mobile nav */}
      <div className="h-16 md:hidden"></div>
    </div>
  );
};

export default Layout;
