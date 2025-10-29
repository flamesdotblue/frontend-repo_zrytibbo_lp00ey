import React from 'react';

// Minimal, safe renderer that supports **bold**, *italic*, and bullet lists starting with "- "
function renderInline(text) {
  // Handle bold (**text**)
  const boldSplit = text.split(/(\*\*[^*]+\*\*)/g);
  const boldElems = boldSplit.map((chunk, i) => {
    if (/^\*\*[^*]+\*\*$/.test(chunk)) {
      const inner = chunk.slice(2, -2);
      return <strong key={`b-${i}`}>{renderInline(inner)}</strong>;
    }
    // Handle italics (*text*) inside non-bold chunks
    const italicSplit = chunk.split(/(\*[^*]+\*)/g);
    return italicSplit.map((part, j) => {
      if (/^\*[^*]+\*$/.test(part)) {
        const inner = part.slice(1, -1);
        return <em key={`i-${i}-${j}`}>{inner}</em>;
      }
      return <React.Fragment key={`t-${i}-${j}`}>{part}</React.Fragment>;
    });
  });
  return boldElems;
}

export default function MarkdownRenderer({ content }) {
  if (!content) return null;
  const lines = content.split(/\r?\n/);
  const blocks = [];
  let listItems = [];

  const flushList = () => {
    if (listItems.length) {
      blocks.push(
        <ul className="list-disc pl-6 space-y-1" key={`ul-${blocks.length}`}>
          {listItems.map((li, idx) => (
            <li key={`li-${idx}`}>{renderInline(li)}</li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  lines.forEach((line) => {
    if (/^\s*-\s+/.test(line)) {
      listItems.push(line.replace(/^\s*-\s+/, ''));
    } else if (line.trim() === '') {
      flushList();
      blocks.push(<div className="h-2" key={`sp-${blocks.length}`} />);
    } else {
      flushList();
      blocks.push(
        <p className="whitespace-pre-wrap" key={`p-${blocks.length}`}>
          {renderInline(line)}
        </p>
      );
    }
  });
  flushList();

  return <div className="prose prose-sm max-w-none">{blocks}</div>;
}
