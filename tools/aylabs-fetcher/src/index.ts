import { setTimeout as sleep } from 'node:timers/promises';
import { notifyFailure, notifySuccess } from './discord.ts';
import { commitFile } from './github.ts';
import { buildReport, serializeReport } from './report.ts';
import { nextRunAt } from './schedule.ts';
import { fetchChannel, fetchRecentVideos } from './youtube.ts';

const STATS_PATH = 'public/youtube-stats.json';
const COMMIT_MESSAGE = 'data(youtube): update data with aylabs-fetcher';

const dryRun = process.argv.includes('--dry-run');
const once = dryRun || process.argv.includes('--once');

const required = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    console.error(`Variable d'environnement manquante : ${name}`);
    process.exit(1);
  }
  return value;
};

const youtubeKey = required('YOUTUBE_API_KEY');
const token = dryRun ? '' : required('FETCHER_GITHUB_TOKEN');
const webhookUrl = dryRun ? undefined : process.env.DISCORD_WEBHOOK_URL;
const channelId = process.env.YOUTUBE_CHANNEL_ID || 'UClCAe7FyrIwpkt9H56XRndA';
const repo = process.env.GITHUB_REPO || 'AymericLeFeyer/aylabs';
const branch = process.env.GITHUB_BRANCH || 'main';

/** Renvoie `false` en cas d'échec, déjà journalisé et notifié. */
const run = async (): Promise<boolean> => {
  try {
    const [channel, videos] = await Promise.all([
      fetchChannel(youtubeKey, channelId),
      fetchRecentVideos(youtubeKey, channelId),
    ]);
    const report = buildReport(channel, videos);
    const content = serializeReport(report);

    if (dryRun) {
      process.stdout.write(content);
      return true;
    }

    const committed = await commitFile(
      { token, repo, branch, path: STATS_PATH },
      content,
      COMMIT_MESSAGE
    );
    console.log(
      `${report.videos.length} vidéos, ${committed ? 'commit envoyé' : 'aucun changement'}`
    );
    await notifySuccess(webhookUrl, report, committed);
    return true;
  } catch (error) {
    console.error('Échec du passage :', error);
    await notifyFailure(
      webhookUrl,
      error instanceof Error ? error.message : String(error)
    );
    return false;
  }
};

if (once) {
  process.exitCode = (await run()) ? 0 : 1;
} else {
  // Boucle infinie : un passage raté attend simplement le créneau suivant.
  for (;;) {
    const next = nextRunAt(new Date());
    console.log(`Prochain passage : ${next.toISOString()}`);
    await sleep(next.getTime() - Date.now());
    await run();
  }
}
