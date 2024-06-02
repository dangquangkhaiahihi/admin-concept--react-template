import React, { useEffect, useRef } from 'react';

export default function ModalConfirm(props) {
    const { open, onClose, onConfirm, title, prompt, id } = props;

  const buttonCloseRef = useRef(null);
    const onCloseModal = () => {
        onClose();
    //buttonCloseRef.current.click();
  }
    const onConfirmModal = () => {
        onConfirm();
        onClose();
    //buttonCloseRef.current.click();
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
      id={`modalConfirm-${id}`}
      data-backdrop="static"
    >
      <div className="modal-dialog modal-dialog-centered" role="document" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="modalConfirmLabel">
                {title}
            </h5>
            <button type="button" className="close" 
     //        data-dismiss="modal"
            aria-label="Close" onClick={onClose}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
                <div dangerouslySetInnerHTML={{ __html: prompt }}/>
            </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary"
              onClick={onConfirmModal}
       //        data-dismiss="modal"
            >
              Có
            </button>
            <button
              ref={buttonCloseRef}
              type="button"
              className="btn btn-secondary"
       //        data-dismiss="modal"
              onClick={onCloseModal}
            >
              Không
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}