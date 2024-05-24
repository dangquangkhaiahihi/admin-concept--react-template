import React from "react";
import { useMediaQuery } from "react-responsive";
import LayoutView from "./layout.view";
import HomePage from "../../modules/home/home.view.jsx";

const LayoutViewWithHook = (props) => {
  //media query
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });
  const isBigScreen = useMediaQuery({ query: "(min-width: 1824px)" });
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });
  const isRetina = useMediaQuery({ query: "(min-resolution: 2dppx)" });

  const reactMediaQuery = {
    isDesktopOrLaptop:isDesktopOrLaptop,
    isBigScreen:isBigScreen,
    isTabletOrMobile:isTabletOrMobile,
    isPortrait:isPortrait,
    isRetina:isRetina
  }

  return <>
  {
    props.isHome ? <HomePage reactMediaQuery={reactMediaQuery}/> :
    <LayoutView reactMediaQuery={reactMediaQuery} title={props.title}>
      {props.children}
    </LayoutView>
  }
  
  </>
};
export default LayoutViewWithHook;