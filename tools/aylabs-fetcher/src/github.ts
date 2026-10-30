const API_URL = 'https://api.github.com';
const TIMEOUT_MS = 30_000;

export interface FileTarget {
  token: string;
  repo: string;
  branch: string;
  path: string;
}

const request = async (
  target: FileTarget,
  url: string,
  init: RequestInit = {}
): Promise<Response> => {
  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${target.token}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new Error(`GitHub ${init.method ?? 'GET'} : ${response.status}`);
  }
  return response;
};

/**
 * Commite `content` s'il diffère de la version de la branche. Renvoie `false`
 * sans rien écrire sinon : un commit identique déclencherait un build pour rien.
 */
export const commitFile = async (
  target: FileTarget,
  content: string,
  message: string
): Promise<boolean> => {
  const url = `${API_URL}/repos/${target.repo}/contents/${target.path}`;
  const current = (await (
    await request(target, `${url}?ref=${encodeURIComponent(target.branch)}`)
  ).json()) as { sha: string; content: string };

  const encoded = Buffer.from(content, 'utf8').toString('base64');
  if (current.content.replace(/\s/g, '') === encoded) return false;

  await request(target, url, {
    method: 'PUT',
    body: JSON.stringify({
      message,
      content: encoded,
      sha: current.sha,
      branch: target.branch,
    }),
  });
  return true;
};
