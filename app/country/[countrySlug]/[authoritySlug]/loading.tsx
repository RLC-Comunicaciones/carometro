export default function LoadingAuthorityPage() {
  return (
    <section className="rounded-2xl border border-line/70 bg-brandBase p-6 sm:p-8">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <div className="flex flex-wrap items-center gap-2">
          <div className="skeleton-shimmer h-4 w-14 rounded" />
          <span aria-hidden="true">&gt;</span>
          <div className="skeleton-shimmer h-4 w-40 rounded" />
          <span aria-hidden="true">&gt;</span>
          <div className="skeleton-shimmer h-4 w-44 rounded" />
        </div>
      </nav>

      <div className="mt-4">
        <div className="skeleton-shimmer h-5 w-44 rounded-lg" />
      </div>

      <article className="mt-6 rounded-2xl border border-line/80 bg-surface p-5 sm:p-7">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(260px,320px)_1fr]">
          <div className="skeleton-shimmer aspect-[4/5] rounded-2xl" />

          <div className="space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-2">
                <div className="skeleton-shimmer h-10 w-72 max-w-full rounded-xl" />
                <div className="skeleton-shimmer h-5 w-48 max-w-full rounded-lg" />
              </div>
              <div className="skeleton-shimmer h-10 w-28 rounded-xl" />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="skeleton-shimmer h-5 w-24 rounded-lg" />
                <div className="skeleton-shimmer h-5 w-full rounded-lg" />
              </div>
              <div className="space-y-2">
                <div className="skeleton-shimmer h-5 w-32 rounded-lg" />
                <div className="skeleton-shimmer h-5 w-3/4 rounded-lg" />
              </div>
              <div className="space-y-2">
                <div className="skeleton-shimmer h-5 w-16 rounded-lg" />
                <div className="skeleton-shimmer h-6 w-20 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}
