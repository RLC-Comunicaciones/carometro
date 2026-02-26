"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type RouteTransitionProps = {
  children: ReactNode;
};

export default function RouteTransition({ children }: RouteTransitionProps) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="route-transition-content">
      {children}
    </div>
  );
}
