import { useEffect, useRef, type RefObject } from "react";

export function useOutsideClick(
  refs: RefObject<Element | null>[],
  onClose: () => void,
  enabled: boolean
) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!enabled) return;
    const handler = (e: MouseEvent) => {
      if (refs.every((r) => !r.current?.contains(e.target as Node))) {
        onCloseRef.current();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
    // refs intentionally omitted: RefObject identity is stable, .current is read at event time
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);
}
