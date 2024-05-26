const headCellsListRole = [
    {
        id: 'index',
        numeric: false,
        disablePadding: true,
        label: 'STT',
        className: 'pt-3 pb-3',
        style: { minWidth: "150px" }
    },
    {
        id: 'code',
        numeric: false,
        disablePadding: false,
        label: 'Mã chức vụ',
        className: 'pt-3 pb-3',
        style: { minWidth: "150px" }
    },
    {
        id: 'name',
        numeric: false,
        disablePadding: false,
        label: 'Tên chức vụ',
        className: 'pt-3 pb-3',
        style: { minWidth: "150px" }
    },
    {
        id: 'createdBy',
        numeric: false,
        disablePadding: false,
        label: 'Người tạo',
        className: 'pt-3 pb-3',
        style: { width: "70px" }
    },
    {
        id: 'createdDate',
        numeric: false,
        disablePadding: false,
        label: 'Ngày tạo',
        className: 'pt-3 pb-3',
        style: { width: "70px" }
    },
    {
        id: 'modifiedBy',
        numeric: false,
        disablePadding: false,
        label: 'Người sửa',
        className: 'pt-3 pb-3',
        style: { width: "70px" }
    },
    {
        id: 'modifiedDate',
        numeric: false,
        disablePadding: false,
        label: 'Ngày sửa',
        className: 'pt-3 pb-3',
        style: { width: "70px" }
    },
    {
        id: 'action',
        numeric: false,
        disablePadding: true,
        label: '',
        className: 'pt-3 pb-3 pl-4',
        style: { width: "60px" }
    },
];

export default headCellsListRole;