import { PageContainer } from "@/components/layout/PageContainer";

type UtilsLayoutProps = {
  children: React.ReactNode;
  onPaste?: (e: React.ClipboardEvent) => void;
  title?: string;
  description?: string;
};

export default function UtilsLayout({ children, onPaste, title, description }: UtilsLayoutProps) {
  return (
    <div className="bg-background" onPaste={onPaste}>
      <PageContainer contentClassName="space-y-8">
        <main className="space-y-8">
          {(title || description) && (
            <div className="max-w-3xl space-y-2">
              {title && <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>}
              {description && <p className="text-pretty text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>}
            </div>
          )}
          {children}
        </main>
      </PageContainer>
    </div>
  );
}
