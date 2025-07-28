'use client';

import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import en from '@/messages/en.json';
import ja from '@/messages/ja.json';
import ru from '@/messages/ru.json';
import hi from '@/messages/hi.json';

const messages: Record<string, any> = { en, ja, ru, hi };

type I18nContextType = {
  locale: string;
  setLocale: (locale: string) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState('en');

  const t = useCallback((key: string): string => {
    const keys = key.split('.');
    
    const getDeepValue = (obj: any, path: string[]) => {
        return path.reduce((acc, current) => acc?.[current], obj);
    }

    let translated = getDeepValue(messages[locale], keys);

    if (translated === undefined) {
        translated = getDeepValue(messages['en'], keys);
    }
    
    return translated || key;
  }, [locale]);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
