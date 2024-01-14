import React from "react";
import "./page-title.scss";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { bindActionCreators } from "redux";
import * as appActions from "../../core/app.store";
import { connect } from "react-redux";

function PageTitle(props) {
  const { expandSidebar, collapseSidebar, isCollapsed, setToggle, title,reactMediaQuery } = props;

  return (
    <div className="sticky">
      <div className="page-title">
        <span>{title}</span>
      </div>
      {!reactMediaQuery?.isTabletOrMobile ? (

        <div className={"toggleContent" + (isCollapsed ? " toggled" : "")}>
          <button
            className={"rounded-circle border-0" + (isCollapsed ? " d-none" : "")}
            id="sidebarToggle"
            onClick={() => {
              collapseSidebar();
              setToggle();
            }}
          >
            <ChevronLeftIcon fontSize="small" className="text-white" />
          </button>
          <button
            className={"rounded-circle border-0" + (!isCollapsed ? " d-none" : "")}
            id="sidebarToggle"
            onClick={() => {
              expandSidebar();
              setToggle();
            }}
          >
            <ChevronRightIcon fontSize="small" className="text-white" />
          </button>
        </div>
      ) : null}
    </div>
  );
}

const mapStateToProps = (state) => ({
  isCollapsed: state.app.isCollapsed,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      expandSidebar: appActions.ExpandSidebar,
      collapseSidebar: appActions.CollapseSidebar,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(PageTitle);
