const headCellsListDeposit = [
    {
        id: 'clientName',
        numeric: false,
        disablePadding: false,
        label: 'Họ và tên',
        className: 'pt-3 pb-3',
        style: { minWidth: "150px" }
    },
    {
        id: 'depositAmount',
        numeric: false,
        disablePadding: false,
        label: 'Số tiền',
        className: 'pt-3 pb-3',
        style: { minWidth: "150px" }
    },
    {
        id: 'userName',
        numeric: false,
        disablePadding: false,
        label: 'Người nạp',
        className: 'pt-3 pb-3',
        style: { minWidth: "150px" }
    },
    
    {
        id: 'status',
        numeric: false,
        disablePadding: false,
        label: 'Trạng thái',
        className: 'pt-3 pb-3',
        style: { width: "70px" }
    },
    // {
    //     id: 'endDate',
    //     numeric: false,
    //     disablePadding: false,
    //     label: 'Thanh toán',
    //     className: 'pt-3 pb-3',
    //     style: { width: "70px" }
    // },
    {
        id: 'createdDate',
        numeric: false,
        disablePadding: false,
        label: 'Ngày nạp',
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

export default headCellsListDeposit;