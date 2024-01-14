import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import ListElementContact from "./list-element-contact/list-element-contact.view";
import * as contactAction from "../../redux/store/contact/contact.store";
import * as config from "../../common/config";
import * as appActions from "../../core/app.store";
//Notifications
import ShowNotification from "../../components/react-notifications/react-notifications";
import { NotificationMessageType } from "../../utils/configuration";
import * as viVN from "../../language/vi-VN.json";

import ViewContact from "./view-contact/view-contact.view";
import SearchContactManager from "./search-contact-management/search-contact-management";

function ContactManagement(props) {
  const { showLoading } = props;
  const [contactModels, setContactModels] = useState();
  const [totalItemCount, setTotalItemCount] = useState();
  const [contactId, setContactId] = useState();
  const [name, setName] = useState();
  const [sendFrom, setSendFrom] = useState();
  const [rowsPerPageCommon, setRowsPerPageCommon] = useState();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("sentDate");

  useEffect(() => {
    let sortExpression = "sentDate desc";
    getListContactModels(1, config.Configs.DefaultPageSize, sortExpression);
  }, []);

  const getListContactModels = (
    pageIndex = 1,
    pageSize = config.Configs.DefaultPageSize,
    sortExpression = config.Configs.DefaultPageSize,
    userName = "",
    sendFrom = ""
  ) => {
    showLoading(true);
    setPage(pageIndex - 1);
    contactAction
      .GetListContactManagement(
        pageIndex,
        pageSize,
        sortExpression,
        userName.trim(),
        sendFrom.trim()
      )
      .then(
        (res) => {
          if (res && res.content && res.content.items) {
            setContactModels(res.content.items);
            setTotalItemCount(res.content.totalItemCount);
          }
          showLoading(false);
        },
        (err) => {
          showLoading(false);
          ShowNotification(viVN.Errors.AccessDenied, NotificationMessageType.Error);
        }
      );
  };

  // --- Add Dialog
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const handleOpenViewDiaLog = (data) => {
    setContactId(data);
    setOpenAddDialog(true);
  };

  const onHideModal = () => {
    setOpenAddDialog(false);
    getListContactModels(1, config.Configs.DefaultPageSize, "sentDate desc");
  };

  return (
    <div>
      <SearchContactManager
        getListContactModels={getListContactModels}
        setName={setName}
        setPage={setPage}
        setSendFrom={setSendFrom}
        rowsPerPageCommon={rowsPerPageCommon}
        name={name}
        page={page}
        sendFrom={sendFrom}
        setOrder={setOrder}
        setOrderBy={setOrderBy}
        orderBy={orderBy}
        order={order}
      />

      {contactModels && (
        <ListElementContact
          contactModels={contactModels}
          totalItemCount={totalItemCount}
          handleOpenViewDiaLog={handleOpenViewDiaLog}
          name={name}
          sendFrom={sendFrom}
          getListContactModels={getListContactModels}
          setRowsPerPageCommon={setRowsPerPageCommon}
          setPage={setPage}
          page={page}
          orderBy={orderBy}
          order={order}
          setOrder={setOrder}
          setOrderBy={setOrderBy}
        />
      )}

      {openAddDialog && (
        <ViewContact
          openAddDialog={openAddDialog}
          onHideModal={onHideModal}
          contactId={contactId}
        />
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

export default connect(mapStateToProps, mapDispatchToProps)(ContactManagement);
