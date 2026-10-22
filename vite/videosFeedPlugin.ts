import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Plugin } from "vite";

/**
 * Publie `/videos-feed.json` : les vidéos qui ont une fiche dans
 * `src/content/videos`, au même format que les entrées de `youtube-stats.json`
 * (`id`, `title`, `publishedAt` ISO, `duration` ISO 8601, `thumbnails`).
 *
 * Contrairement au flux n8n (API YouTube), il contient les vidéos non listées
 * publiquement par YouTube (non répertoriées, premières) dès que leur fiche
 * existe. Lu par le linktree (encart « Dernière vidéo ») via un relais nginx.
 *
 * Les fiches programmées sont incluses avec leur date future : au lecteur de
 * les ignorer tant qu'elles ne sont pas sorties (comme le fait le site).
 */

const FILE_NAME = "videos-feed.json";
/** `pubTime` est l'heure de mise en ligne du créateur : heure de Paris. */
const TIME_ZONE = "Europe/Paris";
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface FeedVideo {
  id: string;
  slug: string;
  title: string;
  publishedAt: string;
  duration: string | null;
  thumbnails: Record<"maxres" | "high", { url: string }>;
}

/** Champs scalaires du frontmatter (`clé: "valeur"`), sans dépendre du parseur du site. */
function frontmatter(markdown: string): Record<string, string> {
  // Fins de ligne CRLF possibles (checkout Windows).
  const block = /^---\s*\n([\s\S]*?)\n---/.exec(markdown.replace(/\r\n/g, "\n"))?.[1] ?? "";
  const fields: Record<string, string> = {};
  for (const line of block.split("\n")) {
    const match = /^(\w+):\s*(.+)$/.exec(line);
    if (match) fields[match[1]] = match[2].trim().replace(/^"(.*)"$/, "$1");
  }
  return fields;
}

/** Décalage (ms) du fuseau à un instant donné. */
function zoneOffset(instant: number): number {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: TIME_ZONE,
      hourCycle: "h23",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    })
      .formatToParts(instant)
      .map((part) => [part.type, Number(part.value)]),
  );
  const asUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
  return asUtc - instant;
}

/** `"Oct 20 2026"` + `"20:00"` (heure de Paris, minuit par défaut) → ISO UTC, ou null. */
export function publishedAt(pubDate: string, pubTime: string | undefined): string | null {
  const date = /^([A-Z][a-z]{2}) (\d{1,2}) (\d{4})$/.exec(pubDate);
  const month = date ? MONTHS.indexOf(date[1]) : -1;
  if (!date || month < 0) return null;
  const time = /^(\d{1,2}):(\d{2})$/.exec(pubTime ?? "");
  const wall = Date.UTC(Number(date[3]), month, Number(date[2]), time ? Number(time[1]) : 0, time ? Number(time[2]) : 0);
  // Deux passes : le décalage dépend de l'instant (changements d'heure).
  const guess = wall - zoneOffset(wall);
  return new Date(wall - zoneOffset(guess)).toISOString();
}

/** `"29:11"` ou `"1:02:09"` → `"PT29M11S"` / `"PT1H2M9S"`, ou null. */
export function isoDuration(value: string | undefined): string | null {
  if (!value || !/^\d+(:\d{1,2}){1,2}$/.test(value)) return null;
  const parts = value.split(":").map(Number);
  const [hours, minutes, seconds] = parts.length === 3 ? parts : [0, ...parts];
  return `PT${hours ? `${hours}H` : ""}${minutes ? `${minutes}M` : ""}${seconds}S`;
}

function buildFeed(dir: string): string {
  const videos: FeedVideo[] = [];
  for (const file of readdirSync(dir).filter((name) => name.endsWith(".md"))) {
    const fields = frontmatter(readFileSync(join(dir, file), "utf8"));
    const published = fields.pubDate ? publishedAt(fields.pubDate, fields.pubTime) : null;
    if (!fields.code || !fields.title || !published) continue;
    videos.push({
      id: fields.code,
      slug: file.replace(/\.md$/, ""),
      title: fields.title,
      publishedAt: published,
      duration: isoDuration(fields.duration),
      thumbnails: {
        maxres: { url: `https://i.ytimg.com/vi/${fields.code}/maxresdefault.jpg` },
        high: { url: `https://i.ytimg.com/vi/${fields.code}/hqdefault.jpg` },
      },
    });
  }
  videos.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  return JSON.stringify({ videos });
}

export function videosFeedPlugin(contentDir: string): Plugin {
  return {
    name: "aylabs-videos-feed",
    configureServer(server) {
      server.middlewares.use(`/${FILE_NAME}`, (_req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.end(buildFeed(contentDir));
      });
    },
    generateBundle() {
      this.emitFile({ type: "asset", fileName: FILE_NAME, source: buildFeed(contentDir) });
    },
  };
}
