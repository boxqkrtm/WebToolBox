type PageContainerProps = {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
};

function joinClasses(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function PageContainer({
  children,
  className,
  contentClassName,
}: PageContainerProps) {
  return (
    <div className={joinClasses("px-4 py-6 sm:px-6 sm:py-8", className)}>
      <div className={joinClasses("mx-auto w-full max-w-screen-2xl", contentClassName)}>
        {children}
      </div>
    </div>
  );
}
