import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import CloseIcon from "@material-ui/icons/Close";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import "./popup-print.scss";
const PopupPrint = (props) => {
  const { isOpen, urlImage, planningName, listInfoMation } = props;
  console.log("listInfoMation", listInfoMation);
  const handleClose = () => {
    props.handleClosePopup(false);
  };

  const openPrintWindow = () => {
    let dataHtml = "";
    listInfoMation &&
    listInfoMation.length > 0 &&
    listInfoMation.map((item) => {
        dataHtml += `<div>${item.label}: ${item.value ? item.value : ""}</div>`;
      });
    let myWindow = window.open("", "PRINT", "height=500,width=1024");
    let title = "Bản đồ " + document.title;
    myWindow.document.write("<html><head><title>" + title + "</title>");
    myWindow.document.write("</head><body >");
    myWindow.document.write(
      `<div
      className="modal-body test"
      style="padding: 0px; height: 90%;"
    >
      <div class="mapname" id="mapname" style="text-align: center; padding: 10px; font-size: 20px; font-weight: bold">${planningName}</div>
      <div
        style="width: 100%; height: 100%;"
        className="page"
        id="page"
      >
        <div style="width: 25%; float: left; padding: 0px 15px; position: absolute; z-index: 99; left: 0px; top: 50px; background: #fff; height: 850px;">
        <h3 style="text-align:center">Thông tin quy hoạch</h3>
        ${dataHtml}
        </div>
        <div style="width:100%; float:left">
        <img
          id="imagemap"
          style="width:100%; height:auto;" 
          src=${urlImage}
          alt="Image Map"
        />
        </div>
        <p style="margin-left: 28%"><span style="color: red">* Chú ý: </span><span>Kết quả tra cứu chỉ có tính chất tham khảo</span>
        </p>
      </div>
    </div>`
    );
    myWindow.document.write("</body></html>");

    myWindow.document.close(); // necessary for IE >= 10
    myWindow.focus(); // necessary for IE >= 10*/
    myWindow.print();
    return true;
  };
  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        fullWidth={true}
        maxWidth="md"
      >
        <DialogTitle id="alert-dialog-title">
          <div className="container__title">
            <p title={planningName}>
              {planningName
                ? planningName.substring(0, 85) + "..."
                : "Bản đồ chưa đặt tên"}
            </p>
            <CloseIcon onClick={handleClose} />
          </div>
        </DialogTitle>
        <DialogContent>
          <img src={urlImage} />
          <p style={{ marginLeft: "28%" }}>
            <span style={{ color: "red" }}>* Chú ý: </span>
            <span>Kết quả tra cứu chỉ có tính chất tham khảo</span>
          </p>
        </DialogContent>
        <DialogActions>
          <button
            type="button"
            onClick={openPrintWindow}
            className="btn btn-success ml-3"
          >
            <FontAwesomeIcon icon={faPrint} color="white"></FontAwesomeIcon> In
            bản đồ
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PopupPrint;
