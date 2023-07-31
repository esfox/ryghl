import { ReactNode, forwardRef } from 'react';

type ModalProps = {
  children: ReactNode;
};

export const Modal = forwardRef<HTMLDialogElement, ModalProps>(({ children }, ref) => (
  <dialog ref={ref} className="modal">
    <div className="modal-box">{children}</div>
  </dialog>
));

Modal.displayName = 'Modal';
