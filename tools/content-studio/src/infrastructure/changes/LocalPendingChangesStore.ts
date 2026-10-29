import type { PendingChange } from '../../domain/changes/entities/PendingChange';
import type { PendingChangesStore } from '../../domain/changes/repositories/PendingChangesStore';

const KEY = 'aylabs-studio:pending-changes';

/**
 * localStorage : les modifications survivent à un rechargement ou à une
 * session expirée, mais restent propres à ce navigateur.
 */
export class LocalPendingChangesStore implements PendingChangesStore {
  load(): PendingChange[] {
    try {
      const raw = window.localStorage.getItem(KEY);
      const parsed = raw ? (JSON.parse(raw) as unknown) : [];
      return Array.isArray(parsed) ? (parsed as PendingChange[]) : [];
    } catch {
      return [];
    }
  }

  save(changes: PendingChange[]): void {
    try {
      if (changes.length === 0) window.localStorage.removeItem(KEY);
      else window.localStorage.setItem(KEY, JSON.stringify(changes));
    } catch {
      // Stockage indisponible (navigation privée) : les modifications restent en mémoire.
    }
  }
}
