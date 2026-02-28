import countriesData from "@/src/data/countries.json";
import authoritiesData from "@/src/data/faceometer.json";

export type Country = {
  country_en: string;
  country_code: string | null;
  country_slug: string;
};

export type Authority = {
  country_en: string;
  country_code: string | null;
  country_slug: string;
  first_name: string;
  last_name: string;
  full_name: string;
  authority_slug: string;
  position: string;
  organization: string;
  mode: string | null;
  photo: string;
  hidden?: boolean;
};

export type AttendanceMode = "On-Site" | "Virtual";

export type CountrySummary = Country & {
  country_iso2: string | null;
  authority_count: number;
};

const countries = countriesData as Country[];
const authorities = authoritiesData as Authority[];

function isVisibleAuthority(authority: Authority): boolean {
  return authority.hidden !== true;
}

const countryIso2FallbackBySlug: Record<string, string> = {
  "antigua-and-barbuda": "ag",
  argentina: "ar",
  bahamas: "bs",
  barbados: "bb",
  belize: "bz",
  bolivia: "bo",
  brazil: "br",
  chile: "cl",
  colombia: "co",
  cuba: "cu",
  dominica: "dm",
  "dominican-republic": "do",
  ecuador: "ec",
  "el-salvador": "sv",
  grenada: "gd",
  guatemala: "gt",
  guyana: "gy",
  haiti: "ht",
  honduras: "hn",
  jamaica: "jm",
  mexico: "mx",
  panama: "pa",
  paraguay: "py",
  peru: "pe",
  "saint-kitts-and-nevis": "kn",
  "saint-lucia": "lc",
  "saint-vincent-and-the-grenadines": "vc",
  "united-kingdom": "gb",
  uruguay: "uy",
  venezuela: "ve",
};

function normalizeIso2(countryCode: string | null): string | null {
  if (!countryCode) return null;
  const normalized = countryCode.trim().toLowerCase();
  if (/^[a-z]{2}$/.test(normalized)) return normalized;
  return null;
}

export function getCountryIso2(country: Country): string | null {
  return normalizeIso2(country.country_code) ?? countryIso2FallbackBySlug[country.country_slug] ?? null;
}

export function getAttendanceMode(value: string | null): AttendanceMode {
  const normalized = (value ?? "").trim().toLowerCase();
  if (normalized.includes("virtual")) return "Virtual";
  return "On-Site";
}

export function getCountries(): Country[] {
  return [...countries].sort((a, b) =>
    a.country_en.localeCompare(b.country_en, "en", { sensitivity: "base" })
  );
}

export function getCountryBySlug(countrySlug: string): Country | undefined {
  return countries.find((country) => country.country_slug === countrySlug);
}

export function getAuthorities(): Authority[] {
  return authorities.filter(isVisibleAuthority);
}

export function getAuthoritiesByCountrySlug(countrySlug: string): Authority[] {
  return authorities
    .filter(
      (authority) =>
        authority.country_slug === countrySlug && isVisibleAuthority(authority)
    )
    .sort((a, b) =>
      a.full_name.localeCompare(b.full_name, "en", { sensitivity: "base" })
    );
}

export function getAuthorityBySlugs(
  countrySlug: string,
  authoritySlug: string
): Authority | undefined {
  return authorities.find(
    (authority) =>
      authority.country_slug === countrySlug &&
      authority.authority_slug === authoritySlug &&
      isVisibleAuthority(authority)
  );
}

export function getCountrySummaries(): CountrySummary[] {
  const authorityCountByCountry = authorities.reduce<Record<string, number>>(
    (acc, authority) => {
      if (!isVisibleAuthority(authority)) return acc;
      if (!authority.photo) return acc;
      acc[authority.country_slug] = (acc[authority.country_slug] ?? 0) + 1;
      return acc;
    },
    {}
  );

  return getCountries()
    .map((country) => ({
      ...country,
      country_iso2: getCountryIso2(country),
      authority_count: authorityCountByCountry[country.country_slug] ?? 0,
    }))
    .filter((country) => country.authority_count > 0);
}
