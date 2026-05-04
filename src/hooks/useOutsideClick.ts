import { useEffect, type RefObject } from "react";

export function useOutsideClick(
  refs: RefObject<Element | null>[],
  onClose: () => void,
  enabled: boolean
) {
  useEffect(() => {
    if (!enabled) return;
    const handler = (e: MouseEvent) => {
      if (refs.every((r) => !r.current?.contains(e.target as Node))) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [enabled, onClose, refs]);
}
