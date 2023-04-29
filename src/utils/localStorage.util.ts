export const localStorageUtil = {
  sessionToken: {
    key: 'sessionToken',
    get() {
      return localStorage.getItem(this.key);
    },
    set(value: string) {
      return localStorage.setItem(this.key, value);
    },
  },
};
