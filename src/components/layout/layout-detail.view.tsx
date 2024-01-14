import React from "react";
import "./layout.scss";
import TopBar from "../topbar/topbar.view.jsx";
import Footer from "../footer/footer.view.jsx";
import LoadingScreen from "../loading-with-queue/loading-with-queue";

export default class LayoutDetailView extends React.Component<any> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div id="wrapper">
        <LoadingScreen />
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            <TopBar />
            <div className="container-fluid" style={{minHeight: '80vh'}}>{this.props.children}</div>
          </div>

          <Footer />
        </div>
      </div>
    );
  }
}
