import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

//--- Material Control
import Button from "@material-ui/core/Button";

//--- Material Icon
import AddCircle from "@material-ui/icons/AddCircle";

import ShowNotification from "../../components/react-notifications/react-notifications";
import { NotificationMessageType } from "../../utils/configuration";
import * as viVN from "../../language/vi-VN.json";
import * as emailTemplateAction from "../../redux/store/email-template/email-template.store";
import * as config from "../../common/config";
import * as appActions from "../../core/app.store";

//--- Component
import EmailAddDiaLog from "./add-email-template/add-email-template.view";
import EmailEditDiaLog from "./edit-email-template/edit-email-template.view";
import SearchEmailTemplate from "./search-email-template/search-email-template.view";
import ListEmailTemplate from "./list-email-template/list-email-template.view";
import DiaLogDelete from "../../components/dialog-delete/dialog-delete.view";

function EmailTemplate(props) {
  const { isLoading, showLoading } = props;
  const [isAddDialog, setIsAddDialog] = useState(false);
  const [emailModels, setEmailModels] = useState([]);
  const [emailDel, setEmailDel] = useState("");
  const [emailEditCode, setEditEmailCode] = useState("");
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [rowsPerPageCommon, setRowsPerPageCommon] = useState();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("modifiedDate");

  useEffect(() => {
    getListEmailModels();
  }, []);

  // --- Add Dialog
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const getListEmailModels = (
    pageIndex = 1,
    pageSize = config.Configs.DefaultPageSize,
    sortExpression = "modifiedDate desc",
    code = "",
    title = ""
  ) => {
    showLoading(true);
    setPage(pageIndex - 1);
    emailTemplateAction
      .GetListEmailTemplates(pageIndex, pageSize, sortExpression, code.trim(), title.trim())
      .then(
        (res) => {
          if (res && res.content && res.content.items) {
            setEmailModels(res.content.items);
            setContent(res.content);
          }
          showLoading(false);
        },
        (err) => {
          showLoading(false)
          err &&
            err.errorType &&
            ShowNotification(
              viVN.Errors[err.errorType],
              NotificationMessageType.Error
            );
        }
      );
  };

  const handleOpenAddDialog = () => {
    setIsAddDialog(true);
    setOpenAddDialog(true);
  };

  const onHideModal = () => {
    setOpenAddDialog(false);
  };

  //Edit Dialog
  const handleOpenEditDialog = (data) => {
    setIsAddDialog(false);
    setEditEmailCode(data);
    setOpenAddDialog(true);
  };

  //--- Delete Dialog
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

  const handleOpenDeleteDialog = (code) => {
    setOpenDeleteDialog(true);
    setEmailDel(code);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleDelete = () => {
    emailTemplateAction.DeleteEmailTemplate({ code: emailDel }).then(
      (res) => {
        if (res && res.content && res.content.status) {
          getListEmailModels(1, rowsPerPageCommon, orderBy ? (orderBy + " " + order) : "", code, title);
          handleCloseDeleteDialog();
          ShowNotification(
            viVN.Success.EmailDeleteSuccess,
            NotificationMessageType.Success
          );
        }
      },
      (err) => {
        err &&
          err.errorType &&
          ShowNotification(
            viVN.Errors[err.errorType],
            NotificationMessageType.Error
          );
      }
    );
  };

  return (
    <div className="email-templates">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <SearchEmailTemplate
          getListEmailModels={getListEmailModels}
          setCode={setCode}
          setTitle={setTitle}
          code={code}
          title={title}
          rowsPerPageCommon={rowsPerPageCommon}
          setOrderBy={setOrderBy}
          setOrder={setOrder}
          orderBy={orderBy}
          order={order}
        ></SearchEmailTemplate>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenAddDialog}
          startIcon={<AddCircle />}
        >
          Thêm email
        </Button>
      </div>

      {/* List Element Email */}
      <ListEmailTemplate
        emailModels={emailModels}
        contentModel={content}
        handleOpenEditDialog={handleOpenEditDialog}
        handleOpenDeleteDialog={handleOpenDeleteDialog}
        getListEmailModels={getListEmailModels}
        code={code}
        title={title}
        setRowsPerPageCommon={setRowsPerPageCommon}
        page={page}
        setPage={setPage}
        setOrder={setOrder}
        setOrderBy={setOrderBy}
        order={order}
        orderBy={orderBy}
      />

      {openAddDialog ? (
        isAddDialog ? (
          <EmailAddDiaLog
            rowsPerPageCommon={rowsPerPageCommon}
            openAddDialog={openAddDialog}
            onHideModal={onHideModal}
            getListEmailModels={getListEmailModels}
            setOrder={setOrder}
            setOrderBy={setOrderBy}
          ></EmailAddDiaLog>
        ) : (
            <EmailEditDiaLog
              rowsPerPageCommon={rowsPerPageCommon}
              emailEditCode={emailEditCode}
              openAddDialog={openAddDialog}
              onHideModal={onHideModal}
              getListEmailModels={getListEmailModels}
              setOrder={setOrder}
              setOrderBy={setOrderBy}
            ></EmailEditDiaLog>
          )
      ) : (
          ""
        )}

      {openDeleteDialog ? (
        <DiaLogDelete
          isOpen={openDeleteDialog}
          rowsPerPageCommon={rowsPerPageCommon}
          onClose={handleCloseDeleteDialog}
          onSuccess={handleDelete}
        />
      ) : (
          ""
        )}
    </div>
  );
}
const mapStateToProps = (state) => ({
  isLoading: state.app.loading,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      showLoading: appActions.ShowLoading,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(EmailTemplate);
