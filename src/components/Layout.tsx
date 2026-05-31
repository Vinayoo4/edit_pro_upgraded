import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Leaf, ShoppingCart, Settings, Calendar, LayoutDashboard, Star, WifiOff, Wifi } from 'lucide-react';

const Layout: React.FC = () => {
  const { currentUser, progress } = useAppStore();
  const location = useLocation();
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

  if (!currentUser) return null;

  const todayStr = new Date().toDateString();
  const todayCookedCount = Object.values(progress).filter(p => {
      if (typeof p !== 'object' || p.status !== 'cooked') return false;
      return new Date(p.updatedAt).toDateString() === todayStr;
  }).length;

  const getLinkClass = (path: string) => {
      return location.pathname.startsWith(path)
          ? 'text-green-600 font-bold flex flex-col items-center'
          : 'text-gray-600 hover:text-green-600 font-medium flex flex-col items-center';
  };

  const getDesktopLinkClass = (path: string) => {
      return location.pathname.startsWith(path)
          ? 'text-green-600 font-bold flex items-center gap-1 relative'
          : 'text-gray-600 hover:text-green-600 font-medium flex items-center gap-1 relative';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm border-b sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-green-600 font-bold text-xl">
            <Leaf className="w-6 h-6" />
            <span className="hidden sm:inline">VeganHub</span>
          </Link>

          <nav className="hidden md:flex gap-6 items-center">
            <Link to="/dashboard" className={getDesktopLinkClass('/dashboard')}>
              Dashboard
              {todayCookedCount > 0 && (
                  <span className="absolute -top-2 -right-4 bg-green-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {todayCookedCount}
                  </span>
              )}
            </Link>
            <Link to="/plans" className={getDesktopLinkClass('/plans')}>Plans</Link>
            <Link to="/groceries" className={getDesktopLinkClass('/groceries')}>Groceries</Link>
            <Link to="/membership" className={getDesktopLinkClass('/membership')}>Premium</Link>

            {currentUser.isAdmin && (
                <Link to="/admin" className={getDesktopLinkClass('/admin')}>
                    <Settings className="w-4 h-4" /> Admin
                </Link>
            )}

            <div className="ml-4 flex items-center gap-4 pl-4 border-l">
              <div className="flex items-center gap-2" title={isOffline ? 'Offline' : 'Online'}>
                  {isOffline ? <WifiOff className="w-4 h-4 text-red-500" /> : <Wifi className="w-4 h-4 text-green-500" />}
              </div>
              <Link to="/profile" className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold">
                      {currentUser.name.charAt(0)}
                  </div>
              </Link>
            </div>
          </nav>

          <div className="md:hidden flex items-center gap-4">
              <div className="flex items-center gap-2">
                  {isOffline ? <WifiOff className="w-5 h-5 text-red-500" /> : <Wifi className="w-5 h-5 text-green-500" />}
              </div>
              <Link to="/profile" className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-700 rounded-full font-bold">
                  {currentUser.name.charAt(0)}
              </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-5xl mx-auto w-full px-4 py-8">
        <Outlet />
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden bg-white border-t flex justify-around p-3 fixed bottom-0 w-full z-30 pb-safe">
        <Link to="/dashboard" className={getLinkClass('/dashboard')}>
          <div className="relative">
              <LayoutDashboard className="w-6 h-6" />
              {todayCookedCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-green-500 text-white text-[10px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                      {todayCookedCount}
                  </span>
              )}
          </div>
          <span className="text-[10px] mt-1 font-medium">Dashboard</span>
        </Link>
        <Link to="/plans" className={getLinkClass('/plans')}>
          <Calendar className="w-6 h-6" />
          <span className="text-[10px] mt-1 font-medium">Plans</span>
        </Link>
        <Link to="/groceries" className={getLinkClass('/groceries')}>
          <ShoppingCart className="w-6 h-6" />
          <span className="text-[10px] mt-1 font-medium">List</span>
        </Link>
        <Link to="/membership" className={getLinkClass('/membership')}>
          <Star className="w-6 h-6" />
          <span className="text-[10px] mt-1 font-medium">Premium</span>
        </Link>
        {currentUser.isAdmin && (
            <Link to="/admin" className={getLinkClass('/admin')}>
            <Settings className="w-6 h-6" />
            <span className="text-[10px] mt-1 font-medium">Admin</span>
            </Link>
        )}
      </nav>
      {/* Padding for mobile nav */}
      <div className="h-20 md:hidden"></div>
    </div>
  );
};

export default Layout;
