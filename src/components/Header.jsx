import React from 'react';
import { Search, StickyNote } from 'lucide-react';

function Header({ search, onSearchChange, onNew }) {
  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
        <div className="flex items-center gap-2 text-gray-800">
          <StickyNote className="w-6 h-6 text-indigo-600" />
          <h1 className="text-xl font-semibold tracking-tight">Notes</h1>
        </div>
        <div className="ml-auto flex items-center gap-3 w-full max-w-xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search notes..."
              className="w-full pl-9 pr-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            />
          </div>
          <button
            onClick={onNew}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            New
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
