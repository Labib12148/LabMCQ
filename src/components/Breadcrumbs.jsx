import React from 'react';
import { Link } from 'react-router-dom';

export default function Breadcrumbs({ items }) {
  if (!items || items.length === 0) return null;
  return (
    <nav aria-label="Breadcrumb" className="text-sm mb-4">
      <ol className="flex flex-wrap gap-1 text-gray-600 dark:text-gray-400">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center">
            {idx > 0 && <span className="mx-1">›</span>}
            {item.to ? (
              <Link to={item.to} className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-semibold text-gray-800 dark:text-gray-200">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
