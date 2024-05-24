import React from "react";
import notification from "./helpers/notification";
import { store } from "react-notifications-component";
import { NotificationMessageType } from "../../utils/configuration";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faExclamationCircle,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";

const ShowNotification = (message, type) => {
  if (message === undefined || message === null || message === "") return;

  let icon;
  if (type === NotificationMessageType.Success) {
    icon = faCheckCircle;
  } else if (type === NotificationMessageType.Warning) {
    icon = faExclamationCircle;
  } else if (type === NotificationMessageType.Error) {
    icon = faExclamationTriangle;
  }

  store.addNotification(
    Object.assign({}, notification, {
      container: "top-right",
      content: (
        <div className={`notification-custom-${type}`}>
          <div className="notification-custom-icon">
            <FontAwesomeIcon icon={icon} />
          </div>
          <div className="notification-custom-content">
            <p className="notification-message">{message}</p>
          </div>
        </div>
      ),
    })
  );
};

export default ShowNotification;
