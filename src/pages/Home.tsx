import { useNavigate } from 'react-router-dom';
import ApiDemo from '../components/ApiDemo';
import Notes from '../components/Notes';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Home Page</h2>
        <button 
          onClick={() => navigate('/settings')}
          className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
        >
          Settings
        </button>
      </div>

      <div className="pt-4 border-t border-slate-100">
        <h2 className="text-lg font-semibold text-slate-800 mb-3">API Call Demo</h2>
        <ApiDemo />
      </div>

      <div className="pt-4 border-t border-slate-100">
        <h2 className="text-lg font-semibold text-slate-800 mb-3">Offline Notes</h2>
        <Notes />
      </div>
    </div>
  );
}
