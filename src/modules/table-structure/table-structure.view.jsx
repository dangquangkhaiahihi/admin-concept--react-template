import React, { useState } from "react";
import ListTableStructure from "./list-table-structure/list-table-structure.view";

function TableStructure() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("modifiedDate");

  function createData(
    tableName,
    created_by,
    created_date,
    modified_by,
    modified_date
  ) {
    return { tableName, created_by, created_date, modified_by, modified_date };
  }

  const tableStructureModels = [
    createData("Xin ý kiến cộng đồng", "admin", "", "admin", ""),
  ];

  return (
    <div className="table-layer-structure">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <span className="h3 mb-0 text-gray-800">Sửa cấu trúc bảng</span>
      </div>

      <ListTableStructure
        tableStructureModels={tableStructureModels}
        page={page}
        setPage={setPage}
        order={order}
        setOrder={setOrder}
        orderBy={orderBy}
        setOrderBy={setOrderBy}
      />
    </div>
  );
}

export default TableStructure;
