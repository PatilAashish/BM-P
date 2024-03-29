import { useCallback, useEffect } from 'react';

export default function useEscapeKey(handleClose: () => void) {
  const KEY_NAME_ESC = 'Escape';
  const KEY_EVENT_TYPE = 'keyup';
  const handleEscKey = useCallback(
    (event: any) => {
      if (event.key === KEY_NAME_ESC) {
        handleClose();
      }
    },
    [handleClose]
  );
  useEffect(() => {
    document.addEventListener(KEY_EVENT_TYPE, handleEscKey, false);
    return () => {
      document.removeEventListener(KEY_EVENT_TYPE, handleEscKey, false);
    };
  }, [handleEscKey]);
}
