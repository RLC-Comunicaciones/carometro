import Link from "next/link";
import { notFound } from "next/navigation";
import CountryAuthoritiesPanel from "@/components/CountryAuthoritiesPanel";
import FadeIn from "@/components/FadeIn";
import {
  getAuthoritiesByCountrySlug,
  getCountryIso2,
  getCountries,
  getCountryBySlug,
} from "@/src/lib/faceometer-data";

type CountryPageProps = {
  params: Promise<{
    countrySlug: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getCountries().map((country) => ({
    countrySlug: country.country_slug,
  }));
}

export default async function CountryPage({ params }: CountryPageProps) {
  const { countrySlug } = await params;
  const country = getCountryBySlug(countrySlug);

  if (!country) {
    notFound();
  }

  const authorities = getAuthoritiesByCountrySlug(countrySlug);

  if (authorities.length === 0) {
    notFound();
  }

  const countryIso2 = getCountryIso2(country);

  return (
    <FadeIn>
      <section className="rounded-2xl border border-line/70 bg-brandBase p-6 sm:p-8">
        <header className="flex flex-wrap items-center gap-4">
          {countryIso2 ? (
            <span
              className={`fi fi-${countryIso2} text-4xl leading-none`}
              aria-label={`${country.country_en} flag`}
            />
          ) : (
            <span
              className="inline-block h-8 w-10 rounded bg-surface"
              aria-hidden="true"
            />
          )}
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-800 sm:text-4xl">
              {country.country_en}
            </h1>
            <p className="text-sm text-muted sm:text-base">
              {authorities.length} authorities with photo
            </p>
          </div>
        </header>

        <p className="mt-6">
          <Link
            href="/"
            className="interactive-button rounded-lg px-1 text-slate-700 underline underline-offset-2 transition hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
          >
            Back to countries
          </Link>
        </p>

        <CountryAuthoritiesPanel
          countrySlug={countrySlug}
          authorities={authorities}
        />
      </section>
    </FadeIn>
  );
}
