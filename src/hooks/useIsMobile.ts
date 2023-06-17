import { useState } from 'react';
import { isMobile as isMobileDevice } from 'react-device-detect';
import { useEffectOnce } from 'react-use';

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  useEffectOnce(() => {
    setIsMobile(isMobileDevice);
  });

  return { isMobile };
}
