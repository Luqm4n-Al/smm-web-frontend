'use client';

import { FiSearch, FiX, FiCornerDownLeft } from 'react-icons/fi';
import { useSearch } from '../SearchContext';
import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { GLOBAL_SECTIONS } from '../search-registry';

export function SearchBar() {
  const { query, setQuery, preserveNextQuery, shouldSkipClear } = useSearch();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const [isFocused, setIsFocused] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);

  // Clear search when navigating between pages (unless preserved for cross-page search)
  useEffect(() => {
    if (!shouldSkipClear()) {
      setQuery('');
    }
    setIsFocused(false);
  }, [pathname, setQuery, shouldSkipClear]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut: "/" to focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter global sections based on query
  const filteredSections = query.trim()
    ? GLOBAL_SECTIONS.filter(s =>
      s.title.toLowerCase().includes(query.toLowerCase()) ||
      s.page.toLowerCase().includes(query.toLowerCase())
    )
    : GLOBAL_SECTIONS;

  // Group by page
  const groupedSections = filteredSections.reduce<Record<string, typeof filteredSections>>((acc, section) => {
    if (!acc[section.page]) acc[section.page] = [];
    acc[section.page].push(section);
    return acc;
  }, {});

  const showDropdown = isFocused;

  const handleSelectSection = (section: typeof GLOBAL_SECTIONS[0]) => {
    const isCurrentPage = pathname === section.route;

    setQuery(section.title);
    setIsFocused(false);
    setHighlightIdx(-1);
    inputRef.current?.blur();

    if (!isCurrentPage) {
      // Preserve the query so it doesn't get cleared on route change
      preserveNextQuery();
      router.push(section.route);
    }
  };

  // Keyboard navigation
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setQuery('');
      setIsFocused(false);
      inputRef.current?.blur();
      return;
    }
    if (!showDropdown) return;

    const allItems = filteredSections;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIdx(prev => Math.min(prev + 1, allItems.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIdx(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && highlightIdx >= 0 && highlightIdx < allItems.length) {
      e.preventDefault();
      handleSelectSection(allItems[highlightIdx]);
    }
  };



  return (
    <div ref={dropdownRef} className="relative max-w-md">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
        <FiSearch className="h-5 w-5" />
      </span>
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setHighlightIdx(-1); }}
        onFocus={() => setIsFocused(true)}
        onKeyDown={handleInputKeyDown}
        placeholder="Search all sections... ( / )"
        className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-9 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      {query && (
        <button
          onClick={() => { setQuery(''); inputRef.current?.focus(); }}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
        >
          <FiX className="h-4 w-4" />
        </button>
      )}

      {/* Global dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 z-50 mt-1 w-full max-h-80 overflow-y-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg">
          {filteredSections.length === 0 ? (
            <div className="px-3 py-4 text-center text-sm text-gray-400">
              No matching sections for &quot;{query}&quot;
            </div>
          ) : (
            Object.entries(groupedSections).map(([page, sections]) => (
              <div key={page}>
                <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400 bg-gray-50">
                  {page}
                </div>
                {sections.map((section) => {
                  const globalIdx = filteredSections.indexOf(section);
                  const isHighlighted = globalIdx === highlightIdx;
                  const isCurrentPage = pathname === section.route;

                  return (
                    <button
                      key={`${section.page}-${section.title}`}
                      onClick={() => handleSelectSection(section)}
                      className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors ${isHighlighted
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <FiSearch className="h-3.5 w-3.5 text-gray-400" />
                        <span>{section.title}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {!isCurrentPage && (
                          <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500">
                            Go to {page}
                          </span>
                        )}
                        {isHighlighted && (
                          <FiCornerDownLeft className="h-3 w-3 text-gray-400" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}