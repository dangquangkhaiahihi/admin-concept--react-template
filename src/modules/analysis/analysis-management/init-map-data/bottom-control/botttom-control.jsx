import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TextField } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import "./bottom-control.scss";

function BottomControl(props) {
  const { dataItems } = props;
  const [isHide, setIsHide] = useState(false);
  const [fields, setFields] = useState([]);
  const [hasError, setHasError] = useState({ err: false, index: -1 });

  useEffect(() => {
    setFields(dataItems.listInfo);
    console.log("dataItems", dataItems);
  }, [dataItems, props.dataItems]);


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
                      />
                    )}

                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default BottomControl;
