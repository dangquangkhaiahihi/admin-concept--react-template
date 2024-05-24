import React from "react";

export default class EditLayerSettingView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      is_check: this.props.data.is_check,
      layerName: this.props.data.name,
      maxZoom: this.props.data.maxZoom,
      minZoom: this.props.data.minZoom,
      zindex: this.props.data.zindex,
      year: this.props.data?.year,
      contentChange: this.props.data?.contentChange,
      isLayerRela: this.props?.isLayerRela,
    };
  }
  componentDidMount() {
    console.log(this.props)
  }
  componentWillUnmount() {
    if (!this.state.isLayerRela) {
      this.props.setData({
        ...this.props.data,
        is_check: this.state.is_check,
        isChecked: this.state.is_check,
        name: this.state.layerName,
        maxZoom: this.state.maxZoom,
        minZoom: this.state.minZoom,
        zindex: this.state.zindex,
        year: this.state?.year,
        contentChange: this.state?.contentChange,
      });
    } else {
      this.props.setData({
        ...this.props.data,
        is_check: this.state.is_check,
        isChecked: this.state.is_check,
        name: this.state.layerName,
        maxZoom: this.state.maxZoom,
        minZoom: this.state.minZoom,
        zindex: this.state.zindex,
        year: this.state?.year,
        contentChange: this.state?.contentChange,
      });
    }

  }

  render() {
    return (
      <div>
        <div className="form-group">
          <label for="layerNameInput">Tên layer</label>
          <input
            type="text"
            className="form-control"
            value={this.state.layerName}
            onChange={(event) => {
              this.setState({ layerName: event.target.value });
            }}
            id="layerNameInput"
            placeholder="Nhập tên layer"
          />
        </div>
        <div className="container-fluid m-0 p-0">
          <div className="row">
            <div className="col-lg-4">
              <div className="form-group">
                <label for="ZindexInput">Z index</label>
                <input
                  type="number"
                  className="form-control"
                  id="ZindexInput"
                  value={this.state.zindex}
                  onChange={(event) => {
                    this.setState({ zindex: event.target.value });
                  }}
                  placeholder="Nhập Z index"
                />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="form-group">
                <label for="MinzoomInput">Min zoom</label>
                <input
                  type="number"
                  className="form-control"
                  id="MinzoomInput"
                  value={this.state.minZoom}
                  onChange={(event) => {
                    this.setState({ minZoom: event.target.value });
                  }}
                  placeholder="Nhập min zoom"
                />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="form-group">
                <label for="MaxzoomInput">Max zoom</label>
                <input
                  type="number"
                  className="form-control"
                  id="MaxzoomInput"
                  value={this.state.maxZoom}
                  onChange={(event) => {
                    this.setState({ maxZoom: event.target.value });
                  }}
                  placeholder="Nhập max zoom"
                />
              </div>
            </div>
          </div>
        </div>
        {this.state.isLayerRela && (
          <div className="mt-3">
            <div className="form-group">
              <label for="layerYear">Năm điều chỉnh</label>
              <input
                type="number"
                className="form-control"
                value={this.state.year}
                onChange={(event) => {
                  this.setState({ year: event.target.value });
                }}
                id="layerYear"
                placeholder="Nhập năm điều chỉnh"
              />
            </div>
            <div className="form-group">
              <label htmlFor="inputLayerContent">Nội dung điều chỉnh</label>
              <textarea
                rows="3" 
                cols="50"
                type="text"
                className="form-control"
                value={this.state.contentChange}
                onChange={(event) => {
                  this.setState({ contentChange: event.target.value });
                }}
                id="inputLayerContent"
                placeholder="Nhập nội dung"
              />
            </div>
          </div>
        )}
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            checked={this.state.is_check}
            onClick={() => this.setState({ is_check: !this.state.is_check })}
            id="defaultViewCheckbox"
          />
          <label className="form-check-label" for="defaultViewCheckbox">
            Hiển thị mặc định
          </label>
        </div>
      </div>
    );
  }
}
