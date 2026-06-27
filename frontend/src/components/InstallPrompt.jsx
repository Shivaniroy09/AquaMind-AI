import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    const isStandalone = ('standalone' in window.navigator) && window.navigator.standalone;

    if (isIosDevice && !isStandalone) {
      setIsIOS(true);
      setShowPrompt(true);
    }

    // Listen for PWA install prompt (Android/Desktop)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowPrompt(false);
      }
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-bounce-short">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-2xl border border-blue-100 dark:border-gray-700 flex flex-col max-w-sm">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Download className="h-5 w-5 text-blue-500" />
            Install AquaMind
          </h4>
          <button 
            onClick={() => setShowPrompt(false)} 
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {isIOS ? (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Install this app on your device! Tap the <strong>Share</strong> button at the bottom of your screen, then select <strong>Add to Home Screen</strong>.
          </p>
        ) : (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Add AquaMind to your home screen for quick and easy access.
            </p>
            <button 
              onClick={handleInstallClick}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Install as App
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
