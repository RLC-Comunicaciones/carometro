type SkeletonCardProps = {
  showImage?: boolean;
};

export default function SkeletonCard({ showImage = true }: SkeletonCardProps) {
  return (
    <div className="rounded-2xl border border-line/80 bg-surface p-4">
      <div className="flex items-start gap-4">
        {showImage ? (
          <div className="skeleton-shimmer h-24 w-24 shrink-0 rounded-xl" />
        ) : null}
        <div className="w-full space-y-3">
          <div className="skeleton-shimmer h-6 w-2/3 rounded-lg" />
          <div className="skeleton-shimmer h-4 w-full rounded-lg" />
          <div className="skeleton-shimmer h-4 w-4/5 rounded-lg" />
          <div className="skeleton-shimmer h-6 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
}
