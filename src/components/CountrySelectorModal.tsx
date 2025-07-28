'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useI18n } from '@/context/i18n-provider';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

const languages = [
  { name: 'English', lang: 'en' },
  { name: '日本語 (Japanese)', lang: 'ja' },
  { name: 'Русский (Russian)', lang: 'ru' },
  { name: 'हिन्दी (Hindi)', lang: 'hi' },
];

export default function CountrySelectorModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { setLocale } = useI18n();

  useEffect(() => {
    const languageSelected = sessionStorage.getItem('ukcas_language_selected');
    if (!languageSelected) {
      setIsOpen(true);
    }
  }, []);

  const handleLanguageSelect = (lang: string) => {
    setLocale(lang);
    sessionStorage.setItem('ukcas_language_selected', 'true');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent
        className="sm:max-w-md"
        hideCloseButton={true}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe />
            Select Your Language
          </DialogTitle>
          <DialogDescription>
            Choose your preferred language for the website.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-4">
          {languages.map((language) => (
            <Button
              key={language.lang}
              variant="outline"
              className="w-full justify-center"
              onClick={() => handleLanguageSelect(language.lang)}
            >
              {language.name}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
