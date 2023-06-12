/* `require` is used because `nanoid-good` apparently doesn't have TypeScript definitions... */

/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-unsafe-call */
export const nanoid: (length?: number) => string = require('nanoid-good').nanoid(
  require('nanoid-good/locale/en')
);
