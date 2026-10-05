import bucketLoaders, { type IconBucket } from './bucket-loaders';

export type CatalogIconData = {
  body: string;
  fill: 'none';
  height: '24';
  stroke: 'currentColor';
  strokeLinecap: 'round';
  strokeLinejoin: 'round';
  strokeWidth: '1.8';
  viewBox: '0 0 24 24';
  width: '24';
};

const ICON_NAME_PATTERN = /^[a-z][a-z0-9-]*\/[a-z0-9]+(?:-[a-z0-9]+)*$/;
const bucketRequests = new Map<string, Promise<IconBucket | undefined>>();
const iconCache = new Map<string, CatalogIconData | undefined>();

function getBucketName(publicName: string): string {
  let hash = 2166136261;

  for (let index = 0; index < publicName.length; index += 1) {
    hash ^= publicName.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return `catalog-${((hash >>> 0) % 32).toString(16).padStart(2, '0')}`;
}

async function loadBucket(name: string): Promise<IconBucket | undefined> {
  const activeRequest = bucketRequests.get(name);

  if (activeRequest) return activeRequest;

  const loader = bucketLoaders[name];

  if (!loader) return undefined;

  const request = loader().catch(() => undefined);
  bucketRequests.set(name, request);

  return request;
}

export async function loadCatalogIcon(publicName: string): Promise<CatalogIconData | undefined> {
  if (!ICON_NAME_PATTERN.test(publicName)) return undefined;
  if (iconCache.has(publicName)) return iconCache.get(publicName);

  const bucket = await loadBucket(getBucketName(publicName));
  const body = bucket?.[publicName];
  const icon = body
    ? {
        body,
        fill: 'none' as const,
        height: '24' as const,
        stroke: 'currentColor' as const,
        strokeLinecap: 'round' as const,
        strokeLinejoin: 'round' as const,
        strokeWidth: '1.8' as const,
        viewBox: '0 0 24 24' as const,
        width: '24' as const,
      }
    : undefined;

  iconCache.set(publicName, icon);

  return icon;
}
