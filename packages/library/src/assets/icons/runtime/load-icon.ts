import bucketLoaders, { iconNames, type IconBucket } from './bucket-loaders';

const ICON_NAME_PATTERN = /^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/;
const bucketRequests = new Map<string, Promise<IconBucket | undefined>>();
const iconCache = new Map<string, string | undefined>();

function getBucketName(name: string): string {
  return name.replaceAll('-', '').toLowerCase().slice(0, 2);
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

export async function loadLegacyIcon(name: string): Promise<string | undefined> {
  if (iconCache.has(name)) return iconCache.get(name);

  if (!ICON_NAME_PATTERN.test(name)) {
    iconCache.set(name, undefined);
    return undefined;
  }

  const bucket = await loadBucket(getBucketName(name));
  const markup = bucket?.[name];
  iconCache.set(name, markup);

  return markup;
}

export function hasLegacyIcon(name: string): boolean {
  return iconNames.has(name);
}
