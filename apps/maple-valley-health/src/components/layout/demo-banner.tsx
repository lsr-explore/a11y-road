'use client';

import { useA11yMode } from '../providers/a11y-mode-provider';

export const DemoBanner = () => {
  const { isAccessible, toggle } = useA11yMode();

  return (
    <div className="bg-amber-100 border-b border-amber-300 px-4 py-2 text-sm text-amber-900">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <p>
          <strong>Demo Site:</strong> This site intentionally contains accessibility issues for
          learning purposes.
        </p>
        <div className="flex items-center gap-2">
          <span className="font-medium">{isAccessible ? 'Accessible' : 'Broken'}</span>
          <button
            onClick={toggle}
            type="button"
            role="switch"
            aria-checked={isAccessible}
            aria-label={`Accessibility mode: ${isAccessible ? 'accessible' : 'broken'}. Click to switch.`}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isAccessible ? 'bg-green-600' : 'bg-gray-400'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                isAccessible ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
