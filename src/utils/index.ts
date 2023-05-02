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

export function convertScrollPercent(params?: { fromPercent: number }) {
  const { fromPercent } = params ?? {};

  const scrollTopOffset = document.body.scrollHeight - window.innerHeight;
  if (fromPercent !== undefined) {
    const toScrollY = scrollTopOffset * (fromPercent / 100);
    return Math.round(toScrollY);
  }

  const scrollPercent = window.scrollY / scrollTopOffset;
  return Math.round(scrollPercent * 100);
}
