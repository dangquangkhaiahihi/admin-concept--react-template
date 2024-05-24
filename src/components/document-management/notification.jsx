import React, { useState, useEffect } from "react";

export default function Notification(message) {
  const txt = message || "";
  const [text, setText] = useState("");

  useEffect(() => {
    setText(txt);
    // setTimeout(() => {
    //   setText("");
    // }, 5000);
  }, [txt]);

  if (!text) return null;

  return (
    <div className="dx-filemanager-notification-container dx-widget">
      <div className="dx-filemanager-notification-popup dx-overlay dx-popup dx-widget dx-visibility-change-handler">
        <div
          className="dx-overlay-content dx-popup-normal dx-resizable dx-popup-inherit-height"
          style={{
            width: "auto",
            height: "auto",
            zIndex: 1502,
            margin: "0px",
            left: "0px",
            top: "0px",
            transform: "translate(5569px, 5044px)",
            transition: "all 0s ease 0s",
          }}
          tabIndex={0}
          aria-hidden="true"
        >
          <div
            className="dx-popup-content"
            style={{ height: "auto", maxHeight: "none", minHeight: "0px" }}
          >
            {text}
          </div>
        </div>
      </div>
    </div>
  );
}
