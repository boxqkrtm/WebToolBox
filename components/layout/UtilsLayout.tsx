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
      <PageContainer contentClassName="space-y-6">
        <main>
          {(title || description) && (
            <div className="mb-6">
              {title && <h1 className="text-2xl font-bold">{title}</h1>}
              {description && <p className="text-muted-foreground">{description}</p>}
            </div>
          )}
          {children}
        </main>
      </PageContainer>
    </div>
  );
}
