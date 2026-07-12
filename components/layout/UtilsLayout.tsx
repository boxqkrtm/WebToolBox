import { PageContainer } from "@/components/layout/PageContainer";
import { cn } from "@/lib/utils";

type UtilsLayoutProps = {
  children: React.ReactNode;
  onPaste?: (e: React.ClipboardEvent) => void;
  title?: string;
  description?: string;
  contentClassName?: string;
};

export default function UtilsLayout({
  children,
  onPaste,
  title,
  description,
  contentClassName,
}: UtilsLayoutProps) {
  return (
    <div className="bg-background" onPaste={onPaste}>
      <PageContainer contentClassName={cn("space-y-6", contentClassName)}>
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
