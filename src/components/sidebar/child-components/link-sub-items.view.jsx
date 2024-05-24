import React from "react";
import { Link, useLocation } from "react-router-dom";

function LinkSubMenu(props) {
  const IconReactNode = props.icon;
  const currentLocation = useLocation();
  const isActive = currentLocation.pathname === props.pageLink;
  return (
    <Link className={`collapse-item ${isActive && "sub-link-adminstrator-active"}`} to={props.pageLink}>
      {props.icon && <IconReactNode fontSize="small" className="mr-2 mt-n1" />}
      <span>{props.title}</span>
    </Link>
  );
}

export default LinkSubMenu;
