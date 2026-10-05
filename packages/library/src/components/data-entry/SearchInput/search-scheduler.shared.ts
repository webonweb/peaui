export function createSearchScheduler(
  emit: (phrase: string) => void,
  getDelay: () => number,
  isBlocked: () => boolean,
) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const cancel = (): void => {
    clearTimeout(timer);
    timer = undefined;
  };
  const search = (phrase: string): void => {
    cancel();
    if (!isBlocked() && phrase.length >= 3) emit(phrase);
  };
  const clear = (): void => {
    cancel();
    if (!isBlocked()) emit('');
  };
  const schedule = (phrase: string): void => {
    cancel();
    if (isBlocked() || (phrase !== '' && phrase.length < 3)) return;
    const delay = getDelay();
    timer = setTimeout(
      () => {
        timer = undefined;
        if (!isBlocked()) emit(phrase);
      },
      Number.isFinite(delay) ? Math.max(0, delay) : 1000,
    );
  };
  return { cancel, clear, schedule, search };
}
