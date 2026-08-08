// Ten plik jest generowany przez scripts/sync-icon-catalog.mjs.
export type IconBucket = Readonly<Record<string, string>>;
export type IconBucketLoader = () => Promise<IconBucket>;

const bucketLoaders: Readonly<Record<string, IconBucketLoader>> = {
  "ar": () => import('./buckets/ar').then(({ default: bucket }) => bucket),
  "ba": () => import('./buckets/ba').then(({ default: bucket }) => bucket),
  "ca": () => import('./buckets/ca').then(({ default: bucket }) => bucket),
  "ch": () => import('./buckets/ch').then(({ default: bucket }) => bucket),
  "cl": () => import('./buckets/cl').then(({ default: bucket }) => bucket),
  "co": () => import('./buckets/co').then(({ default: bucket }) => bucket),
  "cr": () => import('./buckets/cr').then(({ default: bucket }) => bucket),
  "da": () => import('./buckets/da').then(({ default: bucket }) => bucket),
  "do": () => import('./buckets/do').then(({ default: bucket }) => bucket),
  "ed": () => import('./buckets/ed').then(({ default: bucket }) => bucket),
  "en": () => import('./buckets/en').then(({ default: bucket }) => bucket),
  "ex": () => import('./buckets/ex').then(({ default: bucket }) => bucket),
  "ey": () => import('./buckets/ey').then(({ default: bucket }) => bucket),
  "fi": () => import('./buckets/fi').then(({ default: bucket }) => bucket),
  "fo": () => import('./buckets/fo').then(({ default: bucket }) => bucket),
  "he": () => import('./buckets/he').then(({ default: bucket }) => bucket),
  "hi": () => import('./buckets/hi').then(({ default: bucket }) => bucket),
  "im": () => import('./buckets/im').then(({ default: bucket }) => bucket),
  "lo": () => import('./buckets/lo').then(({ default: bucket }) => bucket),
  "pi": () => import('./buckets/pi').then(({ default: bucket }) => bucket),
  "pl": () => import('./buckets/pl').then(({ default: bucket }) => bucket),
  "pr": () => import('./buckets/pr').then(({ default: bucket }) => bucket),
  "re": () => import('./buckets/re').then(({ default: bucket }) => bucket),
  "sc": () => import('./buckets/sc').then(({ default: bucket }) => bucket),
  "se": () => import('./buckets/se').then(({ default: bucket }) => bucket),
  "so": () => import('./buckets/so').then(({ default: bucket }) => bucket),
  "tr": () => import('./buckets/tr').then(({ default: bucket }) => bucket),
  "un": () => import('./buckets/un').then(({ default: bucket }) => bucket),
  "us": () => import('./buckets/us').then(({ default: bucket }) => bucket),
};

export const iconNames: ReadonlySet<string> = new Set(["arrow","arrowRight","arrowRounded","bag","calculator","calendar","check","checkCircle","clock","close","code-branch","cogs","compressArrows","copy","cross","dark","dots","doubleArrowRounded","download","edit","edit2","envelope","expandArrows","eye","file-search","file","fileDownload","filters","font","help","hint","imageUpload","lock-closed","lock-open","lock","picture","plug","plus","progressFinish","redo","screen","search","sort","trash","trial","trialCurve","undo","univercity","users-alt","users"]);

export default bucketLoaders;
