import { INITIAL_RESOURCES, Resource } from './initial-resources';

// Global singleton in-memory resource store for serverless API routes
const globalStore = global as unknown as {
  __PEERS_CHARITY_RESOURCES__?: Resource[];
};

if (!globalStore.__PEERS_CHARITY_RESOURCES__) {
  globalStore.__PEERS_CHARITY_RESOURCES__ = [...INITIAL_RESOURCES];
}

export function getServerResources(): Resource[] {
  return globalStore.__PEERS_CHARITY_RESOURCES__ || [...INITIAL_RESOURCES];
}

export function getServerResourceById(id: string): Resource | undefined {
  const all = getServerResources();
  return all.find((r) => r.id === id);
}

export function addServerResource(resource: Resource): Resource {
  const current = getServerResources();
  // Filter out if duplicate ID exists
  const next = [resource, ...current.filter((r) => r.id !== resource.id)];
  globalStore.__PEERS_CHARITY_RESOURCES__ = next;
  return resource;
}

export function updateServerResource(
  id: string,
  updates: Partial<Resource>
): Resource | null {
  const current = getServerResources();
  const index = current.findIndex((r) => r.id === id);
  if (index === -1) return null;

  const existing = current[index];
  const updated: Resource = {
    ...existing,
    ...updates,
    id: existing.id, // Preserve immutable ID
    reviews: updates.reviews || existing.reviews,
    academicMetadata: updates.academicMetadata
      ? { ...existing.academicMetadata, ...updates.academicMetadata }
      : existing.academicMetadata,
  };

  current[index] = updated;
  globalStore.__PEERS_CHARITY_RESOURCES__ = [...current];
  return updated;
}

export function deleteServerResource(id: string): boolean {
  const current = getServerResources();
  const exists = current.some((r) => r.id === id);
  if (!exists) return false;

  globalStore.__PEERS_CHARITY_RESOURCES__ = current.filter((r) => r.id !== id);
  return true;
}
