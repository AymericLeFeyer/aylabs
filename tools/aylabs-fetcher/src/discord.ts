import type { StatsReport } from './report.ts';

const TIMEOUT_MS = 10_000;

/** Une notification ratée ne doit jamais faire échouer ni arrêter le fetcher. */
const send = async (webhookUrl: string | undefined, body: unknown): Promise<void> => {
  if (!webhookUrl) return;
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) console.error(`Discord : ${response.status}`);
  } catch (error) {
    console.error('Discord injoignable :', error);
  }
};

export const notifySuccess = (
  webhookUrl: string | undefined,
  report: StatsReport,
  committed: boolean
): Promise<void> =>
  send(webhookUrl, {
    content: committed
      ? '🚀 Stats successfully fetched and updated to GitHub'
      : '🟰 Stats fetched, nothing changed',
    embeds: [
      {
        title: report.stats.channelTitle,
        description: [
          `${report.stats.subscriberCount} Subscribers`,
          `${report.stats.viewCount} Views`,
          `${report.stats.videoCount} Videos`,
          `${report.engagementRate} Engagement Rate`,
        ].join('\n'),
      },
    ],
  });

export const notifyFailure = (
  webhookUrl: string | undefined,
  reason: string
): Promise<void> =>
  send(webhookUrl, {
    content: `❌ An error occurred during stats fetch: ${reason} @everyone`,
  });
