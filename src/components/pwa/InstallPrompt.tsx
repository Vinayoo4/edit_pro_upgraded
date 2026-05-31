import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  if (!isInstallable) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:bottom-6 md:left-auto md:right-6 md:w-80 bg-white p-4 rounded-xl shadow-lg border border-green-100 z-50 flex items-center justify-between gap-4">
      <div>
        <h4 className="font-bold text-gray-900 text-sm">Install App</h4>
        <p className="text-xs text-gray-500">Get the best experience by installing VeganHub.</p>
      </div>
      <button
        onClick={handleInstallClick}
        className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors flex-shrink-0"
        aria-label="Install App"
      >
        <Download className="w-5 h-5" />
      </button>
    </div>
  );
};

export default InstallPrompt;
