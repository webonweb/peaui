/** @jsxImportSource react */

import { type ReactIconData } from '.././generated-icon-data';
import legacyIconBucketLoaders from '../../assets/icons/runtime/bucket-loaders';
import { iconNames as legacyIconNames } from '../../assets/icons/runtime/bucket-loaders';
import { useState, useEffect, type ReactElement } from 'react';
import { renderSvgMarkup, type SvgMarkupProps } from './svg-markup.renderer';

export const CATALOG_ICON_NAME_PATTERN = /^[a-z][a-z0-9-]*\/[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const reactCatalogIconCache = new Map<string, ReactIconData>();

export const reactCatalogIconRequests = new Map<string, Promise<ReactIconData | undefined>>();

export const reactCatalogIconMisses = new Set<string>();

export function parseLegacySvgIcon(source: string | undefined): ReactIconData | undefined {
  if (!source) return undefined;

  const root = source.match(/<svg\b([^>]*)>/i)?.[1] ?? '';
  const readAttribute = (attribute: string): string | undefined =>
    root.match(new RegExp(`(?:^|\\s)${attribute}=["']([^"']+)["']`, 'i'))?.[1];
  const body = source.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i)?.[1]?.trim();

  if (!body) return undefined;

  return {
    body,
    fill: readAttribute('fill'),
    stroke: readAttribute('stroke'),
    strokeLinecap: readAttribute('stroke-linecap') as ReactIconData['strokeLinecap'],
    strokeLinejoin: readAttribute('stroke-linejoin') as ReactIconData['strokeLinejoin'],
    strokeWidth: readAttribute('stroke-width'),
    viewBox: readAttribute('viewBox') ?? '0 0 24 24',
  };
}

export function loadReactIcon(name: string): Promise<ReactIconData | undefined> {
  const cached = reactCatalogIconCache.get(name);

  if (cached) return Promise.resolve(cached);
  if (reactCatalogIconMisses.has(name)) return Promise.resolve(undefined);

  const activeRequest = reactCatalogIconRequests.get(name);

  if (activeRequest) return activeRequest;

  // Both bucket maps stay behind dynamic imports. Catalog icons use 32 stable
  // hash buckets to avoid publishing hundreds of tiny runtime files.
  const loader = CATALOG_ICON_NAME_PATTERN.test(name)
    ? import('../../assets/icons/runtime/catalog/load-icon').then(({ loadCatalogIcon }) =>
        loadCatalogIcon(name),
      )
    : Promise.resolve().then(async () => {
        if (!legacyIconNames.has(name)) return undefined;
        const bucketName = name
          .replace(/[^a-z0-9]/gi, '')
          .slice(0, 2)
          .toLowerCase();
        const bucket = await legacyIconBucketLoaders[bucketName]?.();
        return parseLegacySvgIcon(bucket?.[name]);
      });
  const request = loader
    .then((icon) => {
      if (icon) reactCatalogIconCache.set(name, icon);
      else reactCatalogIconMisses.add(name);

      return icon;
    })
    .catch(() => undefined)
    .finally(() => {
      reactCatalogIconRequests.delete(name);
    });

  reactCatalogIconRequests.set(name, request);

  return request;
}

export function useReactIcon(
  name: string,
  bundledIcon?: ReactIconData,
): {
  icon?: ReactIconData;
  supported: boolean;
} {
  const isLoadableIcon = CATALOG_ICON_NAME_PATTERN.test(name) || legacyIconNames.has(name);
  const cachedIcon = reactCatalogIconCache.get(name);
  const knownMissing = reactCatalogIconMisses.has(name);
  const [loadedIcon, setLoadedIcon] = useState<{
    icon?: ReactIconData;
    name: string;
    settled: boolean;
  }>(() => ({ icon: cachedIcon, name, settled: cachedIcon !== undefined }));

  useEffect(() => {
    if (bundledIcon || !isLoadableIcon || cachedIcon || knownMissing) return;

    let active = true;

    void loadReactIcon(name).then((icon) => {
      if (active) setLoadedIcon({ icon, name, settled: true });
    });

    return () => {
      active = false;
    };
  }, [bundledIcon, cachedIcon, isLoadableIcon, knownMissing, name]);

  const resolvedLoadedIcon = loadedIcon.name === name ? loadedIcon.icon : undefined;
  const settledWithoutIcon =
    loadedIcon.name === name && loadedIcon.settled && loadedIcon.icon === undefined;

  return {
    icon: bundledIcon ?? cachedIcon ?? resolvedLoadedIcon,
    supported: Boolean(bundledIcon || (isLoadableIcon && !knownMissing && !settledWithoutIcon)),
  };
}

export function Svg({
  name,
  data,
  ...props
}: SvgMarkupProps & { name: string }): ReactElement | null {
  const { icon, supported } = useReactIcon(name, data);
  return supported ? renderSvgMarkup({ ...props, data: icon }) : null;
}
