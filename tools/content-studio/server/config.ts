// Configuration lue à l'EXÉCUTION, jamais au build.
//
// L'image est construite une fois par la CI puis configurée au déploiement : si
// on lisait `process.env` au chargement du module, les valeurs seraient figées
// dans l'image (et le build échouerait, faute de secrets en CI). D'où une
// fonction appelée à chaque requête plutôt que des constantes de module.

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Variable d'environnement manquante : ${name}. Voir tools/content-studio/.env.example.`
    );
  }
  return value;
}

export interface ServerConfig {
  /** URL publique de l'outil, sans slash final — doit correspondre au callback déclaré sur GitHub. */
  appUrl: string;
  githubClientId: string;
  githubClientSecret: string;
  sessionSecret: string;
  repoOwner: string;
  repoName: string;
  branch: string;
  port: number;
}

export function getConfig(): ServerConfig {
  const repo = process.env.GITHUB_REPO || 'AymericLeFeyer/aylabs';
  const [repoOwner, repoName] = repo.split('/');

  if (!repoOwner || !repoName) {
    throw new Error(`GITHUB_REPO doit être au format « owner/nom » (reçu : « ${repo} »).`);
  }

  return {
    appUrl: required('APP_URL').replace(/\/+$/, ''),
    githubClientId: required('GITHUB_CLIENT_ID'),
    githubClientSecret: required('GITHUB_CLIENT_SECRET'),
    sessionSecret: required('SESSION_SECRET'),
    repoOwner,
    repoName,
    branch: process.env.GITHUB_BRANCH || 'main',
    port: Number(process.env.PORT || 8080),
  };
}

/** URL de retour OAuth — doit correspondre exactement à celle déclarée sur GitHub. */
export function callbackUrl(config: ServerConfig): string {
  return `${config.appUrl}/api/auth/callback`;
}
