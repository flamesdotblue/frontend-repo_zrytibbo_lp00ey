import React, { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import NoteEditor from './components/NoteEditor';
import NotesList from './components/NotesList';
import MarkdownRenderer from './components/MarkdownRenderer';

const STORAGE_KEY = 'notes-app:notes';

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function App() {
  const [notes, setNotes] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState('grid');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return notes.slice().sort((a, b) => (b.updatedAt || b.createdAt).localeCompare(a.updatedAt || a.createdAt));
    return notes
      .filter((n) => (n.title?.toLowerCase().includes(q) || n.content?.toLowerCase().includes(q)))
      .sort((a, b) => (b.updatedAt || b.createdAt).localeCompare(a.updatedAt || a.createdAt));
  }, [notes, search]);

  const handleNew = () => {
    const now = new Date().toISOString();
    const n = { id: uid(), title: '', content: '', createdAt: now, updatedAt: now };
    setNotes((prev) => [n, ...prev]);
    setSelected(n);
  };

  const handleChange = (updated) => {
    setNotes((prev) => prev.map((n) => (n.id === updated.id ? { ...n, ...updated } : n)));
  };

  const handleSave = () => {
    // already persisted via localStorage; close editor
    setSelected(null);
  };

  const handleEdit = (n) => setSelected(n);

  const handleDelete = (n) => {
    const ok = confirm('Delete this note? This cannot be undone.');
    if (!ok) return;
    setNotes((prev) => prev.filter((x) => x.id !== n.id));
    if (selected?.id === n.id) setSelected(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50/40 text-gray-900">
      <Header search={search} onSearchChange={setSearch} onNew={handleNew} />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {selected ? (
          <NoteEditor
            note={selected}
            onChange={handleChange}
            onClose={() => setSelected(null)}
            onSave={handleSave}
          />
        ) : (
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Your notes</h2>
            <div className="inline-flex rounded-md border border-gray-200 overflow-hidden">
              <button
                onClick={() => setView('grid')}
                className={`px-3 py-1.5 text-sm ${view === 'grid' ? 'bg-gray-100' : 'bg-white hover:bg-gray-50'}`}
              >
                Grid
              </button>
              <button
                onClick={() => setView('list')}
                className={`px-3 py-1.5 text-sm ${view === 'list' ? 'bg-gray-100' : 'bg-white hover:bg-gray-50'}`}
              >
                List
              </button>
            </div>
          </div>
        )}

        {!selected && (
          <NotesList notes={filtered} onEdit={handleEdit} onDelete={handleDelete} view={view} />
        )}

        {!selected && notes.length === 0 && (
          <section className="rounded-lg border border-dashed border-gray-300 p-8 bg-white/60 text-center">
            <h3 className="text-base font-medium mb-2">Capture your thoughts</h3>
            <p className="text-sm text-gray-600 mb-4">Write quickly, format with bold, italics, and bullet lists, and everything auto-saves locally.</p>
            <button
              onClick={handleNew}
              className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Create a note
            </button>
          </section>
        )}
      </main>

      <footer className="py-6 text-center text-xs text-gray-500">
        <p>Tip: Use **bold**, *italic*, and start lines with - for bullets. Everything saves automatically.</p>
      </footer>
    </div>
  );
}
