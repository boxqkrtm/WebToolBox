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
      <Card className="flex h-full flex-col justify-between">
        <CardHeader className="space-y-4 pb-4">
          {icon && (
            <div className="flex h-11 w-11 items-center justify-center rounded-full border bg-muted/40 text-muted-foreground transition-colors group-hover:border-foreground/15 group-hover:text-foreground">
              {icon}
            </div>
          )}
          <CardTitle className="text-lg font-medium leading-6 sm:text-xl">
            {title}
          </CardTitle>
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
