import React from "react";
import RecordsManagement from '../records-management/records-management.view';

const DocumentSettings = (props) => {
  const { isQHHTKT, isQHT, isQHCC } = props;
  const headCell =
    [
      {
        id: 'planningName',
        hideSortIcon: false,
        label: 'Tên đồ án QH',
        visibleColumn: true,
      },
      {
        id: 'planningCode',
        hideSortIcon: false,
        label: 'Mã quy hoạch',
        visibleColumn: true,
      },
      {
        id: 'planningTypeName',
        hideSortIcon: false,
        label: 'Loại quy hoạch',
        visibleColumn: true,
      },
      {
        id: 'place',
        hideSortIcon: false,
        label: 'Địa điểm',
        visibleColumn: true,
      },
      {
        id: 'planningLevelName',
        hideSortIcon: false,
        label: 'Cấp quy hoạch',
        visibleColumn: true,
      },
      {
        id: 'planningStatusName',
        hideSortIcon: false,
        label: 'Trạng thái',
        visibleColumn: true,
      },

      {
        id: "isCheckDocument",
        hideSortIcon: true,
        label: "Kiểm tra hồ sơ",
        visibleColumn: true,
      },
      {
        id: 'documentSettings',
        hideSortIcon: true,
        label: 'Hồ sơ',
        visibleColumn: true,
      }
    ]

  return (
    <RecordsManagement
      isQHCC={isQHCC}
      isQHT={isQHT}
      isQHHTKT={isQHHTKT}
      headCell={!isQHHTKT ? headCell : headCell.filter((x) => x.id !== 'planningTypeName')}
      hiddenAddButton={true}
      isHideButtonShowChart
    />
  );
};

export default DocumentSettings;
