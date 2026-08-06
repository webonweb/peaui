const avatarIllustration = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
    <defs>
      <linearGradient id="background" x1="18" y1="8" x2="112" y2="124" gradientUnits="userSpaceOnUse">
        <stop stop-color="#f5f2ec" />
        <stop offset="1" stop-color="#ddd8cf" />
      </linearGradient>
      <linearGradient id="clothing" x1="42" y1="83" x2="92" y2="126" gradientUnits="userSpaceOnUse">
        <stop stop-color="#60766b" />
        <stop offset="1" stop-color="#354b42" />
      </linearGradient>
    </defs>
    <rect width="128" height="128" fill="url(#background)" />
    <path d="M24 128c2-28 17-43 40-43s38 15 40 43H24Z" fill="url(#clothing)" />
    <path d="M54 74h20v20c-3 5-17 5-20 0V74Z" fill="#c98f6b" />
    <circle cx="64" cy="49" r="27" fill="#d9a27d" />
    <path d="M38 49c0-23 11-35 28-35 16 0 27 12 27 34-6-3-10-9-12-16-10 8-23 12-42 12l-1 5Z" fill="#4a3d36" />
    <path d="M43 51c2 18 10 29 21 29s20-11 22-29c-8-2-14-7-18-13-7 7-15 11-25 13Z" fill="#d9a27d" />
    <circle cx="54" cy="55" r="2" fill="#3f352f" />
    <circle cx="74" cy="55" r="2" fill="#3f352f" />
    <path d="M57 66c4 3 10 3 14 0" fill="none" stroke="#8b5541" stroke-linecap="round" stroke-width="2" />
  </svg>
`;

/** Wspólna grafika demonstracyjna używana w docsach i wszystkich Storybookach. */
export const avatarDemoImage = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  avatarIllustration.trim(),
)}`;

/** Wspólny stan bazowy pozwalający porównywać implementacje 1:1. */
export const avatarDemoProps = {
  alt: 'Portret Anny Kowalskiej',
  name: 'Anna Kowalska',
  size: 'l',
  src: avatarDemoImage,
  status: 'online',
  statusLabel: 'Dostępna',
} as const;
