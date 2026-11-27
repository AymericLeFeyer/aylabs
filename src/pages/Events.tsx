import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { SEO } from "../components/SEO";
import { PageHeader } from "../components/PageHeader";
import { EVENTS, isUpcoming, type AyEvent } from "../data/events";

const EventCard: React.FC<{ event: AyEvent; past?: boolean }> = ({ event, past }) => {
  const day = new Date(`${event.date}T12:00:00`);
  return (
    <Link
      to={`/events/${event.slug}`}
      className={`group flex flex-col gap-5 rounded-xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl hover:shadow-brand/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:flex-row sm:items-center ${past ? "opacity-70" : ""}`}
    >
      <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-xl bg-ink text-white">
        <span className="font-display text-3xl font-bold leading-none">{day.getDate()}</span>
        <span className="mt-1 text-xs font-semibold uppercase tracking-wider text-brand-bright">
          {day.toLocaleDateString("fr-FR", { month: "short" }).replace(".", "")}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="font-display text-xl font-bold text-gray-900 transition-colors group-hover:text-brand">
          {event.title}
        </h2>
        <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" />
            {event.dateLabel}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            {event.venue}, {event.city}
          </span>
        </p>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">{event.summary}</p>
      </div>
      <ArrowRight className="hidden h-5 w-5 shrink-0 text-gray-300 transition-colors group-hover:text-brand sm:block" />
    </Link>
  );
};

export const Events: React.FC = () => {
  const upcoming = EVENTS.filter((e) => isUpcoming(e)).sort((a, b) => a.date.localeCompare(b.date));
  const past = EVENTS.filter((e) => !isUpcoming(e)).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Évènements - AyLabs"
        description="Les salons et rencontres où retrouver AyLabs : démos domotique, homelab et impression 3D en vrai."
        url="https://aylabs.fr/events"
      />
      <PageHeader
        eyebrow={
          <span className="text-sm font-semibold uppercase tracking-wider text-brand-bright">
            Évènements
          </span>
        }
        title="Où me croiser"
        description="Les salons et rencontres où je viens avec du matériel : l'occasion de voir les démos en vrai et de discuter domotique."
      />

      <div className="mx-auto max-w-5xl space-y-12 px-4 py-16 sm:px-6 lg:px-8">
        <section>
          <h2 className="font-display text-2xl font-bold text-gray-900">À venir</h2>
          {upcoming.length ? (
            <div className="mt-6 space-y-4">
              {upcoming.map((event) => (
                <EventCard key={event.slug} event={event} />
              ))}
            </div>
          ) : (
            <p className="mt-4 text-gray-600">Rien de prévu pour l'instant. Revenez bientôt !</p>
          )}
        </section>

        {past.length > 0 && (
          <section>
            <h2 className="font-display text-2xl font-bold text-gray-900">Passés</h2>
            <div className="mt-6 space-y-4">
              {past.map((event) => (
                <EventCard key={event.slug} event={event} past />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
