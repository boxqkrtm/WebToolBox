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
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          {eyebrow}
        </p>
      )}
      <div className="space-y-3">
        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
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
