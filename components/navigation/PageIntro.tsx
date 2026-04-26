type PageIntroProps = {
  title: string;
  description?: string;
  align?: "left" | "center";
  eyebrow?: string;
};

function joinClasses(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function PageIntro({ title, description, align = "left", eyebrow }: PageIntroProps) {
  return (
    <section
      className={joinClasses(
        "space-y-3",
        align === "center" && "mx-auto max-w-3xl text-center"
      )}
    >
      {eyebrow && (
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {eyebrow}
        </p>
      )}
      <div className="space-y-2">
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
