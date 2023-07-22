/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
export function debounce(fn: (...args: any[]) => unknown, ms = 300) {
  let timeoutId: ReturnType<typeof setTimeout>;

  const debounced = (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), ms);
  };

  return debounced;
}

export function collectLeafNodes({
  parentNode,
  excludedNodeNames,
}: {
  parentNode: HTMLElement;
  excludedNodeNames?: string[];
}) {
  const leaves = new Set<HTMLElement>();

  function collect(parent: HTMLElement) {
    const { children } = parent;
    if (children.length === 0) {
      leaves.add(parent);
    }

    for (let i = 0; i < children.length; i += 1) {
      const child = children[i] as HTMLElement;
      if (excludedNodeNames?.includes(child.nodeName)) {
        leaves.add(parent);
      } else {
        collect(child);
      }
    }
  }

  collect(parentNode);
  return Array.from(leaves);
}
