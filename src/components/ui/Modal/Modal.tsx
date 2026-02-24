import React, { ReactNode } from "react";

interface ModalProps extends React.HTMLAttributes<HTMLDivElement>  {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
    ({ open, onClose, children}, ref)=> {
  if (!open) return null;
  return (
    <div ref={ref} className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
});
Modal.displayName = "Modal";
export {Modal};