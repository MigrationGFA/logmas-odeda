# Multilingual Translation Feature Guide (Zero-Refactor Client-Side Architecture)

> **Audience:** Any developer or AI chat agent implementing Nigerian language localization (Yorùbá, Hausa, Igbo, English) or multilingual translation across another LGA portal or Next.js application without rewriting existing codebase text strings.

---

## 1. Architecture Overview

### Why This Approach?
- **Zero-Refactor:** Does not require extracting thousands of strings into JSON i18n dictionaries (`i18next`, `next-intl`, etc.).
- **Covers All Surfaces:** Automatically translates dynamic server responses, form labels, tooltips, tables, public landing pages, and authenticated citizen/admin dashboard views.
- **Legal & Statutory Safety:** Uses explicit exclusions (`translate="no"` and `className="notranslate"`) so that statutory certificates, treasury receipts, audit verification hashes, and QR codes remain in strictly compliant legal English.
- **Persistent Selection:** Uses `googtrans` cookies and browser `localStorage` to preserve user language preference across route transitions and sessions.

### Supported Languages (Extendable):
- **English (Default):** `en` (🇬🇧)
- **Èdè Yorùbá:** `yo` (🇳🇬)
- **Harshen Hausa:** `ha` (🇳🇬)
- **Asụsụ Igbo:** `ig` (🇳🇬)

---

## 2. File Implementation Checklist

| Step | Target File | Action | Purpose |
|------|-------------|--------|---------|
| 1 | `src/components/GoogleTranslateScript.tsx` | Create | Injects Google Translate element script safely & initializes hidden engine |
| 2 | `src/components/LanguageSwitcher.tsx` | Create | Modern UI dropdown (globe icon, native names, flags) + cookie management |
| 3 | `src/app/globals.css` | Edit | Suppresses Google banners, tooltips, body shifts, and font highlights |
| 4 | `src/app/layout.tsx` | Edit | Mounts `<GoogleTranslateScript />` once in the HTML root `<body>` |
| 5 | `src/components/site-chrome.tsx` | Edit | Adds `<LanguageSwitcher />` to Public Topbar, Main Navbar & Mobile Drawer |
| 6 | `src/app/(dashboard)/dashboard/layout.tsx` | Edit | Adds `<LanguageSwitcher />` to Authenticated Dashboard Header |
| 7 | `src/components/certificate/CertificateRenderer.tsx` | Edit | Adds `translate="no"` & `notranslate` to protect certificates |
| 8 | `src/components/receipt/ReceiptRenderer.tsx` | Edit | Adds `translate="no"` & `notranslate` to protect receipts |

---

## 3. Step-by-Step Code Instructions

### Step 1: Create `src/components/GoogleTranslateScript.tsx`

Create this client component to mount the translation script and declare the global callback.

```tsx
"use client";

import Script from "next/script";
import React from "react";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            includedLanguages: string;
            autoDisplay: boolean;
            layout?: unknown;
          },
          elementId: string
        ) => void;
      };
    };
  }
}

export function GoogleTranslateScript() {
  return (
    <>
      <div id="google_translate_element" style={{ display: "none" }} />
      <Script
        id="google-translate-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            function googleTranslateElementInit() {
              if (window.google && window.google.translate) {
                new window.google.translate.TranslateElement(
                  {
                    pageLanguage: 'en',
                    includedLanguages: 'en,yo,ha,ig',
                    autoDisplay: false
                  },
                  'google_translate_element'
                );
              }
            }
          `,
        }}
      />
      <Script
        id="google-translate-script"
        strategy="afterInteractive"
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
      />
    </>
  );
}
```

---

### Step 2: Create `src/components/LanguageSwitcher.tsx`

> ⚠️ **CRITICAL ESLINT / REACT 19 RULE:**
> Do NOT set `document.cookie` directly inside a React component or event handler body. ESLint (`react-hooks/immutability`) will fail the build. Keep `applyGoogleTranslateCookie()` outside the component function as shown below.

```tsx
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

// Helper MUST remain outside component to satisfy React 19 immutability linting
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

  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem("logmas_app_lang");
    if (stored && SUPPORTED_LANGUAGES.some((l) => l.code === stored)) {
      setCurrentLang(stored);
      return;
    }

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

      // 3. Trigger change on active select element if already loaded
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

      // 4. Quick reload to apply new language uniformly across hydration boundaries
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
```

---

### Step 3: Add CSS Overrides in `src/app/globals.css`

Append these rules at the very end of `src/app/globals.css`. They prevent Google from pushing down the page body, showing floating iframes, or highlighting translated words with blue background boxes.

```css
/* ─── Seamless Client-Side Translation Overrides ─── */
.goog-te-banner-frame,
iframe.goog-te-banner-frame,
.goog-te-banner-frame.skiptranslate {
  display: none !important;
  visibility: hidden !important;
  height: 0 !important;
}

body {
  top: 0px !important;
  position: static !important;
}

#goog-gt-tt,
.goog-te-balloon-frame,
.goog-tooltip,
.goog-tooltip:hover {
  display: none !important;
  visibility: hidden !important;
}

.goog-text-highlight {
  background-color: transparent !important;
  box-shadow: none !important;
  border: none !important;
}

#google_translate_element {
  display: none !important;
  visibility: hidden !important;
}

.skiptranslate:not(.allowed-skiptranslate) {
  display: none !important;
}
```

---

### Step 4: Mount Script in `src/app/layout.tsx`

Import and place `<GoogleTranslateScript />` inside `<body>`:

```tsx
import { GoogleTranslateScript } from "@/components/GoogleTranslateScript";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="...">
      <body className="min-h-full flex flex-col">
        <GoogleTranslateScript />
        <TooltipProvider delayDuration={200}>
          <Providers>{children}</Providers>
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  );
}
```

---

### Step 5: Embed Switcher in Public Navigation (`src/components/site-chrome.tsx`)

In your public navbar component:

1. **Top Contact Bar:**
   ```tsx
   <div className="flex items-center gap-3">
     <div className="text-[11px] opacity-80">{SITE_CONTACT.operatingDays}</div>
     <LanguageSwitcher
       variant="compact"
       className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground"
     />
   </div>
   ```

2. **Main Desktop Header:**
   ```tsx
   <div className="hidden md:flex items-center gap-2">
     <LanguageSwitcher variant="default" />
     {/* Auth buttons */}
   </div>
   ```

3. **Mobile Drawer Menu:**
   ```tsx
   {open && (
     <div className="lg:hidden ...">
       <div className="flex items-center justify-between pb-3 mb-2 border-b border-border/40">
         <span className="text-xs font-semibold text-muted-foreground">Select Language / Yan Èdè</span>
         <LanguageSwitcher variant="compact" />
       </div>
       {/* Nav links */}
     </div>
   )}
   ```

---

### Step 6: Embed Switcher in Dashboard Header (`src/app/(dashboard)/dashboard/layout.tsx`)

In the authenticated dashboard header layout:

```tsx
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

// Inside the dashboard top header:
<div className="ml-auto flex items-center gap-2">
  <LanguageSwitcher variant="compact" />
  {/* Search input, Notifications, User menu */}
</div>
```

---

### Step 7: Protect Legal Documents (`notranslate`)

Any statutory certificate, receipt, or audit log must not be mutated by machine translation.

1. **In `src/components/certificate/CertificateRenderer.tsx`:**
   ```tsx
   return (
     <div
       translate="no"
       className={`cert-canvas-container notranslate relative w-full ...`}
       style={{ ... }}
     >
       {/* Certificate Artwork & Dynamic Details */}
     </div>
   );
   ```

2. **In `src/components/receipt/ReceiptRenderer.tsx`:**
   ```tsx
   return (
     <div
       translate="no"
       className={`receipt-canvas-container notranslate relative w-full ...`}
       style={{ ... }}
     >
       {/* Treasury Receipt Canvas */}
     </div>
   );
   ```

3. **Any Specific Element (e.g., Currency symbols, Account numbers, Verification hashes):**
   ```tsx
   <span translate="no" className="notranslate font-mono">
     {application.verificationHash}
   </span>
   ```

---

## 4. Troubleshooting & Quality Checklist

1. **Page shifted down 40px:**
   Check `src/app/globals.css` to confirm `body { top: 0px !important; position: static !important; }` and `.goog-te-banner-frame { display: none !important; }` are active.

2. **Word highlighting or blue hover tooltips:**
   Confirm `.goog-text-highlight { background-color: transparent !important; }` and `#goog-gt-tt { display: none !important; }` are in `globals.css`.

3. **Build Error during `npm run build` or `eslint`:**
   Ensure `applyGoogleTranslateCookie` is **outside** the `LanguageSwitcher` component function to satisfy React Compiler and React 19 immutability linters.

4. **Testing in Local Development:**
   - Choose **Èdè Yorùbá**: The page refreshes smoothly, the toast appears, and labels (e.g. "Services", "Login", "Local Government Area", "Apply Now") translate to Yorùbá.
   - Switch to **Harshen Hausa** or **Asụsụ Igbo**: Confirm the text updates accordingly.
   - Switch back to **English**: Cookie clears to `/en/en` and default English restores immediately.
