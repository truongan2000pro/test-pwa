import { useState } from 'react';

export default function ApiDemo() {
  const [joke, setJoke] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJoke = async () => {
    setLoading(true);
    setError(null);
    try {
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
        PWAs can make API calls just like normal web apps. If you are offline, the fetch will fail unless the service worker is configured to cache API responses.
      </p>
    </div>
  );
}
