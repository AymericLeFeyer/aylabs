import React from "react";
import {
  Mail,
  Lightbulb,
  LayoutDashboard,
  LifeBuoy,
  MessageSquareText,
  Receipt,
  CalendarCheck,
  MapPin,
  Video,
  ShieldCheck,
  AlertTriangle,
  HeartHandshake,
} from "lucide-react";
import { SEO } from "../components/SEO";
import { PageHeader } from "../components/PageHeader";
import { CONTACT_EMAIL } from "../utils/links";
import { trackContactClick } from "../utils/trackEvents";

const MAIL_SUBJECT = "Demande de conseil domotique";
const MAIL_BODY = [
  "Bonjour,",
  "",
  "Voici mon besoin :",
  "- Ce que je veux faire / mon problème :",
  "- Matériel déjà en place :",
  "- Ma ville :",
  "- Sur place ou en visio :",
  "",
  "Merci !",
].join("\n");

const MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  MAIL_SUBJECT,
)}&body=${encodeURIComponent(MAIL_BODY)}`;

const helps = [
  {
    icon: Lightbulb,
    title: "Conseil et choix du matériel",
    text: "Quelle box, quelle clé, quels capteurs : on part de votre logement et de votre budget, pas d'une liste d'achats générique.",
  },
  {
    icon: LayoutDashboard,
    title: "Configuration Home Assistant",
    text: "Installation, dashboards, intégrations, automatisations : pour que ça serve vraiment au quotidien.",
  },
  {
    icon: LifeBuoy,
    title: "Dépannage et optimisation",
    text: "Un appareil qui décroche, un réseau Zigbee instable, une installation qui rame : on cherche d'où ça vient et on corrige.",
  },
];

const steps = [
  {
    icon: MessageSquareText,
    title: "Vous m'écrivez",
    text: "Par mail, vous m'expliquez votre besoin et ce que vous avez déjà. Pas de formulaire : un message suffit.",
  },
  {
    icon: Receipt,
    title: "Je vous envoie les tarifs",
    text: "Selon votre demande, je vous propose le forfait adapté et son tarif.",
  },
  {
    icon: CalendarCheck,
    title: "On s'organise",
    text: "Si ça vous convient, on fixe un créneau, sur place ou en visio.",
  },
];

const packages = [
  {
    name: "Conseil",
    text: "Un échange pour faire le point sur votre projet, choisir le matériel et partir dans la bonne direction.",
  },
  {
    name: "Mise en route",
    text: "Je vous aide à installer votre système et à connecter vos premiers appareils.",
  },
  {
    name: "Installation complète",
    text: "Réseau, appareils, tableau de bord et automatisations : on construit l'ensemble.",
  },
];

const onMailClick = () => trackContactClick({ placement: "services", subject: MAIL_SUBJECT });

const MailButton: React.FC<{ className?: string }> = ({ className = "" }) => (
  <a
    href={MAILTO}
    onClick={onMailClick}
    className={`inline-flex items-center gap-3 rounded-xl bg-brand px-7 py-4 font-bold text-white transition-all duration-300 hover:bg-brand-deep hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-bright ${className}`}
  >
    <Mail className="h-5 w-5" />
    <span>M'envoyer un mail</span>
  </a>
);

export const Services: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Conseil domotique - AyLabs"
        description="Un coup de main pour votre domotique, votre homelab ou votre impression 3D, sur place autour de Lille ou en visio."
        url="https://aylabs.fr/services"
      />
      <PageHeader
        eyebrow={
          <span className="text-sm font-semibold uppercase tracking-wider text-brand-bright">
            Services
          </span>
        }
        title="Conseil Domotique"
        description="Vous bloquez sur votre installation, ou vous voulez la monter sans vous tromper ? Je peux vous accompagner, sur place autour de Lille ou en visio."
      >
        <MailButton />
      </PageHeader>

      <div className="mx-auto max-w-5xl space-y-16 px-4 py-16 sm:px-6 lg:px-8">
        {/* Pourquoi payant */}
        <section className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand sm:flex">
            <HeartHandshake className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-gray-900">
              Pourquoi un service payant ?
            </h2>
            <p className="mt-3 leading-relaxed text-gray-600">
              Le but, c'est vraiment d'aider les abonnés de la chaîne. Mais je ne peux pas
              aider tout le monde : ça me prendrait tout mon temps. Alors pour continuer à
              le faire correctement, je suis obligé de rendre ce service payant. Les
              vidéos, les tutoriels et la documentation restent gratuits, comme avant.
            </p>
          </div>
        </section>

        {/* Ce que je peux faire */}
        <section>
          <h2 className="font-display text-3xl font-bold text-gray-900">
            Sur quoi je peux vous aider
          </h2>
          <p className="mt-3 max-w-2xl text-gray-600">
            Tout ce que je fais sur la chaîne. Et si votre sujet est un peu à côté ou que je
            ne le connais pas encore, je me renseigne : écrivez-moi, on verra ce qui est
            possible.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {helps.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-gray-200 bg-white p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-lg font-bold text-gray-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Comment ça se passe */}
        <section>
          <h2 className="font-display text-3xl font-bold text-gray-900">Comment ça se passe</h2>
          <ol className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {steps.map(({ icon: Icon, title, text }, index) => (
              <li key={title} className="rounded-2xl border border-gray-200 bg-white p-6">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <Icon className="h-5 w-5 text-brand" />
                </div>
                <h3 className="font-display text-lg font-bold text-gray-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Où */}
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <MapPin className="h-6 w-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-gray-900">Sur place, autour de Lille</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Je peux me déplacer chez vous dans la région lilloise. Des frais de
              déplacement sont à prévoir selon la distance : ils sont indiqués dans les
              tarifs que je vous envoie.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <Video className="h-6 w-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-gray-900">En visio, partout</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Pas à côté de Lille ? Beaucoup de choses se règlent très bien à distance,
              sans frais de déplacement.
            </p>
          </div>
        </section>

        {/* Forfaits */}
        <section>
          <h2 className="font-display text-3xl font-bold text-gray-900">Les forfaits</h2>
          <p className="mt-3 max-w-2xl text-gray-600">
            Chaque forfait existe avec ou sans SAV. Les tarifs ne sont pas affichés : je
            vous les envoie après avoir lu votre besoin.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {packages.map(({ name, text }) => (
              <div key={name} className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6">
                <h3 className="font-display text-xl font-bold text-gray-900">{name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">{text}</p>
                <p className="mt-5 border-t border-gray-100 pt-4 text-sm font-semibold text-brand">
                  Tarif sur demande
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h3 className="font-display text-lg font-bold text-gray-900">Sans SAV</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                J'interviens, on fait ce qui a été convenu, et c'est terminé.
              </p>
            </div>
            <div className="rounded-2xl border border-brand/30 bg-brand/5 p-6">
              <h3 className="flex items-center gap-2 font-display text-lg font-bold text-gray-900">
                <ShieldCheck className="h-5 w-5 text-brand" />
                Avec SAV
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Un suivi après l'intervention, pour les questions et les soucis liés à ce
                qu'on a mis en place. Les modalités sont détaillées dans les tarifs.
              </p>
            </div>
          </div>
        </section>

        {/* Responsabilité */}
        <section className="flex gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-6 sm:p-8">
          <AlertTriangle className="mt-1 h-6 w-6 shrink-0 text-amber-600" />
          <div>
            <h2 className="font-display text-xl font-bold text-gray-900">À savoir</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              Je ne suis pas responsable en cas de panne, avec ou sans SAV. Je vous
              accompagne et je mets toutes les chances de votre côté, mais je ne garantis
              pas le fonctionnement du matériel ou des services utilisés (appareils,
              box, mises à jour, réseau…).
            </p>
          </div>
        </section>

        {/* CTA final */}
        <section className="relative overflow-hidden rounded-2xl bg-ink p-8 text-center text-white sm:p-12">
          <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden="true" />
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand/25 blur-[100px]"
            aria-hidden="true"
          />
          <h2 className="relative font-display text-3xl font-bold">Parlons de votre projet</h2>
          <p className="relative mx-auto mt-4 max-w-xl text-gray-400">
            Expliquez-moi votre besoin par mail, je reviens vers vous avec les tarifs.
            Le bouton ouvre un message déjà structuré : il ne reste qu'à le compléter.
          </p>
          <div className="relative mt-8">
            <MailButton />
          </div>
          <p className="relative mt-4 text-sm text-gray-500">{CONTACT_EMAIL}</p>
        </section>
      </div>
    </div>
  );
};
