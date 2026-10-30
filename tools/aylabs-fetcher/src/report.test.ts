import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildReport, serializeReport } from './report.ts';
import type { ApiChannel, ApiVideo } from './report.ts';

const channel: ApiChannel = {
  statistics: { subscriberCount: '13300', viewCount: '2000000', videoCount: '120' },
  snippet: {
    title: 'AyLabs',
    description: 'Domotique',
    thumbnails: {},
    customUrl: '@aylabs',
    publishedAt: '2020-01-01T00:00:00Z',
  },
};

const video = (id: string, publishedAt: string, views: string): ApiVideo => ({
  id,
  statistics: { viewCount: views, likeCount: '10' },
  contentDetails: { duration: 'PT10M' },
  snippet: { title: id, publishedAt, thumbnails: {} },
});

const now = new Date('2026-10-30T12:00:00Z');

test('calcule les indicateurs comme le workflow n8n', () => {
  const report = buildReport(
    channel,
    [
      video('old', '2026-01-01T00:00:00Z', '1000'),
      video('new', '2026-10-20T00:00:00Z', '3000'),
    ],
    now
  );

  assert.equal(report.stats.subscriberCount, 13300);
  assert.equal(report.averageViews, 2000);
  assert.equal(report.engagementRate, 0.5);
  assert.equal(report.recentVideosCount, 1);
});

test('trie du plus récent au plus ancien, compteurs absents à zéro', () => {
  const report = buildReport(
    channel,
    [
      video('old', '2026-01-01T00:00:00Z', '1000'),
      video('new', '2026-10-20T00:00:00Z', '3000'),
    ],
    now
  );

  assert.deepEqual(report.videos.map((entry) => entry.id), ['new', 'old']);
  assert.equal(report.videos[0].commentCount, 0);
});

test('ne divise pas par zéro sans vidéo', () => {
  const report = buildReport(channel, [], now);
  assert.equal(report.averageViews, 0);
  assert.equal(report.engagementRate, 0);
});

test('écrit des vidéos à plat, relues par le site et le Studio', () => {
  const report = buildReport(channel, [video('a', '2026-10-20T00:00:00Z', '1')], now);
  const parsed = JSON.parse(serializeReport(report));
  assert.equal(parsed.videos[0].id, 'a');
  assert.equal('json' in parsed.videos[0], false);
});
