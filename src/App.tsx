/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

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
  const [browserType, setBrowserType] = useState<string>('');

  useEffect(() => {
    // Detect if the app is already installed (standalone mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                         ('standalone' in window.navigator && (window.navigator as any).standalone);

    if (!isStandalone) {
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isIos = /iphone|ipad|ipod/.test(userAgent);
      
      if (isIos) {
        setBrowserType('ios');
        setShowManualInstall(true);
      }
    }

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowManualInstall(false); // Hide manual install if native prompt is available
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

  return (
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
          <div className="p-4 bg-indigo-50 text-indigo-900 rounded-xl">
            <p className="font-medium">Status</p>
            <p className="text-sm opacity-80">
              {offlineReady ? 'App ready to work offline' : 'App is online'}
            </p>
          </div>

          {needRefresh && (
            <div className="p-4 bg-amber-50 text-amber-900 rounded-xl">
              <p className="font-medium">Update Available</p>
              <button 
                onClick={() => updateServiceWorker(true)}
                className="mt-2 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors"
              >
                Reload
              </button>
            </div>
          )}

          {(installPrompt || true) && (
            <div className="p-4 bg-emerald-50 text-emerald-900 rounded-xl">
              <p className="font-medium">Install App</p>
              <p className="text-sm opacity-80 mb-3">Install this app on your device for quick access.</p>
              <button 
                onClick={handleInstall}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
              >
                Install Now
              </button>
            </div>
          )}

          {showManualInstall && !installPrompt && (
            <div className="p-4 bg-sky-50 text-sky-900 rounded-xl">
              <p className="font-medium">Install App</p>
              <p className="text-sm opacity-80 mt-1">
                To install this app on your iPhone/iPad:
                <br />1. Tap the <strong>Share</strong> icon at the bottom.
                <br />2. Scroll down and tap <strong>Add to Home Screen</strong>.
              </p>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">API Call Demo</h2>
            <ApiDemo />
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">Offline Notes</h2>
            <Notes />
          </div>
        </div>
      </div>
    </div>
  );
}

function ApiDemo() {
  const [joke, setJoke] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJoke = async () => {
    setLoading(true);
    setError(null);
    try {
      // Using a public API that doesn't require authentication
      const response = await fetch('https://official-joke-api.appspot.com/random_joke');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setJoke(`${data.setup} - ${data.punchline}`);
    } catch (err) {
      setError('Failed to fetch joke. You might be offline.');
      console.error('Error fetching joke:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={fetchJoke}
        disabled={loading}
        className="w-full px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-200 transition-colors disabled:opacity-50"
      >
        {loading ? 'Fetching...' : 'Fetch Random Joke'}
      </button>
      
      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      {joke && !error && (
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 italic">
          "{joke}"
        </div>
      )}
      <p className="text-xs text-slate-500">
        PWAs can make API calls just like normal web apps. If you are offline, the fetch will fail unless the service worker is configured to cache API responses (which requires advanced Workbox configuration).
      </p>
    </div>
  );
}

function Notes() {
  const [notes, setNotes] = useState<string[]>(() => {
    const saved = localStorage.getItem('pwa-notes');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');

  useEffect(() => {
    localStorage.setItem('pwa-notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setNotes([input, ...notes]);
    setInput('');
  };

  return (
    <div>
      <form onSubmit={addNote} className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a note..."
          className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        />
        <button 
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          Add
        </button>
      </form>
      <ul className="space-y-2">
        {notes.map((note, i) => (
          <li key={i} className="p-3 bg-slate-50 rounded-lg text-slate-700 text-sm border border-slate-100">
            {note}
          </li>
        ))}
        {notes.length === 0 && (
          <li className="text-slate-400 text-sm text-center py-4">No notes yet. Add one above!</li>
        )}
      </ul>
    </div>
  );
}
