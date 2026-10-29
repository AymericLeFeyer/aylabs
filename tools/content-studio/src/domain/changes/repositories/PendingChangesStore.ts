import type { PendingChange } from '../entities/PendingChange';

/** Persistance locale des modifications en attente (survit au rechargement). */
export interface PendingChangesStore {
  load(): PendingChange[];
  save(changes: PendingChange[]): void;
}
