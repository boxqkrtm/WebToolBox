import { PageContainer } from "@/components/layout/PageContainer";

type UtilsLayoutProps = {
  children: React.ReactNode;
  onPaste?: (e: React.ClipboardEvent) => void;
};

export default function UtilsLayout({ children, onPaste }: UtilsLayoutProps) {
  return (
    <div className="bg-background" onPaste={onPaste}>
      <PageContainer contentClassName="space-y-6">
        <main>{children}</main>
      </PageContainer>
    </div>
  );
}
