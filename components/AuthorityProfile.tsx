"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  type Authority,
  type AttendanceMode,
  getAttendanceMode,
} from "@/src/lib/faceometer-data";

type AuthorityProfileProps = {
  authority: Authority;
  countryName: string;
};

const COUNTRY_WITH_PENDING_PHOTO = "antigua-and-barbuda";

export default function AuthorityProfile({
  authority,
  countryName,
}: AuthorityProfileProps) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">(
    "idle"
  );

  const attendanceMode = useMemo<AttendanceMode>(
    () => getAttendanceMode(authority.mode),
    [authority.mode]
  );
  const showPendingPhotoMessage =
    authority.country_slug === COUNTRY_WITH_PENDING_PHOTO;
  // TODO: Re-enable localized titles when dataset has vetted translations.
  const positionLabel = authority.position;

  async function handleCopyLink() {
    if (typeof window === "undefined") return;

    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyStatus("copied");
      window.setTimeout(() => setCopyStatus("idle"), 2000);
    } catch {
      setCopyStatus("error");
      window.setTimeout(() => setCopyStatus("idle"), 2500);
    }
  }

  return (
    <article className="mt-6 rounded-2xl border border-line/80 bg-surface p-5 sm:p-7">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(260px,320px)_1fr]">
        {showPendingPhotoMessage ? (
          <div className="flex aspect-[4/5] items-center justify-center rounded-2xl border border-dashed border-line/80 bg-brandBase px-6 text-center text-sm text-slate-600 sm:text-base">
            We are currently verifying the official photo for this delegate.
          </div>
        ) : (
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-brandBase">
            <Image
              src={authority.photo}
              alt={`${authority.full_name}, delegate from ${countryName}`}
              fill
              sizes="(min-width: 1024px) 320px, 100vw"
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-800 sm:text-4xl">
                {authority.full_name}
              </h1>
              <p className="mt-1 text-sm text-muted sm:text-base">{countryName}</p>
            </div>

            <button
              type="button"
              onClick={handleCopyLink}
              className="interactive-button rounded-xl border border-line/80 bg-white px-4 py-2 text-sm text-slate-700 transition hover:border-slate-400 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
            >
              {copyStatus === "copied"
                ? "Link copied"
                : copyStatus === "error"
                ? "Copy failed"
                : "Copy link"}
            </button>
          </div>

          <dl className="space-y-4 text-sm sm:text-base">
            <div>
              <dt className="font-semibold text-slate-800">Position</dt>
              <dd className="mt-1 text-slate-700">{positionLabel}</dd>
            </div>

            {authority.organization ? (
              <div>
                <dt className="font-semibold text-slate-800">Organization</dt>
                <dd className="mt-1 text-slate-700">{authority.organization}</dd>
              </div>
            ) : null}

            <div>
              <dt className="font-semibold text-slate-800">Mode</dt>
              <dd className="mt-1">
                <span
                  className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${
                    attendanceMode === "On-Site"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-sky-100 text-sky-800"
                  }`}
                >
                  {attendanceMode}
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </article>
  );
}
