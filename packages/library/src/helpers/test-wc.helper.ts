type WaitForDomConditionOptions = {
  errorMessage: string;
  timeoutMs?: number;
};

export async function waitForDomCondition(
  root: Node,
  condition: () => boolean,
  options: WaitForDomConditionOptions,
): Promise<void> {
  const { errorMessage, timeoutMs = 2000 } = options;

  if (condition()) {
    return;
  }

  await new Promise<void>((resolve, reject) => {
    let isSettled = false;

    const cleanup = (error?: Error) => {
      if (isSettled) {
        return;
      }

      isSettled = true;
      observer.disconnect();
      window.clearTimeout(timeoutId);

      if (error) {
        reject(error);
        return;
      }

      resolve();
    };

    const checkCondition = () => {
      if (condition()) {
        cleanup();
      }
    };

    const observer = new MutationObserver(() => {
      checkCondition();
    });

    observer.observe(root, {
      subtree: true,
      childList: true,
      attributes: true,
      characterData: true,
    });

    const timeoutId = window.setTimeout(() => {
      if (condition()) {
        cleanup();
        return;
      }

      cleanup(new Error(errorMessage));
    }, timeoutMs);

    checkCondition();
  });
}

export async function waitForSvgElement(
  root: Element,
  errorMessage = 'SVG did not render in time.',
): Promise<SVGSVGElement> {
  await waitForDomCondition(
    root,
    () => {
      const svg = root.querySelector('svg');

      return svg instanceof SVGSVGElement;
    },
    {
      errorMessage,
    },
  );

  const svgElement = root.querySelector('svg');

  if (!(svgElement instanceof SVGSVGElement)) {
    throw new Error(errorMessage);
  }

  return svgElement;
}
