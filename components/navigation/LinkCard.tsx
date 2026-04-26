import type { ReactNode } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type LinkCardProps = {
  href: string;
  title: string;
  description: string;
  icon?: ReactNode;
};

export function LinkCard({ href, title, description, icon }: LinkCardProps) {
  return (
    <Link href={href} className="group block h-full">
      <Card className="flex h-full flex-col justify-between overflow-hidden bg-card/95 transition-transform duration-200 group-hover:-translate-y-0.5">
        <CardHeader className="space-y-5 pb-5">
          {icon && (
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border/80 bg-muted/50 text-muted-foreground transition-colors group-hover:border-foreground/15 group-hover:text-foreground">
              {icon}
            </div>
          )}
          <div className="space-y-3">
            <CardTitle className="text-lg font-medium leading-6 sm:text-[1.45rem]">
              {title}
            </CardTitle>
            <div className="h-px w-12 bg-border transition-all duration-200 group-hover:w-16 group-hover:bg-foreground/20" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-7 text-muted-foreground sm:text-[15px]">
            {description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
