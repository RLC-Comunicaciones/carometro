import type { Metadata } from "next";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "Carómetro FAO | LARC 39",
  description: "Desarrollado por la Unidad Regional de Comunicaciones",
};

const disclaimers = [
  {
    language: "Español",
    text: "La información contenida en este directorio tiene fines exclusivamente informativos y de coordinación para la LARC 39. Las denominaciones empleadas y la presentación de la información no implican la expresión de opinión alguna por parte de la FAO sobre la condición jurídica o nivel de desarrollo de países, territorios, ciudades o autoridades. Los datos personales e imágenes son de uso exclusivo para el evento.",
  },
  {
    language: "English",
    text: "The information contained in this directory is provided exclusively for information and coordination purposes for LARC 39. The designations employed and the presentation of the information do not imply the expression of any opinion whatsoever on the part of FAO concerning the legal status or level of development of any country, territory, city, or authority. Personal data and images are for exclusive use within the event.",
  },
  {
    language: "Français",
    text: "Les informations contenues dans cet annuaire sont fournies exclusivement à des fins d'information et de coordination pour la LARC 39. Les appellations employées et la présentation des informations n'impliquent, de la part de la FAO, aucune prise de position quant au statut juridique ou au niveau de développement de pays, territoires, villes ou autorités. Les données personnelles et les images sont destinées à un usage exclusif dans le cadre de l'événement.",
  },
  {
    language: "Português",
    text: "As informações contidas neste diretório destinam-se exclusivamente a fins informativos e de coordenação para a LARC 39. As denominações utilizadas e a apresentação das informações não implicam a expressão de qualquer opinião por parte da FAO sobre a condição jurídica ou o nível de desenvolvimento de países, territórios, cidades ou autoridades. Os dados pessoais e as imagens são de uso exclusivo para o evento.",
  },
];

export default function DisclaimerPage() {
  return (
    <FadeIn>
      <section className="space-y-6 rounded-2xl border border-line/70 bg-brandBase p-6 sm:p-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-800 sm:text-4xl">
            Disclaimer
          </h1>
          <p>
            <Link
              href="/"
              className="interactive-button inline-flex rounded-lg border border-line/80 bg-white px-3 py-1.5 text-sm text-slate-700 transition hover:border-slate-400 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
            >
              Volver al Home
            </Link>
          </p>
        </header>

        <div className="space-y-4">
          {disclaimers.map((item) => (
            <article
              key={item.language}
              className="rounded-xl border border-line/80 bg-white p-4 sm:p-5"
            >
              <h2 className="text-base font-semibold text-slate-800 sm:text-lg">
                {item.language}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-700 sm:text-base">
                {item.text}
              </p>
            </article>
          ))}
        </div>
      </section>
    </FadeIn>
  );
}
