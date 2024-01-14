import React, { Fragment } from "react";
import * as MaterialUi from "@material-ui/core";
import { Container, Draggable } from "react-smooth-dnd";
import "./list-items.scss";
import ListItemsModels from "../../../../../models/init-map-state/child/list-items-models";
import ConfigModels from "../../../../../models/init-map-state/child/config-models";

export default class RenderListItems extends React.Component<
  ListItemsModels.ListItemsProps,
  ListItemsModels.ListItemsState
  > {
  constructor(props: ListItemsModels.ListItemsProps) {
    super(props);
    this.state = {
      listDatas: this.props.data,
      checkAll: false,
      lockAxis: "",
      dataSource: { cols: [] },
    };
  }

  componentDidMount() {
    
    const data = this.state.listDatas.map(item => { return { ...item, type_display: item.type_display || "" } });
    const _checkAll = this.state.listDatas.some(item => item.checked === false);
    this.setState({ listDatas: [...data], checkAll: !_checkAll })
    const dataSource = this.props.dataSource;
    if (dataSource) {
      const oldListData = [...this.props.data];
      oldListData.map((data) => {
        dataSource.cols.map((col) => {
          if (col.column_name === data.column_name) {
            data.label = col.label;
            return;
          }
        });
      });
      console.log(oldListData)
    }
  }

  componentWillUnmount() {
    this.props.setData([...this.state.listDatas]);
    this.props.dataSource?.cols.map((col) => {
      this.state.listDatas.map((data) => {
        if (col.column_name === data.column_name) {
          col.label = data.label;
          return;
        }
      });
    });

    let _cols: ConfigModels.ObjectOfColsRaw[] = [];
    this.state.listDatas.map((item) => {
      _cols.push({
        column_name: item.column_name,
        data_type: item.data_type,
        label: item.label || item.column_name,
      });
    });

    this.props.setDataSource?.({ ...this.props.dataSource, cols: _cols });
    console.log([...this.state.listDatas])
    console.log({ ...this.props.dataSource, cols: _cols })
  }

  handleSingleClickCheckbox = (index: number) => {
    const data = this.state.listDatas;
    data[index].checked = !data[index].checked;
    const _checkAll = data.some(item => item.checked === false);
    this.setState({ listDatas: data, checkAll: !_checkAll });
    console.log(data)
  };

  handleCheckedAll = () => {
    const data = this.state.listDatas;
    if (!this.state.checkAll) {
      data.map((field) => (field.checked = true));
    } else {
      data.map((field) => (field.checked = false));
    }
    this.setState({ checkAll: !this.state.checkAll });
    this.setState({ listDatas: [...data] });
  };

  handleChangeLabel = (event: any, index: number) => {
    const data = this.state.listDatas;
    data[index].label = event.target.value;
    this.setState({ listDatas: [...data] });
  };

  getChildPayload = (index: number) => this.state.listDatas[index];

  handleOnFocusInput = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.parentElement?.parentElement?.parentElement?.classList.remove(
      "smooth-dnd-draggable-wrapper"
    );
  };

  handleOnBlurInput = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.parentElement?.parentElement?.parentElement?.classList.add(
      "smooth-dnd-draggable-wrapper"
    );
  };

  onDrop = (event: any) => {
    const data = [...this.state.listDatas];
    data.splice(event.removedIndex, 1);
    data.splice(event.addedIndex, 0, event.payload);
    this.setState({ listDatas: data });
    this.props.setData([...data]);
  };

  getColumnNameInCols = () => {
    let columnNames = this.props.dataSource?.cols.map((col) => {
      return col.column_name;
    });
    return columnNames;
  };
  onChangeSelect = (object: any, index: number) => {
    const data = this.state.listDatas;
    data[index].type_display = object.target.value || "";
    this.setState({ listDatas: [...data] });
    this.props.setData([...data]);
  }

  render() {
    return (
      <div className="container-fluid m-0 p-0 list-items-container">
        <div className="actions-box row m-0">
          <div className="col-lg-6">
            <MaterialUi.FormControlLabel
              control={
                <MaterialUi.Switch
                  name="checkedB"
                  color="primary"
                  checked={this.state.checkAll}
                  onClick={() => this.handleCheckedAll()}
                />
              }
              label="Chọn tất"
            />
          </div>
          <div className="col-lg-6 text-right p-0">
            {this.props.setSortWidth && (
              <Fragment>
                Sắp xếp:
                <select
                  id="selectSordResultFilter"
                  className="form-control w-75 d-inline-block ml-1"
                  value={this.props.sortWidth || ""}
                  onChange={(event) =>
                    this.props.setSortWidth?.(event.target.value)
                  }
                >
                  {this.props.dataSourceCols?.map((column, index: number) => (
                    <option key={index} value={column.column_name}>
                      {column.column_name}
                    </option>
                  ))}
                </select>
              </Fragment>
            )}
          </div>
          <div className="col-12 container-list-limited-height">
            <div className="container-fluid m-0 p-0">
              <div className="row m-0">
                <div className="col-2 text-center p-0"><p className="mobile-header-panel">Hiển thị</p></div>
                <div className="col-3 text-left p-0"><p className="mobile-header-panel">Tên trường dữ liệu</p></div>
                <div className="col-4 text-left p-0"><p className="mobile-header-panel">Nhãn hiển thị</p></div>
                {this.props.numberCase === 3 && <div className="col-3 text-left p-0"><p className="mobile-header-panel">Loại hiển thị</p></div>}
              </div>
            </div>
            <Container
              getChildPayload={this.getChildPayload}
              onDrop={this.onDrop}
              dragClass="custom-row-drag"
              lockAxis="y"
            >
              {this.state.listDatas.map((data, index) => (
                <Draggable key={index}>
                  <div className="row custom-row">
                    <div className="col-2 text-center p-0">
                      <MaterialUi.Checkbox
                        onClick={() => this.handleSingleClickCheckbox(index)}
                        checked={data.checked}
                        inputProps={{ "aria-label": "primary checkbox" }}
                      />
                    </div>
                    <div className="col-3 custom-col p-0 padding-left"><p style={{wordBreak:'break-word'}}>{data.column_name}</p></div>
                    <div className="col-4 custom-col p-0">
                      <input
                        value={data.label !== null ? data.label:data.column_name} 
                        onChange={(event) =>
                          this.handleChangeLabel(event, index)
                        }
                        onFocus={this.handleOnFocusInput}
                        onBlur={this.handleOnBlurInput}
                      />
                    </div>
                    {this.props.numberCase === 3 && (
                      <div className="col-3 custom-col p-0">
                        <select name="typeData" id="typeData" onChange={(event) => this.onChangeSelect(event, index)}>
                          <option value="">Chọn dữ liệu</option>
                          <option value="dropdown" selected={data.type_display === 'dropdown'}>Dropdown</option>
                          <option value="number" selected={data.type_display === 'number'}>Number</option>
                          <option value="char" selected={data.type_display === 'char'}>Char</option>
                        </select>
                      </div>
                    )}
                  </div>
                </Draggable>
              ))}
            </Container>
          </div>
        </div>
      </div>
    );
  }
}
