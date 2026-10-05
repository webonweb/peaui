/** Forward ordinary light-DOM attributes without duplicating the public host ID. */
export function forwardNativeAttributes(
  host: HTMLElement,
  root: HTMLElement,
  componentAttributes: readonly string[],
): void {
  for (const attribute of Array.from(root.attributes)) root.removeAttribute(attribute.name);
  for (const attribute of Array.from(host.attributes)) {
    if (attribute.name === 'id' || componentAttributes.includes(attribute.name)) continue;
    root.setAttribute(attribute.name, attribute.value);
  }
}

export function observeNativeAttributes(
  host: HTMLElement,
  render: () => void,
  componentAttributes: readonly string[],
): () => void {
  const observer = new MutationObserver((records) => {
    if (
      records.some(
        (record) =>
          record.attributeName !== null && !componentAttributes.includes(record.attributeName),
      )
    )
      render();
  });
  observer.observe(host, { attributes: true });
  return () => observer.disconnect();
}
