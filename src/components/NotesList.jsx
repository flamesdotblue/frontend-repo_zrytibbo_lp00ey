import React from 'react';
import { Trash2, Pencil } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';

function formatDate(ts) {
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString();
}

export default function NotesList({ notes, onEdit, onDelete, view = 'grid' }) {
  if (!notes.length) {
    return (
      <div className="text-center text-gray-500 py-16">No notes found. Create your first note!</div>
    );
  }

  const containerCls = view === 'grid'
    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
    : 'space-y-3';

  return (
    <div className={containerCls}>
      {notes.map((n) => (
        <article
          key={n.id}
          className="group rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow transition-shadow flex flex-col"
        >
          <div className="flex items-start gap-3 mb-2">
            <h3 className="text-base font-semibold flex-1 line-clamp-1">{n.title || 'Untitled'}</h3>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onEdit(n)}
                className="p-1.5 rounded hover:bg-gray-100"
                title="Edit"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(n)}
                className="p-1.5 rounded hover:bg-rose-50 text-rose-600"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="text-sm text-gray-600 mb-3">{formatDate(n.updatedAt || n.createdAt)}</div>
          <div className="text-sm text-gray-800 line-clamp-6">
            <MarkdownRenderer content={n.content} />
          </div>
        </article>
      ))}
    </div>
  );
}
