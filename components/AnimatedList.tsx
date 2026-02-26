import type { CSSProperties, HTMLAttributes } from "react";

type AnimatedListProps = HTMLAttributes<HTMLUListElement> & {
  staggerMs?: number;
};

function mergeClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export default function AnimatedList({
  className,
  style,
  staggerMs = 45,
  ...props
}: AnimatedListProps) {
  const mergedStyle = {
    ...style,
    "--stagger-step": `${staggerMs}ms`,
  } as CSSProperties;

  return (
    <ul
      className={mergeClassNames("animated-list", className)}
      style={mergedStyle}
      {...props}
    />
  );
}

