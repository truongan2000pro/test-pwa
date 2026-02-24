import { useState, useEffect, FormEvent } from 'react';

export default function Notes() {
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
