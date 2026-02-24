import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useRegisterSW } from 'virtual:pwa-register/react';

// Pages
import Home from './pages/Home';
import Settings from './pages/Settings';

export default function App() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r)
    },
    onRegisterError(error) {
      console.log('SW registration error', error)
    },
  })

  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showManualInstall, setShowManualInstall] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const checkStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                         ('standalone' in window.navigator && (window.navigator as any).standalone);
    setIsStandalone(checkStandalone);

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowManualInstall(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') {
        setInstallPrompt(null);
      }
    } else {
      setShowManualInstall(true);
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 p-8 font-sans flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192" className="w-6 h-6">
                <path d="M96 48l48 96H48z" fill="#ffffff"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">PWA Demo</h1>
          </div>
          
          <div className="space-y-4">
            {/* PWA Alerts */}
            <div className="p-4 bg-indigo-50 text-indigo-900 rounded-xl">
              <p className="font-medium text-sm">Status: {offlineReady ? 'Ready for offline' : 'Online'}</p>
            </div>

            {needRefresh && (
              <div className="p-4 bg-amber-50 text-amber-900 rounded-xl">
                <p className="font-medium text-sm">Update Available</p>
                <button 
                  onClick={() => updateServiceWorker(true)}
                  className="mt-2 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors"
                >
                  Reload
                </button>
              </div>
            )}

            {!isStandalone && !installPrompt && !showManualInstall && (
              <button 
                onClick={handleInstall}
                className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
              >
                Install App
              </button>
            )}

            {installPrompt && (
              <div className="p-4 bg-emerald-50 text-emerald-900 rounded-xl">
                <p className="font-medium">Install App</p>
                <button 
                  onClick={handleInstall}
                  className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                >
                  Install Now
                </button>
              </div>
            )}

            {showManualInstall && !installPrompt && (
              <div className="p-4 bg-sky-50 text-sky-900 rounded-xl">
                <p className="font-medium text-sm">Manual Installation Required</p>
                <p className="text-xs opacity-80 mt-1">
                  Use your browser menu's "Add to Home Screen" option.
                </p>
              </div>
            )}

            <hr className="border-slate-100 my-4" />

            {/* Application Routes */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}
