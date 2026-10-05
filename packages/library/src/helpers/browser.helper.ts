const scrollLocks = new WeakMap<Document, Map<string, number>>();

export function prefersReducedMotion(windowReference?: Window): boolean {
  const target = windowReference ?? (typeof window === 'undefined' ? undefined : window);
  return Boolean(
    target &&
    typeof target.matchMedia === 'function' &&
    target.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
}

export function acquireDocumentScrollLock(
  className: string,
  documentReference?: Document,
): () => void {
  const target = documentReference ?? (typeof document === 'undefined' ? undefined : document);
  if (!target) return () => undefined;

  const locks = scrollLocks.get(target) ?? new Map<string, number>();
  locks.set(className, (locks.get(className) ?? 0) + 1);
  scrollLocks.set(target, locks);
  target.documentElement.classList.add(className);
  target.body.classList.add(className);
  let released = false;

  return () => {
    if (released) return;
    released = true;
    const remaining = Math.max(0, (locks.get(className) ?? 1) - 1);
    if (remaining > 0) {
      locks.set(className, remaining);
      return;
    }
    locks.delete(className);
    target.documentElement.classList.remove(className);
    target.body.classList.remove(className);
  };
}
