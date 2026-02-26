import CountriesGrid from "@/components/CountriesGrid";
import FadeIn from "@/components/FadeIn";
import PageTitle from "@/components/PageTitle";
import { getCountrySummaries } from "@/src/lib/faceometer-data";

export default function Home() {
  const countries = getCountrySummaries();

  return (
    <FadeIn>
      <section className="rounded-2xl border border-line/70 bg-brandBase p-6 sm:p-8">
        <PageTitle
          title="Countries"
          subtitle="Browse delegations and open each country profile."
        />
        <CountriesGrid countries={countries} />
      </section>
    </FadeIn>
  );
}
