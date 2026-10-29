import type { VideoDraft } from '../../content/entities/ContentItem';
import type { RecentYouTubeVideo } from '../entities/RecentYouTubeVideo';

/**
 * Date et heure de mise en ligne en heure de Paris : c'est ainsi que le site
 * interprète `pubDate` + `pubTime` (voir `vite/videosFeedPlugin.ts`).
 */
export const parisDateTime = (iso: string): { date: string; time: string } => {
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return { date: '', time: '' };
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Paris',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(parsed)
      .map((part) => [part.type, part.value])
  );
  return { date: `${parts.year}-${parts.month}-${parts.day}`, time: `${parts.hour}:${parts.minute}` };
};

/** 1652 -> "27:32", 3725 -> "1:02:05" : le format des fiches. */
export const formatSeconds = (total: number): string => {
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = String(total % 60).padStart(2, '0');
  return hours
    ? `${hours}:${String(minutes).padStart(2, '0')}:${seconds}`
    : `${minutes}:${seconds}`;
};

/** En-tête de section des descriptions de la chaîne, ex. `▶ VIDÉO`, `▶ LIENS UTILES`. */
const SECTION_HEADER = /^▶\s*(.+)$/;

/**
 * Accroche de la description YouTube, sur une ligne : les fiches n'en gardent
 * que ça. Quand la description a une section `▶ VIDÉO` (le haut est alors
 * réservé au sponsor), on part de là. Les lignes de hashtags, de liens et les
 * en-têtes de section sont écartés.
 */
export const summarizeDescription = (raw: string): string => {
  const lines = raw.replace(/\r\n/g, '\n').split('\n');
  const videoSection = lines.findIndex((line) =>
    /^vid[ée]o$/i.test(SECTION_HEADER.exec(line.trim())?.[1]?.trim() ?? '')
  );
  const paragraphs = lines
    .slice(videoSection + 1)
    .join('\n')
    .split(/\n\s*\n/)
    .map((paragraph) =>
      paragraph
        .split('\n')
        .map((line) => line.trim())
        .filter(
          (line) =>
            line && !line.startsWith('#') && !SECTION_HEADER.test(line) && !/https?:\/\//.test(line)
        )
        .join(' ')
        .trim()
    )
    .filter(Boolean);
  return paragraphs[0] ?? '';
};

/**
 * Remplit tout ce que YouTube connaît. Les tags et le corps markdown du
 * brouillon sont conservés : ce sont les seuls champs laissés à la main.
 */
export const draftFromYouTube = (video: RecentYouTubeVideo, current: VideoDraft): VideoDraft => {
  const { date, time } = parisDateTime(video.publishedAt);
  return {
    ...current,
    title: video.title,
    description: summarizeDescription(video.description),
    code: video.code,
    pubDate: date || current.pubDate,
    pubTime: time,
    duration: video.durationSeconds !== null ? formatSeconds(video.durationSeconds) : current.duration,
  };
};

export interface ImportCandidate {
  video: RecentYouTubeVideo;
  /** Une fiche du dépôt porte déjà ce code. */
  hasCard: boolean;
}

/** Les shorts n'ont pas de fiche sur le site : ils ne sont pas proposés. */
export const importCandidates = (
  videos: RecentYouTubeVideo[],
  knownCodes: Set<string>
): ImportCandidate[] =>
  videos
    .filter((video) => !video.isShort)
    .map((video) => ({ video, hasCard: knownCodes.has(video.code) }));
