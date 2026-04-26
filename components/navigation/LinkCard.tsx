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
      <Card className="flex h-full flex-col justify-between border-border/80 bg-card transition-all duration-100 group-hover:border-primary/25">
        <CardHeader className="space-y-4 pb-4">
          {icon && (
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-muted/50 text-primary transition-colors duration-100 group-hover:bg-accent">
              {icon}
            </div>
          )}
          <div className="space-y-2">
            <CardTitle className="text-lg font-semibold leading-6 sm:text-xl">
              {title}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-6 text-muted-foreground sm:text-[15px]">
            {description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
