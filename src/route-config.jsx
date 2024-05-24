import React from "react";
import { Route } from "react-router-dom";
import ActivityDetector from "react-activity-detector";
import {
  getCookies,
  removeCookies,
  setIsShowDialogConfirmRefresh,
} from "./utils/configuration";

const RouterComponent = ({
  component: Component,
  layout: Layout,
  isSetActive = true,
  ...rest
}) => {
  const customActivityEvents = [      
  "click",
  "mousemove",
  "keydown",
  "DOMMouseScroll",
  "mousewheel",
  "mousedown",
  "touchstart",
  "touchmove",
  "focus",];

  const onIdle = () => { 
    if (getCookies("isLockScreen") != "true")
    {
      setIsShowDialogConfirmRefresh(true);
    }
  };

  const onActive = () => {
    if (getCookies("isShowDialog") === "false") {
      removeCookies("isShowDialog");
    }
  };

  return (
    <Route
      {...rest}
      render={(props) => (
        <>
          {isSetActive && (
            <ActivityDetector 
              activityEvents={customActivityEvents}
              enabled={true}
              timeout={5 * 60 * 1000}
              onIdle={onIdle}
              onActive={onActive}
            />
          )}
          <Layout>
            <Component {...props} />
          </Layout>
        </>
      )}
    />
  );
};

export default RouterComponent;
