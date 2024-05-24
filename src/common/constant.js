
// MOI=10,	Mới
// NGHEX1=20,	Đã nghe X1
// NGHEX2=30,	Đã nghe X2
// DANGHOC=40,	Đang học
// TIEMNANG=50,	Tiềm năng
// DABAPTEM=100	Đã báp têm
export const optionsCustomerStatus = [
    {   
        value: 10,
        label: "Bước 1"   //mới,xây dựng lòng tin
    },
    {   
        value: 20,
        label: "Bước 2"  //Giới thiệu hội thánh
    },
    {   
        value: 30,
        label: "Bước 3"  //Làm chứng lẽ thật
    },
    {
        value: 31,
        label: "Bước 3 T.Năng"  //Làm chứng lẽ thật - tiềm năng BT
    },
    {   
        value: 40,
        label: "Bước 4"   //Mời đến hội thánh
    },
    {   
        value: 50,
        label: "Bước 5"   //Bap têm
    },
    {
        value: 60,
        label: "Bước 6"  //Tham dự thờ phượng
    },
    {
        value: 70,
        label: "Bước 7"  //TP > 4 lần và dâng mên
    },
    {
        value: 71,
        label: "Bước 7 - LXR"  //Laxarow tp
    },
    {
        value: 80,
        label: "Bước 8"  //swat
    },
]

export const optionsCuisineOrderStatus = [
    {
        value: 10,
        label: "Mới"
    },
    //{
    //    value: 20,
    //    label: "Đã xác nhận"
    //},
    {
        value: 30,
        //label: "Tiếp nhận"
        label: "Đã xác nhận"
    },
    {
        value: 40,
        label: "Chờ điều giao"
    },
    {
        value: 45,
        label:"Shipper chờ lấy hàng"
    },
    {
        value: 50,
        label: "Đã giao shipper"
    },
    {
        value: 100,
        label: "Đã hoàn thành"
    },
    {
        value: 200,
        label: "Hủy"
    },
]

export const optionsTransportOrderStatus = [
    {
        value: 40,
        label: "Chờ điều giao"
    },
    {
        value: 45,
        label: "Đang lấy hàng"
    },
    {
        value: 50,
        label: "Đang giao"
    },
    {
        value: 100,
        label: "Đã hoàn thành"
    },
    {
        value: 200,
        label: "Hủy"
    },
]

{/* <td><span>{row.receiptTime === 1 ? "Sáng" : (row.receiptTime === 2 ? "Trưa" : "Chiều")}</span></td> */}
export const optionsReceiptTime = [
    //{
    //    value: 1,
    //    label: "Sáng"
    //},
    {
        value: 2,
        label: "Trưa"
    },
    //{
    //    value: 3,
    //    label: "Chiều"
    //},
]

export const optionsExamination = [
    {
        value: 10,
        label: "Bước 1"   //mới,xây dựng lòng tin
    },
    {
        value: 20,
        label: "Bước 2"  //Giới thiệu hội thánh
    },
    {
        value: 30,
        label: "Bước 3"  //Làm chứng lẽ thật
    },
    {
        value: 40,
        label: "Bước 4"   //Mời đến hội thánh
    },
    {
        value: 50,
        label: "Bước 5"   //Bap têm
    },
    {
        value: 60,
        label: "Bước 6"  //Tham dự thờ phượng
    },
    {
        value: 70,
        label: "Bước 7"  //TP > 4 lần và dâng mên
    },
    {
        value: 71,
        label: "Bước 7 - LXR"  //Laxarow tp
    },
    {
        value: 80,
        label: "Bước 8"  //swat
    },
    {
        value: 200,
        label: "Ca chia sẻ"  //swat
    },
]