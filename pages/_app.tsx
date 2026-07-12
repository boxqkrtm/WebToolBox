import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { I18nProvider } from "@/lib/i18n/i18nContext";
import { ThemeProvider } from "@/lib/theme/themeContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SeoHead } from "@/components/SeoHead";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const currentPath = router.asPath || router.pathname || "/";

  return (
    <ThemeProvider>
      <SeoHead pathname={currentPath} />
      <I18nProvider>
        <div className="flex min-h-screen flex-col bg-background text-foreground">
          <Header />
          <div className="flex-1">
            <Component {...pageProps} />
          </div>
          <Footer />
        </div>
      </I18nProvider>
    </ThemeProvider>
  );
}
