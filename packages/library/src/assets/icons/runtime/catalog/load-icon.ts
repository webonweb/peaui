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
  const [category = 'core', name = ''] = publicName.split('/');
  let bucketSource = name;

  if (bucketSource.startsWith(`${category}-`)) {
    bucketSource = bucketSource.slice(category.length + 1);
  } else if (category === 'core' && bucketSource.startsWith('badge-')) {
    bucketSource = bucketSource.slice('badge-'.length);
  }

  return `${category}-${bucketSource.replaceAll('-', '').slice(0, 2)}`;
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
