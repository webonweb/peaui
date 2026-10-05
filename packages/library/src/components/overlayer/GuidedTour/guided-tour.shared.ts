export type GuidedTourPlacement = 'auto' | 'top' | 'right' | 'bottom' | 'left';
export type GuidedTourMode = 'spotlight' | 'modal';
export type GuidedTourCardVariant = 'card' | 'tooltip';
export type GuidedTourMissingTargetStrategy = 'skip' | 'block' | 'close';
export type GuidedTourScrollBehavior = 'auto' | 'smooth';
export type GuidedTourTransitionReason =
  'start' | 'next' | 'back' | 'skip' | 'complete' | 'external';
export type GuidedTourMaybePromise<T> = T | Promise<T>;
export type GuidedTourTargetResult = HTMLElement | null | undefined;
export type GuidedTourTargetResolver = () => GuidedTourMaybePromise<GuidedTourTargetResult>;
export type GuidedTourTarget = string | HTMLElement | GuidedTourTargetResolver;

export type GuidedTourLifecycleContext = {
  step: GuidedTourStep;
  index: number;
  target: HTMLElement | null;
};

export type GuidedTourGuard = (
  context: GuidedTourLifecycleContext,
) => GuidedTourMaybePromise<boolean>;
export type GuidedTourLifecycleHook = (
  context: GuidedTourLifecycleContext,
) => GuidedTourMaybePromise<void>;

export type GuidedTourStep = {
  id: string;
  target?: GuidedTourTarget;
  title?: string;
  description?: string;
  placement?: GuidedTourPlacement;
  optional?: boolean;
  canAdvance?: boolean | GuidedTourGuard;
  beforeEnter?: GuidedTourLifecycleHook;
  afterLeave?: GuidedTourLifecycleHook;
};

export type GuidedTourLabels = {
  back: string;
  next: string;
  skip: string;
  complete: string;
  close: string;
  pending: string;
  resolving: string;
  missingTarget: string;
  blocked: string;
  step: (current: number, total: number) => string;
};

export type GuidedTourPersistState = {
  open: boolean;
  step: number;
  stepId?: string;
  reason: GuidedTourTransitionReason;
};

export type GuidedTourProps = {
  steps: GuidedTourStep[];
  open?: boolean;
  step?: number;
  mode?: GuidedTourMode;
  cardVariant?: GuidedTourCardVariant;
  linear?: boolean;
  showMask?: boolean;
  allowSkip?: boolean;
  closeOnEscape?: boolean;
  scrollBehavior?: GuidedTourScrollBehavior;
  targetTimeout?: number;
  missingTargetStrategy?: GuidedTourMissingTargetStrategy;
  spotlightPadding?: number;
  pending?: boolean;
  labels?: Partial<GuidedTourLabels>;
  persist?: (state: GuidedTourPersistState) => GuidedTourMaybePromise<void>;
  ariaLabel?: string;
  dataTestId?: string;
};

export type GuidedTourStepPayload = GuidedTourLifecycleContext & {
  reason?: GuidedTourTransitionReason;
};

export type GuidedTourTargetMissingPayload = {
  step: GuidedTourStep;
  index: number;
};

export type GuidedTourErrorPayload = {
  error: unknown;
  phase: 'resolve' | 'beforeEnter' | 'afterLeave' | 'guard' | 'persist';
  step?: GuidedTourStep;
  index: number;
};

export type GuidedTourRect = {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
};

export type GuidedTourPosition = {
  top: number;
  left: number;
  placement: Exclude<GuidedTourPlacement, 'auto'>;
};

export type ResolveGuidedTourTargetOptions = {
  timeout?: number;
  interval?: number;
  root?: Document | ShadowRoot;
  isCancelled?: () => boolean;
};

const wait = (duration: number): Promise<void> =>
  new Promise((resolve) => globalThis.setTimeout(resolve, duration));

function isHTMLElement(value: unknown): value is HTMLElement {
  return (
    typeof value === 'object' &&
    value !== null &&
    'getBoundingClientRect' in value &&
    typeof (value as HTMLElement).getBoundingClientRect === 'function'
  );
}

async function resolveTargetOnce(
  target: GuidedTourTarget | undefined,
  root: Document | ShadowRoot,
): Promise<HTMLElement | null> {
  if (target === undefined) return null;
  if (typeof target === 'string') return root.querySelector<HTMLElement>(target);
  const candidate = typeof target === 'function' ? await target() : target;
  return isHTMLElement(candidate) ? candidate : null;
}

export async function resolveGuidedTourTarget(
  target: GuidedTourTarget | undefined,
  options: ResolveGuidedTourTargetOptions = {},
): Promise<HTMLElement | null> {
  if (typeof document === 'undefined') return null;

  const timeout = Math.max(0, options.timeout ?? 2000);
  const interval = Math.max(10, options.interval ?? 50);
  const root = options.root ?? document;
  const startedAt = Date.now();

  do {
    if (options.isCancelled?.() === true) return null;
    const targetElement = await resolveTargetOnce(target, root);
    if (targetElement && targetElement.isConnected !== false) return targetElement;
    if (Date.now() - startedAt >= timeout) break;
    await wait(Math.min(interval, Math.max(0, timeout - (Date.now() - startedAt))));
  } while (options.isCancelled?.() !== true);

  return null;
}

export function expandGuidedTourRect(
  rect: GuidedTourRect,
  padding: number,
  viewportWidth: number,
  viewportHeight: number,
): GuidedTourRect {
  const safePadding = Math.max(0, padding);
  const left = Math.max(0, rect.left - safePadding);
  const top = Math.max(0, rect.top - safePadding);
  const right = Math.min(viewportWidth, rect.right + safePadding);
  const bottom = Math.min(viewportHeight, rect.bottom + safePadding);
  return { top, right, bottom, left, width: right - left, height: bottom - top };
}

function oppositePlacement(
  placement: Exclude<GuidedTourPlacement, 'auto'>,
): Exclude<GuidedTourPlacement, 'auto'> {
  if (placement === 'top') return 'bottom';
  if (placement === 'bottom') return 'top';
  if (placement === 'left') return 'right';
  return 'left';
}

function placementOrder(
  preferred: GuidedTourPlacement,
  target: GuidedTourRect,
  viewportWidth: number,
  viewportHeight: number,
): Exclude<GuidedTourPlacement, 'auto'>[] {
  const available: Record<Exclude<GuidedTourPlacement, 'auto'>, number> = {
    top: target.top,
    right: viewportWidth - target.right,
    bottom: viewportHeight - target.bottom,
    left: target.left,
  };

  if (preferred === 'auto') {
    return (Object.keys(available) as Exclude<GuidedTourPlacement, 'auto'>[]).sort(
      (first, second) => available[second] - available[first],
    );
  }

  const choices: Exclude<GuidedTourPlacement, 'auto'>[] = [
    preferred,
    oppositePlacement(preferred),
    'bottom',
    'top',
    'right',
    'left',
  ];
  return choices.filter((placement, index) => choices.indexOf(placement) === index);
}

export function calculateGuidedTourPosition(
  target: GuidedTourRect,
  card: Pick<GuidedTourRect, 'width' | 'height'>,
  preferred: GuidedTourPlacement,
  viewportWidth: number,
  viewportHeight: number,
  gap = 12,
  margin = 16,
  align: 'start' | 'center' | 'end' = 'center',
): GuidedTourPosition {
  const width = Math.min(card.width, Math.max(0, viewportWidth - margin * 2));
  const height = Math.min(card.height, Math.max(0, viewportHeight - margin * 2));
  const candidates = placementOrder(preferred, target, viewportWidth, viewportHeight);
  let requestedLeft = target.left + (target.width - width) / 2;
  if (align === 'start') requestedLeft = target.left;
  else if (align === 'end') requestedLeft = target.right - width;
  const alignedLeft =
    align === 'center'
      ? requestedLeft
      : Math.min(Math.max(requestedLeft, margin), Math.max(margin, viewportWidth - width - margin));
  const coordinates = (placement: Exclude<GuidedTourPlacement, 'auto'>) => {
    if (placement === 'top') {
      return { top: target.top - height - gap, left: alignedLeft };
    }
    if (placement === 'bottom') {
      return { top: target.bottom + gap, left: alignedLeft };
    }
    if (placement === 'left') {
      return { top: target.top + (target.height - height) / 2, left: target.left - width - gap };
    }
    return { top: target.top + (target.height - height) / 2, left: target.right + gap };
  };
  const fits = ({ top, left }: { top: number; left: number }) =>
    top >= margin &&
    left >= margin &&
    top + height <= viewportHeight - margin &&
    left + width <= viewportWidth - margin;
  const placement =
    candidates.find((candidate) => fits(coordinates(candidate))) ?? candidates[0] ?? 'bottom';
  const position = coordinates(placement);
  return {
    placement,
    top: Math.min(
      Math.max(position.top, margin),
      Math.max(margin, viewportHeight - height - margin),
    ),
    left: Math.min(
      Math.max(position.left, margin),
      Math.max(margin, viewportWidth - width - margin),
    ),
  };
}
