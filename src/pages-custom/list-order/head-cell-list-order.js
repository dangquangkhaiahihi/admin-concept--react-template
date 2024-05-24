const headCellsListOrder = [
    {
        id: 'clientName',
        numeric: false,
        disablePadding: false,
        label: 'Khách hàng',
        className: 'pt-3 pb-3',
        style: { minWidth: "150px" }
    },
    {
        id: 'planName',
        numeric: false,
        disablePadding: false,
        label: 'Các gói đăng ký',
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
        id: 'startDate',
        numeric: false,
        disablePadding: false,
        label: 'Ngày kích hoạt',
        className: 'pt-3 pb-3',
        style: { width: "70px" }
    },
    {
        id: 'endDate',
        numeric: false,
        disablePadding: false,
        label: 'Ngày hết hạn',
        className: 'pt-3 pb-3',
        style: { width: "70px" }
    },
    // {
    //     id: 'employeeName',
    //     numeric: false,
    //     disablePadding: false,
    //     label: 'Trạng thái',
    //     className: 'pt-3 pb-3',
    //     style: { width: "70px" }
    // },
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
        id: 'action',
        numeric: false,
        disablePadding: true,
        label: '',
        className: 'pt-3 pb-3 pl-4',
        style: { width: "60px" }
    },
];

export default headCellsListOrder;