import type { HTMLAttributes } from "react";

type ContainerProps = HTMLAttributes<HTMLDivElement>;

function mergeClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export default function Container({ className, ...props }: ContainerProps) {
  return (
    <div
      className={mergeClassNames(
        "mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8",
        className
      )}
      {...props}
    />
  );
}
