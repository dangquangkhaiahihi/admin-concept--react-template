import React, { cloneElement, useEffect, useRef, useState } from 'react';

export default function ModalCustom(props) {
  const { id = "", open, onClose, children, title, customClassname } = props;

  const [triggerSubmit, setTriggerSubmit] = useState(false);

  const buttonCloseRef = useRef(null);
  const onCloseModal = () => {
    onClose();
    buttonCloseRef.current.click();
  }
  
  useEffect(() => {
    const handleBackdrop = () => {
      if (open) {
        // Create and show the backdrop
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop fade show';
        backdrop.id = `modal-backdrop-${id}`;
        document.body.appendChild(backdrop);
      } else {
        // Remove the backdrop
        const backdrop = document.getElementById(`modal-backdrop-${id}`);
        if (backdrop) {
          document.body.removeChild(backdrop);
        }
      }
    };

    handleBackdrop();

    return () => {
      // Clean up the backdrop when the component is unmounted
      const backdrop = document.getElementById(`modal-backdrop-${id}`);
      if (backdrop) {
        document.body.removeChild(backdrop);
      }
    };
  }, [id, open]);

  return (
    <div
      className={`modal fade ${open ? 'show d-block' : 'd-none'}`}
      id={`modalCustom-${id}`}
      data-backdrop="static"
    >
      <div className={`modal-dialog modal-lg modal-dialog-centered ${customClassname ? customClassname : ''}`} role="document" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id={`modalCustomLabel-${id}`}>
                {title}
            </h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={onClose}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
                {open && children && cloneElement(children, 
                  { ...props,
                    triggerSubmit: triggerSubmit,
                    setTriggerSubmit: setTriggerSubmit,
                    onCloseModal: onCloseModal
                  })
                }
            </div>
          <div className="modal-footer">
            <button
              ref={buttonCloseRef}
              type="button"
              className="btn btn-secondary"
       //        data-dismiss="modal"
              onClick={onCloseModal}
            >
              Đóng
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setTriggerSubmit(true)}
            >
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}