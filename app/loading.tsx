import SkeletonCard from "@/components/SkeletonCard";

export default function Loading() {
  return (
    <section className="rounded-2xl border border-line/70 bg-brandBase p-6 sm:p-8">
      <div className="space-y-3">
        <div className="skeleton-shimmer h-10 w-56 rounded-xl" />
        <div className="skeleton-shimmer h-5 w-80 max-w-full rounded-lg" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index} showImage={false} />
        ))}
      </div>
    </section>
  );
}

