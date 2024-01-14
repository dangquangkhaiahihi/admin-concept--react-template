import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TextField } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import "./bottom-control.scss";
import * as geo from "../../../redux/store/geo-gis/geo.store";
import ShowNotification from "../../../components/react-notifications/react-notifications";
import * as viVN from "../../../language/vi-VN.json";
import { NotificationMessageType } from "../../../utils/configuration";

function BottomControl(props) {
  const { dataItems } = props;
  const [isHide, setIsHide] = useState(false);
  const [fields, setFields] = useState([]);
  const [hasError, setHasError] = useState({ err: false, index: -1 });

  useEffect(() => {
    setFields(dataItems.listInfo);
    console.log("dataItems", dataItems);
  }, [dataItems, props.dataItems]);

  const handleUpdate = () => {
    // get data in view
    let formData = new FormData();
    for (var i = 0; i < fields.length; i++) {
      formData.append(`properties[` + i + `].column`, fields[i].variable);
      formData.append(`properties[` + i + `].data`, fields[i].value);
    }

    formData.append("tableName", dataItems.table.toString());
    formData.append("gid", Number.parseInt(dataItems.gid));

    geo
      .UpdateGeogisColumnData(formData)
      .then((res) => {
        console.log("res", res);
        if (res.content.status) {
          ShowNotification(
            viVN.Success.UpdateSuccess,
            NotificationMessageType.Success
          );
        }
      })
      .catch((err) => {
        console.log("res", err);
        ShowNotification(
          viVN.Errors[err.errorType],
          NotificationMessageType.Error
        );
      });
  };

  const handleFormChange = (index, event) => {
    console.log(index, event.target.name);
    let data = [...fields];

    if (handleValidate(data[index].value, event.target.value, index)) {
      data[index].value = event.target.value;
      setFields(data);
    }
  };

  const handleValidate = (oldData, newData, index) => {
    if (isNaN(oldData) === isNaN(newData)) {
      setHasError({ err: false, index: -1 });
      return true;
    } else {
      // string
      // not validate
    }
    setHasError({ err: true, index: index });
    return false;
  };

  return (
    <>
      <div className={isHide ? "container-bottom-hide" : "container-bottom"}>
        {isHide ? (
          <button
            onClick={() => setIsHide(!isHide)}
            title="Hiện"
            className="hide-button"
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
        ) : (
          <>
            <div className="head">
              <p className="head__title">Thông tin</p>
              <button
                onClick={() => setIsHide(!isHide)}
                title="Ẩn"
                className="head__button-hide"
              >
                <FontAwesomeIcon icon={faEyeSlash} />
              </button>
            </div>

            <div className="row">
              {fields &&
                fields.map((item, index) => (
                  <div className="col-md-2 margin-10">
                    {!props.isLock ? (
                      <TextField
                        name={item.variable}
                        key={index}
                        label={item.label}
                        variant="outlined"
                        size="small"
                        defaultValue={item.value}
                        onChange={(event) => handleFormChange(index, event)}
                        helperText={
                          index === hasError.index &&
                          hasError.err &&
                          "Sai kiểu dữ liệu"
                        }
                        error={index === hasError.index && hasError.err}
                      />
                    ) : (
                      <TextField
                        name={item.variable}
                        key={index}
                        label={item.label}
                        variant="outlined"
                        size="small"
                        value={item.value}
                        //defaultValue={item.value}
                        //onChange={(event) => handleFormChange(index, event)}
                        // helperText={
                        //   index === hasError.index &&
                        //   hasError.err &&
                        //   "Sai kiểu dữ liệu"
                        // }
                        // error={index === hasError.index && hasError.err}
                      />
                    )}

                  </div>
                ))}
            </div>
            {!props.isLock && (
              <div className="row margin-10">
                <button
                  type="button"
                  className="btn btn-success mgl-20"
                  onClick={handleUpdate}
                >
                  Cập nhật
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default BottomControl;
