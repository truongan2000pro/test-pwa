import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const navigate = useNavigate();
  const [name, setName] = useState(() => {
    return localStorage.getItem('pwa-user-name') || 'User';
  });

  const handleSave = () => {
    localStorage.setItem('pwa-user-name', name);
    alert('Name saved!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Settings</h2>
        <button 
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
        >
          Back
        </button>
      </div>

      <div className="pt-4 border-t border-slate-100 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Display Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            placeholder="Enter your name"
          />
        </div>
        
        <button 
          onClick={handleSave}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          Save Changes
        </button>
      </div>

      <div className="p-4 bg-amber-50 rounded-xl text-amber-900 border border-amber-100">
        <p className="text-xs">
          <strong>PWA Note:</strong> This name is stored in <code>localStorage</code>, which persists even when the app is used offline or after being closed.
        </p>
      </div>
    </div>
  );
}
