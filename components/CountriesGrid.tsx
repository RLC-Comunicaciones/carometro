"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import AnimatedList from "@/components/AnimatedList";

type CountryCard = {
  country_en: string;
  country_slug: string;
  country_iso2: string | null;
  authority_count: number;
};

type CountriesGridProps = {
  countries: CountryCard[];
};

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export default function CountriesGrid({ countries }: CountriesGridProps) {
  const [search, setSearch] = useState("");

  const filteredCountries = useMemo(() => {
    const query = normalizeText(search.trim());
    if (!query) return countries;

    return countries.filter((country) =>
      normalizeText(country.country_en).includes(query)
    );
  }, [countries, search]);

  return (
    <div className="mt-8 space-y-6">
      <div className="max-w-lg">
        <label htmlFor="country-search" className="mb-2 block text-sm text-muted">
          Search country
        </label>
        <input
          id="country-search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Type a country name..."
          className="interactive-button w-full rounded-xl border border-line/80 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 sm:text-base"
        />
      </div>

      {filteredCountries.length === 0 ? (
        <p className="text-sm text-muted sm:text-base">No countries match your search.</p>
      ) : (
        <AnimatedList
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
          staggerMs={40}
        >
          {filteredCountries.map((country) => (
            <li key={country.country_slug}>
              <Link
                href={`/country/${country.country_slug}`}
                className="interactive-card group flex h-full items-start gap-4 rounded-2xl border border-line/80 bg-surface p-5 transition hover:border-slate-300 hover:bg-[#ececec] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
              >
                {country.country_iso2 ? (
                  <span
                    className={`fi fi-${country.country_iso2} mt-0.5 text-[2rem] leading-none sm:text-[2.15rem]`}
                    aria-label={`${country.country_en} flag`}
                  />
                ) : (
                  <span
                    className="mt-0.5 inline-block h-7 w-10 rounded bg-brandBase"
                    aria-hidden="true"
                  />
                )}

                <span className="min-w-0">
                  <span className="block text-base font-medium text-slate-800">
                    {country.country_en}
                  </span>
                  <span className="block text-sm text-muted">
                    {country.authority_count} authorities with photo
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </AnimatedList>
      )}
    </div>
  );
}
