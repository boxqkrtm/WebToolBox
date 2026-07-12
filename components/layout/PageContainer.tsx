import { cn } from "@/lib/utils";

type PageContainerProps = {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
};

export function PageContainer({
  children,
  className,
  contentClassName,
}: PageContainerProps) {
  return (
    <div className={cn("px-1 py-4 sm:px-4 sm:py-6", className)}>
      <div className={cn("mx-auto w-full max-w-[1080px]", contentClassName)}>
        {children}
      </div>
    </div>
  );
}
