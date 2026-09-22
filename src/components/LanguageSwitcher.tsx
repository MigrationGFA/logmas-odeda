"use client";

import React, { useEffect, useState } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇬🇧",
  },
  {
    code: "yo",
    name: "Yoruba",
    nativeName: "Èdè Yorùbá",
    flag: "🇳🇬",
  },
  {
    code: "ha",
    name: "Hausa",
    nativeName: "Harshen Hausa",
    flag: "🇳🇬",
  },
  {
    code: "ig",
    name: "Igbo",
    nativeName: "Asụsụ Igbo",
    flag: "🇳🇬",
  },
];

function applyGoogleTranslateCookie(langCode: string) {
  if (typeof window === "undefined") return;
  const targetVal = `/en/${langCode}`;
  const host = window.location.hostname;

  document.cookie = `googtrans=${targetVal}; path=/;`;
  document.cookie = `googtrans=${targetVal}; path=/; domain=${host};`;

  if (host.includes(".")) {
    const parts = host.split(".");
    if (parts.length >= 2) {
      const rootDomain = parts.slice(-2).join(".");
      document.cookie = `googtrans=${targetVal}; path=/; domain=.${rootDomain};`;
    }
  }
}

interface LanguageSwitcherProps {
  variant?: "default" | "compact" | "navbar";
  className?: string;
}

export function LanguageSwitcher({
  variant = "default",
  className = "",
}: LanguageSwitcherProps) {
  const [currentLang, setCurrentLang] = useState<string>("en");
  const [isMounted, setIsMounted] = useState(false);

  // Read current language on mount
  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem("logmas_app_lang");
    if (stored && SUPPORTED_LANGUAGES.some((l) => l.code === stored)) {
      setCurrentLang(stored);
      return;
    }

    // Check googtrans cookie
    const match = document.cookie.match(/googtrans=\/en\/([a-z]{2})/);
    if (match && match[1] && SUPPORTED_LANGUAGES.some((l) => l.code === match[1])) {
      setCurrentLang(match[1]);
    }
  }, []);

  const handleLanguageChange = (langCode: string) => {
    if (langCode === currentLang) return;

    try {
      // 1. Set Google Translate cookies
      applyGoogleTranslateCookie(langCode);

      // 2. Save in local storage
      localStorage.setItem("logmas_app_lang", langCode);
      setCurrentLang(langCode);

      // 3. Attempt in-page select trigger
      const selectElement = document.querySelector<HTMLSelectElement>(".goog-te-combo");
      if (selectElement) {
        selectElement.value = langCode;
        selectElement.dispatchEvent(new Event("change", { bubbles: true }));
      }

      toast.success(
        langCode === "yo"
          ? "Èdè ti yí padà sí Yorùbá!"
          : langCode === "ha"
          ? "An canza harshe zuwa Hausa!"
          : langCode === "ig"
          ? "Agbanweela asụsụ gaa n'Igbo!"
          : "Language switched to English!"
      );

      // 4. Smooth reload if element wasn't dynamically translated
      setTimeout(() => {
        window.location.reload();
      }, 350);
    } catch (err) {
      console.error("Failed to switch language:", err);
    }
  };

  const activeLang =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) ||
    SUPPORTED_LANGUAGES[0];

  if (!isMounted) {
    return (
      <div className={`h-8 w-24 rounded-md bg-muted/40 animate-pulse ${className}`} />
    );
  }

  if (variant === "compact") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 px-2 text-xs font-medium gap-1.5 border border-border/50 hover:bg-muted/60 ${className}`}
            title="Change Language"
          >
            <Globe className="h-3.5 w-3.5 text-primary" />
            <span>{activeLang.flag}</span>
            <span className="hidden sm:inline-block font-semibold">
              {activeLang.code.toUpperCase()}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5 text-primary" />
            Select Language / Yan Èdè
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {SUPPORTED_LANGUAGES.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className="flex items-center justify-between text-xs py-2 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">
                    {lang.nativeName}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {lang.name}
                  </span>
                </div>
              </div>
              {currentLang === lang.code && (
                <Check className="h-3.5 w-3.5 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`h-9 px-2.5 sm:px-3 text-xs font-medium gap-1.5 rounded-lg border-border/70 hover:border-primary/50 hover:bg-muted/50 transition-smooth ${className}`}
        >
          <Globe className="h-3.5 w-3.5 text-primary shrink-0" />
          <span className="text-sm">{activeLang.flag}</span>
          <span className="font-semibold text-foreground">
            {activeLang.nativeName}
          </span>
          <ChevronDown className="h-3 w-3 opacity-60 ml-0.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Globe className="h-3.5 w-3.5 text-primary" />
          Select Language / Yan Èdè
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {SUPPORTED_LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className="flex items-center justify-between text-xs py-2.5 cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base">{lang.flag}</span>
              <div className="flex flex-col text-left">
                <span className="font-medium text-foreground">
                  {lang.nativeName}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {lang.name}
                </span>
              </div>
            </div>
            {currentLang === lang.code && (
              <Check className="h-3.5 w-3.5 text-primary font-bold" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
