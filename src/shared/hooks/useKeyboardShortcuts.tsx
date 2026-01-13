import React, { useEffect } from 'react';

interface KeyboardShortcuts {
  onEscape?: () => void;
  onNew?: () => void;
  onSearch?: () => void;
  onToday?: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useKeyboardShortcuts = (shortcuts: KeyboardShortcuts) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Escape key
      if (event.key === 'Escape' && shortcuts.onEscape) {
        shortcuts.onEscape();
      }

      // Ctrl/Cmd + N - New homework
      //if ((event.ctrlKey || event.metaKey) && event.key === 'n' && shortcuts.onNew) {
      if ((event.ctrlKey) && event.key == 'n' && shortcuts.onNew) {
        event.preventDefault();
        shortcuts.onNew();
      }

      // Ctrl/Cmd + K - Search
      //if ((event.ctrlKey || event.metaKey) && event.key === 'k' && shortcuts.onSearch) {
      if ((event.ctrlKey) && event.key == 'k' && shortcuts.onSearch) {
        event.preventDefault();
        shortcuts.onSearch();
      }

      // Ctrl/Cmd + T - Go to today
      //if ((event.ctrlKey || event.metaKey) && event.key === 't' && shortcuts.onToday) {
      if ((event.ctrlKey) && event.key == 't' && shortcuts.onToday) {
        event.preventDefault();
        shortcuts.onToday();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};

// Keyboard shortcuts help component
export const KeyboardShortcutsHelp: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    { keys: ['Esc'], description: 'Close modals and dialogs' },
    { keys: ['Ctrl', 'N'], description: 'Create new homework', mac: ['⌃', 'N'] },
    { keys: ['Ctrl', 'K'], description: 'Focus search', mac: ['⌃', 'K'] },
    { keys: ['Ctrl', 'T'], description: 'Go to today', mac: ['⌃', 'T'] },
    { keys: ['?'], description: 'Show keyboard shortcuts' },
  ];

  // const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const isMac = navigator.maxTouchPoints === 0 && /Mac|iPhone|iPad/.test(navigator.userAgent);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Keyboard Shortcuts
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
            >
              <span className="text-gray-300 text-sm">{shortcut.description}</span>
              <div className="flex gap-1">
                {(isMac && shortcut.mac ? shortcut.mac : shortcut.keys).map((key, i) => (
                  <kbd
                    key={i}
                    className="px-2 py-1 bg-gray-900 text-gray-300 rounded border border-gray-600 text-xs font-mono"
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-700 text-center">
          <p className="text-sm text-gray-400">
            Press <kbd className="px-2 py-1 bg-gray-900 text-gray-300 rounded border border-gray-600 text-xs font-mono">?</kbd> anytime to see shortcuts
          </p>
        </div>
      </div>
    </div>
  );
};