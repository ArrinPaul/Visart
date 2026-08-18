'use client';

import React from 'react';
import { Languages } from 'lucide-react';

export type LanguageCode = 'en' | 'hi' | 'kn';

interface LanguageSwitcherProps {
  currentLanguage: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
}

export function LanguageSwitcher({
  currentLanguage,
  onSelectLanguage,
}: LanguageSwitcherProps) {
  const languages: { code: LanguageCode; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  ];

  return (
    <div className="flex items-center gap-2 p-1.5 bg-[#FBF8F2] border border-[#D8D0C4] rounded-lg shadow-sm">
      <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-[#68655F]">
        <Languages className="w-3.5 h-3.5 text-[#B85C43]" />
        <span className="hidden sm:inline">Catalogue Language:</span>
      </div>
      <div className="flex items-center gap-1">
        {languages.map((lang) => {
          const isActive = currentLanguage === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => onSelectLanguage(lang.code)}
              className={`px-3 py-1 text-xs font-medium rounded transition-all duration-200 ${
                isActive
                  ? 'bg-[#27344A] text-[#FBF8F2] shadow-sm'
                  : 'text-[#1E211F] hover:bg-[#F5F0E8] hover:text-[#B85C43]'
              }`}
            >
              <span>{lang.native}</span>
              {lang.code !== 'en' && (
                <span className="hidden md:inline ml-1 text-[10px] opacity-75">
                  ({lang.label})
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
