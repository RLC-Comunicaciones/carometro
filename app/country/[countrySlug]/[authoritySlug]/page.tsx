import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AuthorityProfile from "@/components/AuthorityProfile";
import FadeIn from "@/components/FadeIn";
import {
  getAuthorities,
  getAuthorityBySlugs,
  getCountryBySlug,
} from "@/src/lib/faceometer-data";

type AuthorityPageProps = {
  params: Promise<{
    countrySlug: string;
    authoritySlug: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getAuthorities().map((authority) => ({
    countrySlug: authority.country_slug,
    authoritySlug: authority.authority_slug,
  }));
}

export async function generateMetadata({
  params,
}: AuthorityPageProps): Promise<Metadata> {
  const { countrySlug, authoritySlug } = await params;
  const country = getCountryBySlug(countrySlug);
  const authority = getAuthorityBySlugs(countrySlug, authoritySlug);

  const title = "Carómetro FAO | LARC 39";
  const description = "Desarrollado por la Unidad Regional de Comunicaciones";
  const imageUrl = "/larc39.jpeg";

  if (!country || !authority) {
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
      },
    };
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function AuthorityPage({ params }: AuthorityPageProps) {
  const { countrySlug, authoritySlug } = await params;

  const country = getCountryBySlug(countrySlug);
  const authority = getAuthorityBySlugs(countrySlug, authoritySlug);

  if (!country || !authority) {
    notFound();
  }

  return (
    <FadeIn>
      <section className="rounded-2xl border border-line/70 bg-brandBase p-6 sm:p-8">
        <nav aria-label="Breadcrumb" className="text-sm text-muted">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link
                href="/"
                className="interactive-button rounded-lg px-1 text-slate-700 underline underline-offset-2 transition hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true">&gt;</li>
            <li>
              <Link
                href={`/country/${countrySlug}`}
                className="interactive-button rounded-lg px-1 text-slate-700 underline underline-offset-2 transition hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
              >
                {country.country_en}
              </Link>
            </li>
            <li aria-hidden="true">&gt;</li>
            <li className="text-slate-600" aria-current="page">
              {authority.full_name}
            </li>
          </ol>
        </nav>

        <p className="mt-4">
          <Link
            href={`/country/${countrySlug}`}
            className="interactive-button rounded-lg px-1 text-slate-700 underline underline-offset-2 transition hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
          >
            Back to {country.country_en}
          </Link>
        </p>

        <AuthorityProfile
          authority={authority}
          countryName={country.country_en}
        />
      </section>
    </FadeIn>
  );
}
