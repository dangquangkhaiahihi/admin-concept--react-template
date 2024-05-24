const headCellsListClient = [
    {
        id: 'name',
        numeric: false,
        disablePadding: false,
        label: 'Họ và tên',
        className: 'pt-3 pb-3',
        style: { minWidth: "150px" }
    },
    {
        id: 'provinceIds',
        numeric: false,
        disablePadding: false,
        label: 'Tỉnh/vùng',
        className: 'pt-3 pb-3',
        style: { minWidth: "150px" }
    },
    {
        id: 'clientType',
        numeric: false,
        disablePadding: false,
        label: 'Phân loại khách hàng',
        className: 'pt-3 pb-3',
        style: { minWidth: "150px" }
    },
    {
        id: 'totalMoney',
        numeric: false,
        disablePadding: false,
        label: 'Tổng tiền',
        className: 'pt-3 pb-3',
        style: { width: "70px" }
    },
    // {
    //     id: 'endDate',
    //     numeric: false,
    //     disablePadding: false,
    //     label: 'Ngày KH',
    //     className: 'pt-3 pb-3',
    //     style: { width: "70px" }
    // },
    // {
    //     id: 'created_date',
    //     numeric: false,
    //     disablePadding: false,
    //     label: 'Ngày HH',
    //     className: 'pt-3 pb-3',
    //     style: { width: "70px" }
    // },
    {
        id: 'employeeName',
        numeric: false,
        disablePadding: false,
        label: 'CSKH',
        className: 'pt-3 pb-3',
        style: { width: "70px" }
    },
    {
        id: 'isActive_isConfirm',
        numeric: false,
        disablePadding: false,
        label: 'Trạng thái',
        className: 'pt-3 pb-3',
        style: { width: "70px" }
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
        id: 'action',
        numeric: false,
        disablePadding: true,
        label: '',
        className: 'pt-3 pb-3 pl-4',
        style: { width: "60px" }
    },
];

export default headCellsListClient;