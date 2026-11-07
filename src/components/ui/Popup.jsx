import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const DURATION = 300; // must match duration-300 below

/**
 * Reusable responsive popup.
 *   < lg : bottom sheet that slides up from the bottom
 *   ≥ lg : centred dialog that fades and scales in
 * The body scrolls; `footer` stays pinned at the bottom.
 * Closes on Escape, backdrop click, the close button or the sheet handle.
 */
export default function Popup({ open, onClose, labelledBy, footer, children }) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Mount on open; on close, play the exit transition and then unmount
  useEffect(() => {
    if (open) {
      setMounted(true);
      return undefined;
    }
    setVisible(false);
    const t = setTimeout(() => setMounted(false), DURATION);
    return () => clearTimeout(t);
  }, [open]);

  // Start the enter transition two frames after mount so the browser sees the start state
  useEffect(() => {
    if (!mounted || !open) return undefined;
    let inner;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => {
        setVisible(true);
        dialogRef.current?.focus({ preventScroll: true });
      });
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [mounted, open]);

  // Lock page scroll, close on Escape, give focus back on close
  useEffect(() => {
    if (!open) return undefined;
    const prevOverflow = document.body.style.overflow;
    const prevFocus = document.activeElement;
    const onKey = (e) => e.key === "Escape" && onCloseRef.current();
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      prevFocus?.focus?.({ preventScroll: true });
    };
  }, [open]);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center lg:items-center lg:p-6">
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={`relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-[32px] bg-white shadow-[0_-15px_50px_rgba(0,0,0,0.18)] outline-none transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:max-h-[88vh] lg:max-w-4xl lg:rounded-[32px] lg:shadow-[0_25px_70px_-12px_rgba(13,30,16,0.28)] ${
          visible ? "translate-y-0 lg:scale-100 lg:opacity-100" : "translate-y-full lg:translate-y-4 lg:scale-95 lg:opacity-0"
        }`}
      >
        {/* Sheet handle (small/mid screens only) */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="flex shrink-0 justify-center bg-stone-50 pb-2 pt-3 lg:hidden"
        >
          <span className="h-1.5 w-12 rounded-full bg-stone-300" />
        </button>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-6 z-30 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-stone-200/60 bg-white/90 text-stone-700 shadow-md transition hover:scale-105 hover:bg-white active:scale-95 lg:top-4"
        >
          <X size={18} />
        </button>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>

        {footer && (
          <div className="shrink-0 border-t border-stone-200 bg-white px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 sm:px-7">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
