import SkeletonCard from "@/components/SkeletonCard";

export default function LoadingCountryPage() {
  return (
    <section className="rounded-2xl border border-line/70 bg-brandBase p-6 sm:p-8">
      <header className="flex flex-wrap items-center gap-4">
        <div className="skeleton-shimmer h-10 w-10 rounded" />
        <div className="space-y-2">
          <div className="skeleton-shimmer h-10 w-64 max-w-full rounded-xl" />
          <div className="skeleton-shimmer h-5 w-52 max-w-full rounded-lg" />
        </div>
      </header>

      <div className="mt-6">
        <div className="skeleton-shimmer h-5 w-32 rounded-lg" />
      </div>

      <div className="mt-8 space-y-6">
        <div className="space-y-2">
          <div className="skeleton-shimmer h-4 w-32 rounded-lg" />
          <div className="skeleton-shimmer h-12 w-full rounded-xl" />
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="skeleton-shimmer h-8 w-16 rounded-full" />
          <div className="skeleton-shimmer h-8 w-20 rounded-full" />
          <div className="skeleton-shimmer h-8 w-20 rounded-full" />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
