import assert from 'node:assert/strict';
import { test } from 'node:test';
import { nextRunAt } from './schedule.ts';

test('vise le prochain multiple de 4 h UTC', () => {
  assert.equal(
    nextRunAt(new Date('2026-10-30T09:17:00Z')).toISOString(),
    '2026-10-30T12:00:00.000Z'
  );
});

test('un passage pile sur un créneau vise le suivant', () => {
  assert.equal(
    nextRunAt(new Date('2026-10-30T12:00:00Z')).toISOString(),
    '2026-10-30T16:00:00.000Z'
  );
});

test('passe minuit', () => {
  assert.equal(
    nextRunAt(new Date('2026-10-30T23:59:59Z')).toISOString(),
    '2026-10-31T00:00:00.000Z'
  );
});
