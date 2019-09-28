import { useRef, useEffect } from 'react';

/**
 * @description
 * Determine if the component has been mounted yet
 *
 * @see https://stackoverflow.com/questions/53179075/with-useeffect-how-can-i-skip-applying-an-effect-upon-the-initial-render
 */
export const useIsMounted = () => {
  const isMountRef = useRef(false);
  useEffect(() => void (isMountRef.current = true), []);
  return isMountRef.current;
};