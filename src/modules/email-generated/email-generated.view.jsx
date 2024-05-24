import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ListEmailGenerated from './list-email-generated/list-email-generated.view';
import * as emailGeneratedAction from '../../redux/store/email-generated/email-generated.store';
import * as config from '../../common/config';
import * as appActions from '../../core/app.store';
import * as viVN from '../../language/vi-VN.json';
import {
  NotificationMessageType,
  Transition,
} from '../../utils/configuration';
import ShowNotification from '../../components/react-notifications/react-notifications';
import EmailGeneratedViewDetail from './emai-generated-view-detail/email-generated-view-detail.view';
import SearchEmailGenerated from './search-email-generated/search-email-generated.view';

function EmailGenerated(props) {
  const { isLoading, showLoading } = props;
  const [emailGeneratedModels, setEmailGeneratedModels] = useState();
  const [totalItemCount, setTotalItemCount] = useState();
  const [emailId, setEmailId] = useState();
  const [title, setTitle] = useState();
  const [rowsPerPageCommon, setRowsPerPageCommon] = useState();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('sentDate');

  useEffect(() => {
    let sortExpression = 'sentDate desc';
    getListEmailGenerated(
      1,
      config.Configs.DefaultPageSize,
      sortExpression,
      ''
    );
  }, []);

  const getListEmailGenerated = (
    pageIndex = 1,
    pageSize = config.Configs.DefaultPageSize,
    sortExpression = '',
    titleName = ''
  ) => {
    showLoading(true);
    setPage(pageIndex - 1);
    emailGeneratedAction
      .GetListEmailGenerated(
        pageIndex,
        pageSize,
        sortExpression,
        titleName.trim()
      )
      .then(
        (res) => {
          if (res && res.content && res.content.items) {
            setEmailGeneratedModels(res.content.items);
            setTotalItemCount(res.content.totalItemCount);
          }
          showLoading(false);
        },
        (err) => {
          showLoading(false);
          err &&
          err.errorType &&
          ShowNotification(
            viVN.Errors[err.errorType],
            NotificationMessageType.Error
          );
        }
      );
  };

  // --- Add Dialog
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const handleOpenViewDiaLog = (data) => {
    setEmailId(data);
    setOpenAddDialog(true);
  };
  const onHideModal = () => {
    setOpenAddDialog(false);
  };

  return (
    <div>
      <SearchEmailGenerated
        getListEmailGenerated={getListEmailGenerated}
        setTitle={setTitle}
        title={title}
        rowsPerPageCommon={rowsPerPageCommon}
        page={page}
        setPage={setPage}
        setOrder={setOrder}
        setOrderBy={setOrderBy}
        orderBy={orderBy}
        order={order}
      />

      {emailGeneratedModels && (
        <ListEmailGenerated
          emailGeneratedModels={emailGeneratedModels}
          totalItemCount={totalItemCount}
          handleOpenViewDiaLog={handleOpenViewDiaLog}
          getListEmailGenerated={getListEmailGenerated}
          setRowsPerPageCommon={setRowsPerPageCommon}
          setPage={setPage}
          page={page}
          orderBy={orderBy}
          order={order}
          setOrder={setOrder}
          title={title}
          setOrderBy={setOrderBy}
        />
      )}

      {openAddDialog && (
        <EmailGeneratedViewDetail
          openAddDialog={openAddDialog}
          onHideModal={onHideModal}
          emailId={emailId}
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

export default connect(mapStateToProps, mapDispatchToProps)(EmailGenerated);
