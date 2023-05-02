export function debounce(fn: (...args: []) => unknown, ms = 300) {
  let timeoutId: ReturnType<typeof setTimeout>;

  const debounced = (...args: []) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), ms);
  };

  return debounced;
}

export function convertScrollPercent(params?: { fromPercent: number }) {
  const { fromPercent } = params ?? {};

  const scrollTopOffset = document.body.scrollHeight - window.innerHeight;
  if (fromPercent) {
    const toScrollY = scrollTopOffset * (fromPercent / 100);
    return Math.round(toScrollY);
  }

  const scrollPercent = window.scrollY / scrollTopOffset;
  return Math.round(scrollPercent * 100);
}
