/** SHA1 d'un blob git — permet de comparer un fichier local à l'arbre GitHub sans le télécharger. */
export const gitBlobSha = async (content: string): Promise<string> => {
  const bytes = new TextEncoder().encode(content);
  const header = new TextEncoder().encode(`blob ${bytes.length}\0`);
  const payload = new Uint8Array(header.length + bytes.length);
  payload.set(header, 0);
  payload.set(bytes, header.length);
  const digest = await crypto.subtle.digest('SHA-1', payload);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};
