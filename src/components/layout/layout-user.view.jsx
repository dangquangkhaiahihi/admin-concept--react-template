import React from "react";
import "./layout.scss";
import LoadingScreen from '../loading-with-queue/loading-with-queue';
export default class LayoutUserView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bodyWebStyle: null,
    };
  }

  render() {
    return (
      <div className="layout-user-container">
        <LoadingScreen />
        <div>{this.props.children}</div>
      </div>
    );
  }
}
