type UtilsLayoutProps = {
  children: React.ReactNode;
  onPaste?: (e: React.ClipboardEvent) => void;
};

export default function UtilsLayout({ children, onPaste }: UtilsLayoutProps) {
  return (
    <div className="flex justify-center p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen" onPaste={onPaste}>
      <div className="w-full">
        <main>{children}</main>
      </div>
    </div>
  );
}
