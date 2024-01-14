/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { saveAs } from "file-saver";
import moment from "moment";

//--- Material control
import {
  Card,
  CardContent,
  makeStyles,
  CardHeader,
  Divider,
  Tooltip,
  Fab,
  Button,
  Popover,
  IconButton,
  TextField,
} from "@material-ui/core";

//--- Material Icon
import FilterListIcon from "@material-ui/icons/FilterList";
import CloseIcon from "@material-ui/icons/Close";
import SearchIcon from "@material-ui/icons/Search";
import ClearAllIcon from "@material-ui/icons/ClearAll";
import RefreshIcon from "@material-ui/icons/Refresh";
import * as consultTheCommunityAction from "../../../redux/store/consult-the-community/consult-the-community.store";
import * as appActions from "../../../core/app.store";

//--- Component
import ListFeedback from "./list-feedback/list-feedback.view";

import { Configs } from "../../../common/config";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
});

const tableHeadDefault = [
  [
    {
      id: "Name",
      title: "Họ và tên",
      rowSpan: 2,
      colSpan: 1,
      className: "text-nowrap",
      align: "",
      hideSortIcon: false,
    },
    {
      id: "Address",
      title: "Địa chỉ",
      rowSpan: 2,
      colSpan: 1,
      className: "text-nowrap",
      align: "",
      hideSortIcon: true,
    },
    {
      id: "PhoneNo",
      title: "Số điện thoại",
      rowSpan: 2,
      colSpan: 1,
      className: "text-nowrap",
      align: "",
      hideSortIcon: true,
    },
    {
      id: "Email",
      title: "Email",
      rowSpan: 2,
      colSpan: 1,
      className: "text-nowrap",
      align: "",
      hideSortIcon: true,
    },
    {
      id: "Reply",
      title: "Ý kiến phản hồi",
      rowSpan: 2,
      colSpan: 1,
      className: "text-nowrap",
      align: "",
      hideSortIcon: true,
    },
  ],
];

function FeedbackComponent(props) {
  const { showLoading, templateId, planningName } = props;
  const classes = useStyles();

  const { register, handleSubmit, setValue } = useForm({
    mode: "all",
    reValidateMode: "onBlur",
  });

  //--- Filter
  const [filterSection, setFilterSection] = useState(null);
  const [data, setData] = useState(null);

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [tableHead, setTableHead] = useState(tableHeadDefault || []);
  const [tableBody, setTableBody] = useState([]);

  //--- Config table
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(Configs.DefaultPageSize);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [totalItemCount, setTotalItemCount] = useState(0);
  const [headCellLength, setHeadCellLength] = useState(
    tableHeadDefault[0].length
  );

  const [filterName, setFilterName] = useState("");
  const [filterPhoneNumber, setFilterPhoneNumber] = useState("");
  const [filterEmail, setFilterEmail] = useState("");

  const [dataExport, setDataExport] = useState();

  useEffect(() => {
    if (templateId > 0) {
      GetDetailFeedback();
    }
  }, [templateId]);

  const GetDetailFeedback = (
    _pageIndex = pageIndex,
    _pageSize = pageSize,
    _sortExpression = "",
    _name = "",
    _phoneNumber = "",
    _email = "",
    _templateId = templateId
  ) => {
    let isSort = false;

    showLoading(true);

    setPageIndex(_pageIndex === 0 ? 1 : _pageIndex);
    setPageSize(_pageSize);
    if (_sortExpression) {
      let _sortExpressionList = _sortExpression.split(" ");
      if (
        _sortExpressionList.length === 2 &&
        _sortExpressionList[0] &&
        _sortExpressionList[1]
      ) {
        setOrderBy(_sortExpressionList[0]);
        setOrder(_sortExpressionList[1]);
        isSort = true;
      } else {
        setOrderBy("");
        setOrder("asc");
      }
    } else {
      setOrderBy("");
      setOrder("asc");
    }
    setFilterName(_name);
    setFilterPhoneNumber(_phoneNumber);
    setFilterEmail(_email);

    consultTheCommunityAction
      .GetDetailFeedback(
        _templateId,
        _pageIndex === 0 ? 1 : _pageIndex,
        _pageSize,
        isSort ? _sortExpression : null,
        _name,
        _phoneNumber,
        _email
      )
      .then(
        (res) => {
          let _data = (res && res.content) || null;
          setDataExport(_data);
          if (_data) {
            if (_data) {
              let _questions = [];
              let _answers = [];

              if (_data.questions && _data.questions.length > 0) {
                _data.questions.map((question, questionIndex) => {
                  _questions.push({
                    ...question,
                    hideSortIcon: true,
                    title: `${questionIndex + 1}. ${question.title}`,
                    answers: [],
                    rowSpan: 1,
                    colSpan: question.haveAdditional
                      ? question.answers.length + 1
                      : question.answers.length,
                    className: "",
                    align: "center",
                  });
                  question.answers &&
                    question.answers.length > 0 &&
                    question.answers.map((answer) => {
                      _answers.push({
                        ...answer,
                        rowSpan: 1,
                        colSpan: 1,
                        className: "",
                        align: "center",
                        hideSortIcon: true,
                      });
                    });

                  if (question.haveAdditional) {
                    _answers.push({
                      id: question.id * -1,
                      order: 0,
                      title: "Ý kiến khác",
                      rowSpan: 1,
                      colSpan: 1,
                      className: "",
                      align: "center",
                      hideSortIcon: true,
                    });
                  }
                });

                setQuestions(_questions);
                setAnswers(_answers);
              }

              let _tableHead = [
                [
                  {
                    id: "Name",
                    title: "Họ và tên",
                    rowSpan: 2,
                    colSpan: 1,
                    className: "text-nowrap",
                    align: "",
                    hideSortIcon: false,
                  },
                  {
                    id: "Address",
                    title: "Địa chỉ",
                    rowSpan: 2,
                    colSpan: 1,
                    className: "text-nowrap",
                    align: "",
                    hideSortIcon: true,
                  },
                  {
                    id: "PhoneNo",
                    title: "Số điện thoại",
                    rowSpan: 2,
                    colSpan: 1,
                    className: "text-nowrap",
                    align: "",
                    hideSortIcon: true,
                  },
                  {
                    id: "Email",
                    title: "Email",
                    rowSpan: 2,
                    colSpan: 1,
                    className: "text-nowrap",
                    align: "",
                    hideSortIcon: true,
                  },
                  ..._questions,
                  {
                    id: "Reply",
                    title: "Ý kiến phản hồi",
                    rowSpan: 2,
                    colSpan: 1,
                    className: "text-nowrap",
                    align: "",
                    hideSortIcon: true,
                  },
                ],
              ];
              _tableHead.push(_answers);

              setTableHead(_tableHead);
              setTableBody(
                (_data.userAnswers && _data.userAnswers.items) || []
              );
              setTotalItemCount(
                (_data.userAnswers && _data.userAnswers.totalItemCount) || 0
              );
              setHeadCellLength(tableHeadDefault[0].length + _answers.length);
            }
          }
          setData(_data);
          showLoading(false);
        },
        (err) => {
          showLoading(false);
        }
      );
  };

  const onClearFilters = () => {
    handleCloseFilter();
    GetDetailFeedback();
  };

  const handleClickFilter = (event) => {
    setFilterSection(event.currentTarget);
  };

  const handleCloseFilter = () => {
    setFilterSection(null);
  };

  const onSubmitSearch = (_data) => {
    if (!_data) return;
    let _name = _data.name ? _data.name.trim() : "";
    let _phoneNumber = _data.phoneNumber ? _data.phoneNumber.trim() : "";
    let _email = _data.email ? _data.email.trim() : "";

    setValue("name", _name);
    setValue("phoneNumber", _phoneNumber);
    setValue("email", _email);

    handleCloseFilter();
    GetDetailFeedback(
      1,
      pageSize,
      `${orderBy} ${order}`,
      _name,
      _phoneNumber,
      _email
    );
  };

  const onExport = () => {
    showLoading(true);
    const params = {
      templateId: dataExport.formTemplateId,
      pageIndex: pageIndex,
      pageSize: pageSize,
    };
    consultTheCommunityAction
      .ExportConsultantList(params)
      .then((result) => {
        const blob = new Blob([result], {
          type: "application/*",
        });
        saveAs(
          blob,
          `Consultant_Community_Export_(${planningName})_(${moment(
            new Date()
          ).format("YYYY-MM-DD HH:mm:ss")}).xlsx`
        );
        showLoading(false);
      })
      .catch((error) => {
        showLoading(false);
      });
  };

  const openFilter = Boolean(filterSection);
  const idFilter = openFilter ? "popoverFilter" : undefined;

  return (
    <div className="feedback">
      <Card className={classes.root}>
        <CardHeader
          className="text-center text-uppercase font-weight-bold"
          disableTypography={true}
          title="Danh sách phản hồi ý kiến"
        ></CardHeader>
        <Divider></Divider>
        <CardContent>
          <div className="d-sm-flex align-items-center justify-content-between mb-3">
            <h1 className="h3 mb-0 text-gray-800">
              <Tooltip title="Tìm kiếm">
                <Fab
                  color="primary"
                  aria-label="filter"
                  size="small"
                  onClick={handleClickFilter}
                >
                  <FilterListIcon />
                </Fab>
              </Tooltip>

              <Tooltip title="Refresh">
                <Fab
                  color="primary"
                  aria-label="filter"
                  size="small"
                  className="ml-2"
                  onClick={onClearFilters}
                >
                  <RefreshIcon />
                </Fab>
              </Tooltip>

              <Tooltip title="Export">
                <img
                  src={require("../../../assets/icon/excel.svg")}
                  alt="Export"
                  className="ml-3 cursor-pointer"
                  onClick={onExport}
                  style={{
                    width: 26,
                    height: 26,
                  }}
                />
              </Tooltip>

              <Popover
                id={idFilter}
                open={openFilter}
                anchorEl={filterSection}
                onClose={handleCloseFilter}
                style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
              >
                <div className="p-3" style={{ width: "30rem" }}>
                  <div className="text-right border-bottom mb-3 pb-2">
                    <IconButton
                      aria-label="close"
                      size="small"
                      onClick={handleCloseFilter}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </div>
                  {openFilter && (
                    <form
                      key="formSearch"
                      id="formSearch"
                      onSubmit={handleSubmit(onSubmitSearch)}
                    >
                      <div className="form-group">
                        <label className="text-dark">Họ và tên</label>
                        <TextField
                          fullWidth
                          name="name"
                          defaultValue={filterName}
                          inputRef={register}
                        />
                      </div>
                      <div className="form-group">
                        <label className="text-dark">Số điện thoại</label>
                        <TextField
                          fullWidth
                          name="phoneNumber"
                          type="number"
                          onInput={(e) =>
                            (e.target.value = e.target.value.slice(0, 15))
                          }
                          defaultValue={filterPhoneNumber}
                          inputRef={register}
                        />
                      </div>
                      <div className="form-group">
                        <label className="text-dark">Email</label>
                        <TextField
                          fullWidth
                          name="email"
                          defaultValue={filterEmail}
                          inputRef={register}
                        />
                      </div>
                      <div className="border-top">
                        <div className="row">
                          <div className="col-12 text-right mt-3">
                            <Button
                              type="submit"
                              variant="contained"
                              color="primary"
                            >
                              <SearchIcon fontSize="small" /> Tìm kiếm
                            </Button>
                            <Button
                              type="button"
                              variant="contained"
                              className="ml-2"
                              onClick={onClearFilters}
                            >
                              <ClearAllIcon fontSize="small" /> Bỏ lọc
                            </Button>
                          </div>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              </Popover>
            </h1>
          </div>

          <ListFeedback
            data={data}
            callBack={GetDetailFeedback}
            pageIndex={pageIndex > 0 ? pageIndex - 1 : 0}
            setPageIndex={setPageIndex}
            pageSize={pageSize}
            setPageSize={setPageSize}
            order={order}
            setOrder={setOrder}
            orderBy={orderBy}
            setOrderBy={setOrderBy}
            totalItemCount={totalItemCount}
            answers={answers}
            tableHead={tableHead}
            tableBody={tableBody}
            headCellLength={headCellLength}
            showLoading={showLoading}
            consultTheCommunityAction={consultTheCommunityAction}
            planningName={planningName}
          />
        </CardContent>
      </Card>
    </div>
  );
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      showLoading: appActions.ShowLoading,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(FeedbackComponent);
