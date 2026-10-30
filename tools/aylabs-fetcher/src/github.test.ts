import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { commitFile } from './github.ts';

const target = { token: 't', repo: 'o/r', branch: 'main', path: 'public/stats.json' };
const realFetch = globalThis.fetch;

/** Remplace `fetch` par un dépôt factice et journalise les appels. */
const fakeGitHub = (remote: string, putStatus = 200) => {
  const calls: { method: string; url: string; body?: { sha: string; content: string } }[] = [];
  globalThis.fetch = (async (url: string, init: RequestInit = {}) => {
    const method = init.method ?? 'GET';
    calls.push({
      method,
      url,
      body: init.body ? JSON.parse(init.body as string) : undefined,
    });
    return method === 'GET'
      ? Response.json({ sha: 'abc', content: Buffer.from(remote).toString('base64') })
      : new Response('{}', { status: putStatus });
  }) as typeof fetch;
  return calls;
};

afterEach(() => {
  globalThis.fetch = realFetch;
});

test('ne commite pas un contenu identique', async () => {
  const calls = fakeGitHub('même contenu é');
  assert.equal(await commitFile(target, 'même contenu é', 'msg'), false);
  assert.deepEqual(calls.map((call) => call.method), ['GET']);
});

test('commite un contenu différent avec le SHA lu', async () => {
  const calls = fakeGitHub('ancien');
  assert.equal(await commitFile(target, 'nouveau', 'msg'), true);
  assert.equal(calls[1].method, 'PUT');
  assert.equal(calls[1].body?.sha, 'abc');
  assert.equal(Buffer.from(calls[1].body?.content ?? '', 'base64').toString(), 'nouveau');
});

test('remonte une erreur sans exposer le jeton', async () => {
  fakeGitHub('ancien', 409);
  await assert.rejects(commitFile(target, 'nouveau', 'msg'), /GitHub PUT : 409/);
});
