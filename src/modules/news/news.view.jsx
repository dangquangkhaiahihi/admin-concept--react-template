import React, { useState, useEffect } from "react";
import { Configs } from "../../common/config";
import { useForm } from "react-hook-form";

//--- Material Control
import { Button } from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { makeStyles } from "@material-ui/core/styles";

//--- Styles
import "./news.scss";

//--- Material Icon
import DeleteCircle from "@material-ui/icons/DeleteForever";
import AddCircle from "@material-ui/icons/AddCircle";

//--- Component
import ListNews from "./list-news/list-news.view";
import AddNews from "./add-news/add-news.view";
import EditNews from "./edit-news/edit-news.view";
import DeleteDialog from "../../components/dialog-delete/dialog-delete.view";
import SearchNews from "./search-news/search-news.view";

//--- Notifications
import ShowNotification from "../../components/react-notifications/react-notifications";
import { NotificationMessageType } from "../../utils/configuration";
import * as viVN from "../../language/vi-VN.json";

//--- Redux store
import * as newsAction from "../../redux/store/news/news.store";
import vi from "../../language/vi";

const useStyles = makeStyles((theme) => ({
  positionRelative: {
    position: "relative",
    '@media (max-width: 1224px)': {
      top:'-15px',
    }
  },
  btnAdd: {
    display: "flex",
    position: "absolute",
    top: -52,
    zIndex: 10,
    right: 0,
    color: "#3f51b5",
    cursor: "pointer",
  },
  btnAddContent : {
    borderBottom: "2px solid #3f51b5",
    '@media (max-width: 1224px)': {
      fontSize : '14px',
    }
  },
  mr05: {
    marginRight: 5,
  },
}));

export default function News(props) {
  const classes = useStyles();
  const { isQHT, isQHCC, isQHHTKT } = props;
  const [newsModels, setNewsModels] = useState();
  const [totalItemCount, setTotalItemCount] = useState();
  const [searchData, setSearchData] = useState({
    categoryId: 1,
    title: "",
    description: "",
    status: 2,
  });
  const [newsId, setNewsId] = useState();
  const [newsxmin, setNewsxmin] = useState();
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("modifiedDate");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(Configs.DefaultPageSize);

  const [isDelete, setIsDelete] = useState(0);
  const [isShowTrash, setIsShowTrash] = useState(false);

  const { register, handleSubmit } = useForm({
    mode: "all",
    reValidateMode: "onBlur",
  });

  useEffect(() => {
    GetListAll();
  }, []);

  const GetListAll = (
    categoryId = 1,
    title,
    isHot = undefined,
    isFeature = undefined,
    isDelete = 0,
    status = undefined,
    pageIndex = 1,
    pageSize,
    sortExpression
  ) => {
    setPage(pageIndex - 1);
    newsAction
      .GetListAll(
        categoryId,
        title,
        isHot,
        isFeature,
        isDelete,
        status,
        pageIndex,
        pageSize,
        sortExpression,
        isQHT, isQHCC, isQHHTKT
      )
      .then((res) => {
        if (res && res.content) {
          setNewsModels(res.content.items);
          setTotalItemCount(res.content.totalItemCount);
        }
      })
      .catch((err) => {
        ShowNotification(
          viVN.Errors.AccessDenied,
          NotificationMessageType.Error
        );
      });
  };

  //--- Dialog
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleOpenEditDialog = (newsId) => {
    setNewsId(newsId);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleOpenDeleteDialog = (newsId, newsxmin) => {
    setNewsId(newsId);
    setNewsxmin(newsxmin);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  //--- Filter
  const [filterSection, setFilterSection] = useState(null);

  const handleClickFilter = (event) => {
    setFilterSection(event.currentTarget);
  };

  const handleCloseFilter = () => {
    setFilterSection(null);
  };

  const ShowNotificationError = (messages) => {
    ShowNotification(messages, NotificationMessageType.Error);
  };

  const openFilter = Boolean(filterSection);
  const idFilter = openFilter ? "popoverSlider" : undefined;

  const handleRestore = (id) => {
    newsAction.RestoreNews(id).then(
      (res) => {
        if (res && res.content && res.content.status) {
          GetListAll(
            //searchData.categoryId,
            searchData.title,
            undefined,
            undefined,
            isDelete,
            searchData.status,
            1,
            rowsPerPage,
            orderBy + " " + order
          );
          ShowNotification(
            viVN.Success.NewsRestoreSuccess,
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

  const handleDelete = () => {
    newsAction.DeleteNews(newsId, newsxmin).then(
      (res) => {
        if (res && res.content && res.content.status) {
          GetListAll(
            searchData.categoryId,
            searchData.title,
            undefined,
            undefined,
            isDelete,
            searchData.status,
            1,
            rowsPerPage,
            orderBy + " " + order
          );
          handleCloseDeleteDialog();
          ShowNotification(
            viVN.Success.NewsDeleteSuccess,
            NotificationMessageType.Success
          );
        }
      },
      (err) => {
        handleCloseDeleteDialog();
        err &&
          err.errorType &&
          ShowNotification(
            err.errorMessage,
            NotificationMessageType.Error
          );
      }
    );
  };

  const handelChangeFeature = (newsId, value) => {
    alert("change " + newsId + " feature to" + value);
  };
  const handleClearAllField = () => {
    refresh();
    setFilterSection(null);
  };

  const onSubmit = async (data) => {
    await GetListAll(
      searchData.categoryId,
      searchData.title,
      undefined,
      undefined,
      isDelete,
      searchData.status,
      1,
      rowsPerPage,
      orderBy + " " + order
    );
    handleCloseFilter();
  };

  const refresh = () => {
    setSearchData({
      categoryId: 1,
      title: "",
      description: "",
      status: 2,
    });
    setOrderBy("modifiedDate");
    setOrder("desc");
    GetListAll(
      1,
      "",
      undefined,
      undefined,
      isDelete,
      undefined,
      1,
      rowsPerPage,
      orderBy + " " + order
    );
  };

  const handleChangeTrash = (event) => {
    setIsShowTrash(event.target.checked);
    setIsDelete(event.target.checked ? 1 : 0);
    GetListAll(
      //searchData.categoryId,
      searchData.title,
      undefined,
      undefined,
      event.target.checked ? 1 : 0,
      searchData.status,
      1,
      rowsPerPage,
      orderBy + " " + order
    );
  };

  //const handleChangeStatus = (event) => {
  //    setStatus(event.target.value === 2 ? undefined : event.target.value);
  //    setSearchData({ [event.target.name]: event.target.value });
  //}

  const handleChangeSearchForm = (event) => {
    setSearchData({ ...searchData, [event.target.name]: event.target.value });
  };

  const handleEmptyTrash = () => {
    newsAction.EmptyTrash().then(
      (res) => {
        if (res && res.content && res.content.status) {
          GetListAll(
            searchData.categoryId,
            searchData.title,
            undefined,
            undefined,
            isDelete,
            searchData.status,
            1,
            rowsPerPage,
            orderBy + " " + order
          );
          //handleCloseDeleteDialog();
          ShowNotification(
            viVN.Success.NewsDeleteSuccess,
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
    <div className={`slider ${classes.positionRelative}`}>
      <div className={`${classes.btnAdd}`} onClick={handleOpenAddDialog}>
      <span className={`${classes.btnAddContent}`}> 
        <AddCircle className={classes.mr05} />
        Thêm Tin
      </span>
      </div>

      <SearchNews
        isQHCC={isQHCC}
        isQHT={isQHT}
        isQHHTKT={isQHHTKT}
        searchData={searchData}
        onChangeDescription={handleChangeSearchForm}
        onChangeTitle={handleChangeSearchForm}
        onChangeStatus={handleChangeSearchForm}
        refresh={refresh}
        onSubmit={onSubmit}
      />
      {/* <div className="d-sm-flex align-items-center justify-content-between mb-3">
        <h1 className="h3 mb-0 text-gray-800"> */}
      {/* <Tooltip title="Tìm kiếm">
            <Fab color="primary" aria-label="filter" size="small" className="ml-2" onClick={handleClickFilter} aria-describedby={idFilter}>
              <SearchIcon />
            </Fab>
          </Tooltip> */}
      {/* <Tooltip title="Làm mới">
            <Fab
              color="primary"
              aria-label="filter"
              size="small"
              onClick={refresh}
              className="ml-2"
            >
              <RefreshIcon />
            </Fab>
          </Tooltip> */}
      {/* <span>&nbsp;&nbsp;</span>

          <FormControlLabel
            control={
              <Switch
                checked={isShowTrash}
                onChange={handleChangeTrash}
                name="checkedB"
                color="primary"
              />
            }
            label="Thùng rác"
          />
        </h1>
        <ButtonGroup
          variant="contained"
          color="primary"
          aria-label="contained primary button group"
        >
          {isShowTrash && (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleEmptyTrash}
              startIcon={<DeleteCircle />}
            >
              Xóa thùng rác
            </Button>
          )}
        </ButtonGroup>
      </div> */}
      {newsModels ? (
        <ListNews
          isQHCC={isQHCC}
          isQHT={isQHT}
          isQHHTKT={isQHHTKT}
          totalItemCount={totalItemCount}
          newsModels={newsModels}
          GetListAll={GetListAll}
          title={searchData.title}
          categoryId={searchData.categoryId}
          isDelete={isDelete}
          editAction={handleOpenEditDialog}
          deleteAction={handleOpenDeleteDialog}
          restoreAction={handleRestore}
          changeFeatureAction={handelChangeFeature}
          setOrder={setOrder}
          setOrderBy={setOrderBy}
          setPage={setPage}
          setRowsPerPage={setRowsPerPage}
          order={order}
          orderBy={orderBy}
          page={page}
          rowsPerPage={rowsPerPage}
        />
      ) : (
        ""
      )}
      {openAddDialog && (
        <AddNews
          isQHCC={isQHCC}
          isQHT={isQHT}
          isQHHTKT={isQHHTKT}
          isOpen={openAddDialog}
          onClose={handleCloseAddDialog}
          onSuccess={handleCloseAddDialog}
          ShowNotificationError={ShowNotificationError}
          GetListAll={GetListAll}
          rowsPerPage={rowsPerPage}
          setOrder={setOrder}
          setOrderBy={setOrderBy}
        />
      )}

      {openEditDialog && (
        <EditNews
          isQHCC={isQHCC}
          isQHT={isQHT}
          isQHHTKT={isQHHTKT}
          isOpen={openEditDialog}
          onClose={handleCloseEditDialog}
          onSuccess={handleCloseEditDialog}
          newsId={newsId}
          ShowNotificationError={ShowNotificationError}
          GetListAll={GetListAll}
          rowsPerPage={rowsPerPage}
          setOrder={setOrder}
          setOrderBy={setOrderBy}
        />
      )}

      {openDeleteDialog && (
        <DeleteDialog
          isOpen={openDeleteDialog}
          onClose={handleCloseDeleteDialog}
          onSuccess={handleDelete}
          header={"Xác nhận xóa"}
          content={"Bạn có chắc chắn muốn xóa?"}
        />
      )}
    </div>
  );
}
