import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, MapPin, Video, Wrench } from "lucide-react";

const points = [
  "Conseil et choix du matériel",
  "Configuration Home Assistant",
  "Dépannage et optimisation",
];

/** Encart de présentation du service de conseil, avant le Media Kit. */
export const ServicesSection: React.FC = () => (
  <section id="services" className="bg-white py-16">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid items-center gap-8 rounded-2xl border border-brand/20 bg-brand/5 p-8 md:p-10 lg:grid-cols-5 lg:gap-12">
        <div className="lg:col-span-3">
          <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-brand">
            <Wrench className="h-4 w-4" aria-hidden="true" />
            Conseil domotique
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-ink md:text-4xl">
            Besoin d'un coup de main pour votre domotique ?
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-gray-600">
            Je suis déjà passé par là. Si vous bloquez sur votre installation, ou si vous
            voulez la monter sans vous tromper, je peux vous accompagner : sur place autour
            de Lille, ou en visio.
          </p>
          <Link
            to="/services"
            className="group mt-7 inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-bright"
          >
            Découvrir le service
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>

        <div className="lg:col-span-2">
          <ul className="space-y-3">
            {points.map((point) => (
              <li key={point} className="flex items-center gap-3 text-ink">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                {point}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-brand/20 pt-5 text-sm text-gray-600">
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand" aria-hidden="true" />
              Sur place autour de Lille
            </span>
            <span className="flex items-center gap-2">
              <Video className="h-4 w-4 text-brand" aria-hidden="true" />
              Visio partout
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
);
