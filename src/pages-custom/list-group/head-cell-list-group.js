const headCellsListGroup = [
    {
        id: 'index',
        numeric: false,
        disablePadding: true,
        label: 'STT',
        className: 'pt-3 pb-3',
        style: { minWidth: "150px" }
    },
    {
        id: 'name',
        numeric: false,
        disablePadding: false,
        label: 'Tên nhóm',
        className: 'pt-3 pb-3',
        style: { minWidth: "150px" }
    },
    {
        id: 'created_by',
        numeric: false,
        disablePadding: false,
        label: 'Tạo bởi',
        className: 'pt-3 pb-3',
        style: { minWidth: "150px" }
    },
    {
        id: 'created_date',
        numeric: false,
        disablePadding: false,
        label: 'Ngày tạo',
        className: 'pt-3 pb-3',
        style: { width: "70px" }
    },
    {
        id: 'modified_by',
        numeric: false,
        disablePadding: false,
        label: 'Sửa bởi',
        className: 'pt-3 pb-3',
        style: { width: "70px" }
    },
    {
        id: 'modified_date',
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

export default headCellsListGroup;