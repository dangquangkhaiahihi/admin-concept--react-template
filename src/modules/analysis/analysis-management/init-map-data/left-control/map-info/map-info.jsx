
import React, { useState, useEffect } from "react";
import "./map-info.scss";

function MapInfo(props) {
  const { dataItems } = props;
  const [fields, setFields] = useState([]);

  useEffect(() => {

    setFields(dataItems.listInfo);
  }, [dataItems, props.dataItems]);


  return (
    <div className="left-menu-layer-control-container mt-2 info-table">
                <table>
                  <thead>
                    <th class="row-label" width="50%">Tên trường</th>
                    <th width="50%">Giá trị</th>
                  </thead>
                  <tbody>
                  {fields &&
                    fields.map((item, index) => (
                      <tr>
                      <td class="row-label" width="50%">{item.label}</td>
                      <td width="50%">{item.value}</td>
                    </tr>
                  ))}
                  </tbody>
                </table>
    </div>
  );
}

export default MapInfo;
