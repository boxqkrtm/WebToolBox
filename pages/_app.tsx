import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { I18nProvider } from "@/lib/i18n/i18nContext";
import { ThemeProvider } from "@/lib/theme/themeContext";
import { Header } from "@/components/Header";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <I18nProvider>
        <div className="min-h-screen bg-background text-foreground">
          <Header />
          <Component {...pageProps} />
        </div>
      </I18nProvider>
    </ThemeProvider>
  );
}
