import { store } from "react-notifications-component";

const createNotificationObject = (
  type,
  message,
  title = null,
  isWarning = false
) => {
  if (!title) title = type.toUpperCase();

  if (isWarning) {
    return {
      id: "warning",
      message: message,
      type: type,
      insert: "top",
      container: "top-right",
      animationIn: ["animated", "fadeIn"],
      animationOut: ["animated", "fadeOut"],
      dismiss: {
        duration: 5000,
        onScreen: true,
      },
    };
  }

  return {
    // title: title,
    message: message,
    type: type,
    insert: "top",
    container: "top-right",
    animationIn: ["animated", "fadeIn"],
    animationOut: ["animated", "fadeOut"],
    dismiss: {
      duration: 3000,
      onScreen: true,
    },
  };
};

export default {
  success: (message, title = null) =>
    store.addNotification(createNotificationObject("success", message, title)),
  error: (message, title = null) =>
    store.addNotification(createNotificationObject("danger", message, title)),
  warning: (message, title = null) =>
    store.addNotification(
      createNotificationObject("warning", message, title, true)
    ),
};
