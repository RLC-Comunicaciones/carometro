type PageTitleProps = {
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
};

function mergeClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

const alignmentClassMap = {
  left: "items-start text-left",
  center: "items-center text-center",
} as const;

export default function PageTitle({
  title,
  subtitle,
  className,
  align = "left",
}: PageTitleProps) {
  return (
    <div
      className={mergeClassNames(
        "flex flex-col gap-2",
        alignmentClassMap[align],
        className
      )}
    >
      <h1 className="text-3xl font-semibold tracking-tight text-slate-800 sm:text-4xl">
        {title}
      </h1>
      {subtitle ? (
        <p className="max-w-2xl text-sm leading-7 text-muted sm:text-base">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
