"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import AnimatedList from "@/components/AnimatedList";
import {
  type AttendanceMode,
  type Authority,
  getAttendanceMode,
} from "@/src/lib/faceometer-data";

type CountryAuthoritiesPanelProps = {
  countrySlug: string;
  authorities: Authority[];
};

type ModeFilter = "all" | AttendanceMode;

const modeFilterOptions: Array<{ label: string; value: ModeFilter }> = [
  { label: "All", value: "all" },
  { label: "On-Site", value: "On-Site" },
  { label: "Virtual", value: "Virtual" },
];

const COUNTRY_WITH_PENDING_PHOTO = "antigua-and-barbuda";

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export default function CountryAuthoritiesPanel({
  countrySlug,
  authorities,
}: CountryAuthoritiesPanelProps) {
  const [modeFilter, setModeFilter] = useState<ModeFilter>("all");
  const [search, setSearch] = useState("");

  const filteredAuthorities = useMemo(() => {
    const query = normalizeText(search.trim());

    return authorities.filter((authority) => {
      const attendanceMode = getAttendanceMode(authority.mode);
      const matchesMode = modeFilter === "all" || attendanceMode === modeFilter;
      const matchesSearch =
        query.length === 0 || normalizeText(authority.full_name).includes(query);

      return matchesMode && matchesSearch;
    });
  }, [authorities, modeFilter, search]);

  return (
    <div className="mt-8 space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="w-full max-w-xl">
          <label
            htmlFor="authority-search"
            className="mb-2 block text-sm text-muted"
          >
            Search authority
          </label>
          <input
            id="authority-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Type a full name..."
            className="interactive-button w-full rounded-xl border border-line/80 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 sm:text-base"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {modeFilterOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setModeFilter(option.value)}
            className={`interactive-button rounded-full border px-4 py-1.5 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 ${
              modeFilter === option.value
                ? "border-slate-400 bg-white text-slate-800"
                : "border-line/80 bg-surface text-muted hover:text-slate-700"
            }`}
            aria-pressed={modeFilter === option.value}
          >
            {option.label}
          </button>
        ))}
      </div>

      {filteredAuthorities.length === 0 ? (
        <p className="text-sm text-muted sm:text-base">
          No authorities match the current filters.
        </p>
      ) : (
        <AnimatedList
          className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
          staggerMs={35}
        >
          {filteredAuthorities.map((authority) => {
            const attendanceMode = getAttendanceMode(authority.mode);
            const showPendingPhotoMessage =
              authority.country_slug === COUNTRY_WITH_PENDING_PHOTO;
            // TODO: Re-enable localized titles when dataset has vetted translations.
            const positionLabel = authority.position;

            return (
              <li key={authority.authority_slug}>
                <Link
                  href={`/country/${countrySlug}/${authority.authority_slug}`}
                  className="interactive-card group flex h-full gap-4 rounded-2xl border border-line/80 bg-surface p-4 transition hover:border-slate-300 hover:bg-[#ececec] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
                >
                  {showPendingPhotoMessage ? (
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl border border-dashed border-line/80 bg-brandBase px-2 text-center text-[11px] leading-tight text-slate-600">
                      Official photo currently under review.
                    </div>
                  ) : (
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-brandBase">
                      <Image
                        src={authority.photo}
                        alt={authority.full_name}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="min-w-0 space-y-1.5">
                    <p className="line-clamp-2 text-base font-semibold text-slate-800">
                      {authority.full_name}
                    </p>
                    <p className="line-clamp-3 text-sm text-slate-700">
                      {positionLabel}
                    </p>
                    {authority.organization ? (
                      <p className="line-clamp-2 text-sm text-muted">
                        {authority.organization}
                      </p>
                    ) : null}
                    <span
                      className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${
                        attendanceMode === "On-Site"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-sky-100 text-sky-800"
                      }`}
                    >
                      {attendanceMode}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </AnimatedList>
      )}
    </div>
  );
}
