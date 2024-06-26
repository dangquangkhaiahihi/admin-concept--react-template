import React, { cloneElement, useRef, useState } from 'react';

export default function ModalConfirmCreateCuisine(props) {
    const { open, onClose, onConfirm, title, prompt, assignDelivery } = props;

  const buttonCloseRef = useRef(null);
    const onCloseModal = () => {
        assignDelivery && assignDelivery(false);
        onClose();
    //buttonCloseRef.current.click();
  }
    const onConfirmModal = () => {
        assignDelivery && assignDelivery(true);
        onConfirm();
        onClose();
    //buttonCloseRef.current.click();
  }
  
  return (
    <div
      className={`modal fade ${open ? 'show' : ''}`}
      style={{ display: open ? 'block' : 'none' }}
      data-backdrop="static"
      tabIndex="-1"
      role="dialog"
      id="modalConfirmCreateCuisine" aria-labelledby="modalConfirmCreateCuisineLabel" aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered" role="document" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="modalConfirmCreateCuisineLabel">
                {title}
            </h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={onClose}>
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
              data-dismiss="modal"
            >
              Có
            </button>
            <button
              ref={buttonCloseRef}
              type="button"
              className="btn btn-secondary"
              data-dismiss="modal"
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