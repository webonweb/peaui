// Ten plik jest generowany przez scripts/sync-icon-catalog.mjs.
export type IconBucket = Readonly<Record<string, string>>;
export type IconBucketLoader = () => Promise<IconBucket>;

const bucketLoaders: Readonly<Record<string, IconBucketLoader>> = {
  "catalog-00": () => import('./buckets/catalog-00').then(({ default: bucket }) => bucket),
  "catalog-01": () => import('./buckets/catalog-01').then(({ default: bucket }) => bucket),
  "catalog-02": () => import('./buckets/catalog-02').then(({ default: bucket }) => bucket),
  "catalog-03": () => import('./buckets/catalog-03').then(({ default: bucket }) => bucket),
  "catalog-04": () => import('./buckets/catalog-04').then(({ default: bucket }) => bucket),
  "catalog-05": () => import('./buckets/catalog-05').then(({ default: bucket }) => bucket),
  "catalog-06": () => import('./buckets/catalog-06').then(({ default: bucket }) => bucket),
  "catalog-07": () => import('./buckets/catalog-07').then(({ default: bucket }) => bucket),
  "catalog-08": () => import('./buckets/catalog-08').then(({ default: bucket }) => bucket),
  "catalog-09": () => import('./buckets/catalog-09').then(({ default: bucket }) => bucket),
  "catalog-0a": () => import('./buckets/catalog-0a').then(({ default: bucket }) => bucket),
  "catalog-0b": () => import('./buckets/catalog-0b').then(({ default: bucket }) => bucket),
  "catalog-0c": () => import('./buckets/catalog-0c').then(({ default: bucket }) => bucket),
  "catalog-0d": () => import('./buckets/catalog-0d').then(({ default: bucket }) => bucket),
  "catalog-0e": () => import('./buckets/catalog-0e').then(({ default: bucket }) => bucket),
  "catalog-0f": () => import('./buckets/catalog-0f').then(({ default: bucket }) => bucket),
  "catalog-10": () => import('./buckets/catalog-10').then(({ default: bucket }) => bucket),
  "catalog-11": () => import('./buckets/catalog-11').then(({ default: bucket }) => bucket),
  "catalog-12": () => import('./buckets/catalog-12').then(({ default: bucket }) => bucket),
  "catalog-13": () => import('./buckets/catalog-13').then(({ default: bucket }) => bucket),
  "catalog-14": () => import('./buckets/catalog-14').then(({ default: bucket }) => bucket),
  "catalog-15": () => import('./buckets/catalog-15').then(({ default: bucket }) => bucket),
  "catalog-16": () => import('./buckets/catalog-16').then(({ default: bucket }) => bucket),
  "catalog-17": () => import('./buckets/catalog-17').then(({ default: bucket }) => bucket),
  "catalog-18": () => import('./buckets/catalog-18').then(({ default: bucket }) => bucket),
  "catalog-19": () => import('./buckets/catalog-19').then(({ default: bucket }) => bucket),
  "catalog-1a": () => import('./buckets/catalog-1a').then(({ default: bucket }) => bucket),
  "catalog-1b": () => import('./buckets/catalog-1b').then(({ default: bucket }) => bucket),
  "catalog-1c": () => import('./buckets/catalog-1c').then(({ default: bucket }) => bucket),
  "catalog-1d": () => import('./buckets/catalog-1d').then(({ default: bucket }) => bucket),
  "catalog-1e": () => import('./buckets/catalog-1e').then(({ default: bucket }) => bucket),
  "catalog-1f": () => import('./buckets/catalog-1f').then(({ default: bucket }) => bucket),
};

export default bucketLoaders;
