import React, { cloneElement, useRef, useState } from 'react';

export default function ModalSubmitForm(props) {
  const { open, onClose, children, title, customClassname } = props;

  const [triggerSubmit, setTriggerSubmit] = useState(false);

  const buttonCloseRef = useRef(null);
  const onCloseModal = () => {
    onClose();
    buttonCloseRef.current.click();
  }
  
  return (
    <div
      className={`modal fade ${open ? 'show' : ''}`}
      style={{ display: open ? 'block' : 'none' }}
      tabIndex="-1"
      role="dialog" data-backdrop="static" data-keyboard="false"
      id="modalSubmitForm" aria-labelledby="modalSubmitFormLabel" aria-hidden="true"
    >
      <div className={`modal-dialog modal-lg modal-dialog-centered ${customClassname ? customClassname : ''}`} role="document" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="modalSubmitFormLabel">
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
              data-dismiss="modal"
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