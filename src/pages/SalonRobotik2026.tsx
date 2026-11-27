import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock,
  ExternalLink,
  Gift,
  Home,
  MapPin,
  Mic,
  Ticket,
  Users,
  Wrench,
} from "lucide-react";
import { SEO } from "../components/SEO";
import { PageHeader } from "../components/PageHeader";
import { trackExternalLinkClick } from "../utils/trackEvents";

const OFFICIAL_URL =
  "https://www.entreprises.gouv.fr/semaine-de-lindustrie/56881307_salon-robotik-journees-grand-public-5242181";
const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=P%C3%A9v%C3%A8le+Carembault+Arena+Orchies";

const facts = [
  { icon: CalendarDays, label: "Week-end grand public", value: "Samedi 28 et dimanche 29 novembre 2026" },
  { icon: Clock, label: "Mon stand", value: "Samedi 28 novembre, de 10 h à 18 h" },
  { icon: MapPin, label: "Lieu", value: "Pévèle Carembault Arena, Orchies (59310)" },
  { icon: Ticket, label: "Entrée", value: "Gratuite" },
];

const highlights = [
  {
    icon: Wrench,
    title: "Plus de 100 activités",
    text: "Impression 3D, modélisation, création de jeu vidéo, prototypage, drones, robotique, avec un espace maker tout le week-end.",
  },
  {
    icon: Mic,
    title: "12 mini-conférences",
    text: "Robotique, cybersécurité, métiers de la data, innovation et reconversion vers le numérique.",
  },
  {
    icon: Users,
    title: "Près de 100 exposants",
    text: "Entreprises, écoles, associations et démonstrateurs, dont le camion Fabrique 4.0 de l'UIMM et un espace électromobilité.",
  },
];

const goodies = ["Porte-clés NFC", "Magnets", "Jetons de caddie"];

const onOfficialClick = () =>
  trackExternalLinkClick({ url: OFFICIAL_URL, label: "Page officielle", placement: "event", page: "salon-robotik-2026" });
const onMapsClick = () =>
  trackExternalLinkClick({ url: MAPS_URL, label: "Itinéraire", placement: "event", page: "salon-robotik-2026" });

export const SalonRobotik2026: React.FC = () => (
  <div className="min-h-screen bg-gray-50">
    <SEO
      title="Salon Robotik 2026 à Orchies - AyLabs"
      description="AyLabs expose au Salon Robotik 2026 à Orchies, samedi 28 novembre de 10 h à 18 h : planche de démo domotique 100 % locale et goodies imprimés en 3D. Entrée gratuite."
      url="https://aylabs.fr/events/salon-robotik-2026"
    />
    <PageHeader
      eyebrow={
        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-bright hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Évènements
        </Link>
      }
      title="Salon Robotik 2026"
      description="Le salon du numérique et de l'industrie du futur de la Pévèle Carembault, à Orchies. J'y expose le samedi 28 novembre : venez voir la domotique en vrai."
    >
      <div className="flex flex-wrap gap-3">
        <Link
          to="/events/salon-robotik-2026/expo"
          className="inline-flex items-center gap-3 rounded-xl bg-brand px-7 py-4 font-bold text-white transition-all duration-300 hover:bg-brand-deep hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-bright"
        >
          <span>Voir mon stand</span>
          <ArrowRight className="h-5 w-5" />
        </Link>
        <a
          href={MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onMapsClick}
          className="inline-flex items-center gap-3 rounded-xl border border-ink-line px-7 py-4 font-bold text-white transition-colors hover:border-brand-bright focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-bright"
        >
          <MapPin className="h-5 w-5" />
          <span>Itinéraire</span>
        </a>
      </div>
    </PageHeader>

    <div className="mx-auto max-w-5xl space-y-16 px-4 py-16 sm:px-6 lg:px-8">
      {/* Infos pratiques */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {facts.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{label}</p>
              <p className="font-semibold text-gray-900">{value}</p>
            </div>
          </div>
        ))}
      </section>

      {/* J'y expose */}
      <section className="relative overflow-hidden rounded-2xl bg-ink p-8 text-white sm:p-12">
        <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand/25 blur-[100px]"
          aria-hidden="true"
        />
        <div className="relative grid grid-cols-1 gap-10 md:grid-cols-2">
          <div>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand/20 text-brand-bright">
              <Home className="h-6 w-6" />
            </div>
            <h2 className="font-display text-3xl font-bold">J'y expose</h2>
            <p className="mt-4 leading-relaxed text-gray-400">
              Retrouvez-moi sur le stand AyLabs le samedi 28 novembre, de 10 h à 18 h, avec
              Domadoo comme partenaire. Au programme : une planche de démo domotique qui
              tourne 100 % en local, sans Internet. Ouvrez une porte, mouillez le détecteur
              de fuite, appuyez sur un bouton, et regardez la maison réagir en direct.
            </p>
            <p className="mt-4 leading-relaxed text-gray-400">
              Home Assistant, Zigbee, homelab, impression 3D : venez avec vos questions.
            </p>
            <Link
              to="/events/salon-robotik-2026/expo"
              className="mt-6 inline-flex items-center gap-2 font-semibold text-brand-bright hover:text-white"
            >
              Tout le matériel du stand
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand/20 text-brand-bright">
              <Gift className="h-6 w-6" />
            </div>
            <h2 className="font-display text-3xl font-bold">Je ramène des goodies</h2>
            <p className="mt-4 leading-relaxed text-gray-400">
              Imprimés en 3D pour l'occasion, à récupérer sur le stand, dans la limite des
              stocks :
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {goodies.map((g) => (
                <li
                  key={g}
                  className="rounded-full border border-ink-line bg-ink-soft px-4 py-2 text-sm font-semibold"
                >
                  {g}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Le salon */}
      <section>
        <h2 className="font-display text-3xl font-bold text-gray-900">Le salon</h2>
        <p className="mt-3 max-w-3xl leading-relaxed text-gray-600">
          Le Salon Robotik est l'évènement phare de la semaine du Numérique de la Pévèle
          Carembault. Né en 2017 avec une dizaine de stands, il a accueilli 7 000 visiteurs en
          2025. Le salon dure du 26 au 29 novembre : jeudi et vendredi sont réservés aux
          entreprises et aux scolaires, le week-end est ouvert à tous, en famille.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {highlights.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-gray-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{text}</p>
            </div>
          ))}
        </div>
        <a
          href={OFFICIAL_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onOfficialClick}
          className="mt-8 inline-flex items-center gap-2 font-semibold text-brand hover:text-brand-deep"
        >
          Programme sur la page officielle
          <ExternalLink className="h-4 w-4" />
        </a>
      </section>
    </div>
  </div>
);
