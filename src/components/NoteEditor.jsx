import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Bold, Italic, List, Save, X } from 'lucide-react';

function applyWrapToSelection(textarea, before, after) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const value = textarea.value;
  const selected = value.slice(start, end);
  const newValue = value.slice(0, start) + before + selected + after + value.slice(end);
  const newPos = start + before.length + selected.length;
  return { value: newValue, cursor: newPos };
}

function applyLinePrefix(textarea, prefix) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const value = textarea.value;
  const before = value.slice(0, start);
  const selected = value.slice(start, end);
  const after = value.slice(end);

  const lines = selected.split(/\r?\n/);
  const formatted = lines.map((l) => (l.trim() ? `${prefix} ${l.replace(/^\s*-\s+/, '')}` : l)).join('\n');

  const newValue = before + formatted + after;
  const newPos = before.length + formatted.length;
  return { value: newValue, cursor: newPos };
}

export default function NoteEditor({ note, onChange, onClose, onSave }) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [saving, setSaving] = useState(false);
  const areaRef = useRef(null);

  useEffect(() => {
    setTitle(note?.title || '');
    setContent(note?.content || '');
  }, [note?.id]);

  useEffect(() => {
    onChange({ ...note, title, content, updatedAt: new Date().toISOString() });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content]);

  const toolbarDisabled = useMemo(() => !areaRef.current, []);

  const handleBold = () => {
    if (!areaRef.current) return;
    const { value, cursor } = applyWrapToSelection(areaRef.current, '**', '**');
    setContent(value);
    requestAnimationFrame(() => {
      areaRef.current.selectionStart = areaRef.current.selectionEnd = cursor;
      areaRef.current.focus();
    });
  };
  const handleItalic = () => {
    if (!areaRef.current) return;
    const { value, cursor } = applyWrapToSelection(areaRef.current, '*', '*');
    setContent(value);
    requestAnimationFrame(() => {
      areaRef.current.selectionStart = areaRef.current.selectionEnd = cursor;
      areaRef.current.focus();
    });
  };
  const handleList = () => {
    if (!areaRef.current) return;
    const { value, cursor } = applyLinePrefix(areaRef.current, '-');
    setContent(value);
    requestAnimationFrame(() => {
      areaRef.current.selectionStart = areaRef.current.selectionEnd = cursor;
      areaRef.current.focus();
    });
  };

  const handleSave = async () => {
    setSaving(true);
    await Promise.resolve(onSave?.());
    setSaving(false);
  };

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden bg-white shadow-sm">
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-1">
          <button
            title="Bold"
            disabled={toolbarDisabled}
            onClick={handleBold}
            className="p-2 rounded hover:bg-gray-200 text-gray-700 disabled:opacity-50"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            title="Italic"
            disabled={toolbarDisabled}
            onClick={handleItalic}
            className="p-2 rounded hover:bg-gray-200 text-gray-700 disabled:opacity-50"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            title="Bullet list"
            disabled={toolbarDisabled}
            onClick={handleList}
            className="p-2 rounded hover:bg-gray-200 text-gray-700 disabled:opacity-50"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-50"
          >
            <X className="w-4 h-4 inline mr-1" /> Close
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1.5 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
            disabled={saving}
          >
            <Save className="w-4 h-4 inline mr-1" /> {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-medium"
        />
        <textarea
          ref={areaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start typing... Use **bold**, *italic*, and - for bullet lists."
          rows={12}
          className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
        />
      </div>
    </div>
  );
}
