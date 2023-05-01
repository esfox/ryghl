export function debounce(fn: (...args: []) => unknown, ms = 300) {
  let timeoutId: ReturnType<typeof setTimeout>;

  const debounced = (...args: []) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), ms);
  };

  return debounced;
}
