import type { CSSProperties, HTMLAttributes } from "react";

type FadeInProps = HTMLAttributes<HTMLDivElement> & {
  delayMs?: number;
};

function mergeClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export default function FadeIn({
  className,
  style,
  delayMs = 0,
  ...props
}: FadeInProps) {
  const mergedStyle = {
    ...style,
    animationDelay: `${delayMs}ms`,
  } as CSSProperties;

  return (
    <div
      className={mergeClassNames("fade-in", className)}
      style={mergedStyle}
      {...props}
    />
  );
}

