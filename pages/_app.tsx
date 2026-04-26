import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { I18nProvider } from "@/lib/i18n/i18nContext";
import { ThemeProvider } from "@/lib/theme/themeContext";
import { Header } from "@/components/Header";
import { SeoHead } from "@/components/SeoHead";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const currentPath = router.asPath || router.pathname || "/";
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const handleStart = () => setIsNavigating(true);
    const handleEnd = () => setTimeout(() => setIsNavigating(false), 100);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleEnd);
    router.events.on("routeChangeError", handleEnd);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleEnd);
      router.events.off("routeChangeError", handleEnd);
    };
  }, [router.events]);

  return (
    <ThemeProvider>
      <SeoHead pathname={currentPath} />
      <I18nProvider>
        <div className="min-h-screen bg-background text-foreground">
          <Header />
          <div className={`transition-opacity duration-100 ${isNavigating ? "opacity-90" : "opacity-100"}`}>
            <Component {...pageProps} />
          </div>
        </div>
      </I18nProvider>
    </ThemeProvider>
  );
}
