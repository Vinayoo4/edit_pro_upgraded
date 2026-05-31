import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X } from 'lucide-react';

const UpdateBanner: React.FC = () => {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onRegistered(_r) {
      // SW Registered
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onRegisterError(_error) {
      // SW registration error
    },
  });

  if (!needRefresh) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-green-600 text-white p-3 shadow-md z-50 flex items-center justify-center gap-4">
      <span className="text-sm font-medium">New content available, click to update.</span>
      <div className="flex gap-2">
        <button
          className="bg-white text-green-700 px-3 py-1 rounded text-sm font-bold flex items-center gap-1 hover:bg-green-50"
          onClick={() => updateServiceWorker(true)}
        >
          <RefreshCw className="w-4 h-4" /> Update
        </button>
        <button
          className="text-white hover:text-green-200"
          onClick={() => setNeedRefresh(false)}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default UpdateBanner;
