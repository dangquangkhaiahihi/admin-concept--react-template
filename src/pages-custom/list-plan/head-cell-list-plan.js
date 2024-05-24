const headCellsListPlan = [
    {
        id: 'name',
        numeric: false,
        disablePadding: false,
        label: 'Tên gói',
        className: 'pt-3 pb-3',
        style: { minWidth: "150px" }
    },
    {
        id: 'price',
        numeric: false,
        disablePadding: false,
        label: 'Giá tiền',
        className: 'pt-3 pb-3',
        style: { minWidth: "150px" }
    },
    {
        id: 'promotion',
        numeric: false,
        disablePadding: false,
        label: 'Khuyến mãi',
        className: 'pt-3 pb-3',
        style: { width: "70px" }
    },
    {
        id: 'endDate',
        numeric: false,
        disablePadding: false,
        label: 'Ngày kết thúc KM',
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

export default headCellsListPlan;