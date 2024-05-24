/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

//--- Material Control
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  TextField,
  Typography,
} from "@material-ui/core";

//--- Material Icons
import { AddCircle } from "@material-ui/icons";
import CloseIcon from "@material-ui/icons/Close";
import SaveIcon from "@material-ui/icons/Save";

import Questions from "../questions/questions";

import ShowNotification from "../../../components/react-notifications/react-notifications";
import { NotificationMessageType } from "../../../utils/configuration";
import * as viVN from "../../../language/vi-VN.json";
import * as opinionFormAction from "../../../redux/store/opinion-form/opinion-form.store";
import * as config from "../../../common/config";
import * as appActions from "../../../core/app.store";
import { compareValues } from "../../../utils/configuration";

import "./edit-opinion-form.scss";

function EditOpinionForm(props) {
  const { showLoading, dataItem } = props;

  const isShow = props.isShow;
  const onShow = props.onShow;
  const callBack = props.callBack;

  const [data, setData] = useState(null);

  useEffect(() => {
    onGetData(dataItem);
  }, [dataItem]);

  const { register, handleSubmit, errors, setValue } = useForm({
    mode: "all",
    reValidateMode: "onBlur",
  });

  const onGetData = (_dataItem) => {
    if (!_dataItem && _dataItem.id <= 0) return;

    showLoading(true);
    opinionFormAction.GetDetailFormTemplate(_dataItem.id).then(
      (res) => {
        if (!res || !res.content) {
          onShow && onShow(false);
          ShowNotification(
            viVN.Errors[(res && res.errorType) || "UnableHandleException"],
            NotificationMessageType.Error
          );
        }
        let content = res.content;
        let _resData = {
          consultantCommunityId: content.consultantCommunityId,
          id: content.id,
          title: content.title,
          questions: content.questions.map((question) => {
            return {
              isEdit: true,
              id: question.id,
              title: question.title,
              titleDefault: `Câu hỏi ${question.order}`,
              order: question.order,
              haveAdditional: question.haveAdditional,
              answerType: question.answerType,
              answers: question.answers.map((answer) => {
                return {
                  isEdit: true,
                  id: answer.id,
                  title: answer.title,
                  titleDefault: `Câu trả lời ${answer.order}`,
                  order: answer.order,
                };
              }),
            };
          }),
        };
        setData(_resData);
        showLoading(false);
      },
      (err) => {
        showLoading(false);
        ShowNotification(
          viVN.Errors[(err && err.errorType) || "UnableHandleException"],
          NotificationMessageType.Error
        );
      }
    );
  };

  //Thêm câu hỏi
  const handleAddQuestion = () => {
    //Nếu không có câu hỏi nào thì thêm 1 câu hỏi mặc định với id = 1
    if (data.questions.length === 0) {
      setData({
        ...data,
        questions: [
          {
            id: 1,
            title: `Câu hỏi 1`,
            titleDefault: "Câu hỏi 1",
            order: 1,
            haveAdditional: true,
            answers: [
              {
                id: 1,
                title: "Nhập câu trả lời 1",
                titleDefault: "Câu trả lời 1",
                order: 1,
              },
            ],
          },
        ],
      });
      return;
    }

    //Nếu đã có câu hỏi --> tìm id lớn nhất trong danh sách câu hỏi để khởi tạo 1 câu hỏi mới với id là lớn nhất
    let arr = data.questions.sort(compareValues("id"));

    let index = arr.length > 0 ? arr[arr.length - 1].id + 1 : 1;
    let question = [
      {
        id: index,
        title: `Câu hỏi ${index}`,
        titleDefault: `Câu hỏi ${index}`,
        order: index,
        haveAdditional: true,
        answers: [
          {
            id: 1,
            title: "Nhập câu trả lời 1",
            titleDefault: "Câu trả lời 1",
            order: 1,
          },
        ],
      },
    ];
    setData({
      ...data,
      questions: data.questions.concat(question),
    });
  };

  const onSubmit = (_data) => {
    if (!_data) return;

    let questions = data.questions.map((question) => {
      let _question = {
        title: question.title,
        order: question.order,
        haveAdditional: question.haveAdditional,
        answerType: question.answerType,
        answers: question.answers.map((answer) => {
          let _answer = {
            title: answer.title,
            order: answer.order,
          };

          if (answer.isEdit)
            _answer = {
              ..._answer,
              id: answer.id,
            };

          return _answer;
        }),
      };

      if (question.isEdit)
        _question = {
          ..._question,
          id: question.id,
        };

      return _question;
    });

    let params = {
      consultantCommunityId: data.consultantCommunityId,
      id: data.id,
      title: _data.formName,
      questions: questions,
    };

    showLoading(true);
    opinionFormAction.UpdateFormTemplate(params).then(
      (res) => {
        callBack && callBack();
        onShow && onShow(false);
        ShowNotification(
          viVN.Success.FormTemplateUpdateSuccess,
          NotificationMessageType.Success
        );
      },
      (err) => {
        showLoading(false);
        //callBack && callBack();
        onShow && onShow(false);
        ShowNotification(
          viVN.Errors[(err && err.errorType) || "UnableHandleException"],
          NotificationMessageType.Error
        );
      }
    );
  };

  return (
    <div>
      {data && (
        <Dialog
          onClose={() => {
            onShow && onShow(false);
          }}
          open={isShow}
          fullWidth={true}
          maxWidth="md"
        >
          <DialogTitle>Sửa form ý kiến</DialogTitle>
          <form className="add-opinion-form" onSubmit={handleSubmit(onSubmit)}>
            <DialogContent dividers>
              <div className="form-group row">
                <div className="col-12 col-md-6 col-lg-6">
                  <TextField
                    name="formName"
                    type="text"
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Tên form (*)"
                    defaultValue={data.title}
                    inputRef={register({ required: true })}
                    error={
                      errors.formName && errors.formName.type === "required"
                    }
                  />
                  {errors.formName && errors.formName.type === "required" && (
                    <span className="error">Trường này là bắt buộc</span>
                  )}
                </div>
              </div>

              <Divider />

              <Typography variant="h6" gutterBottom className="mt-2">
                A. Thông tin cá nhân, tổ chức được xin ý kiến
              </Typography>

              <div className="form-group row">
                <div className="col-12 col-md-6 col-lg-6">
                  <label className="text-dark">
                    Họ và tên<span className="required"></span>
                  </label>
                  <TextField
                    type="text"
                    fullWidth
                    variant="outlined"
                    size="small"
                    disabled
                    defaultValue="Họ và tên"
                  />
                </div>
                <div className="col-12 col-md-6 col-lg-6">
                  <label className="text-dark">
                    Địa chỉ<span className="required"></span>
                  </label>
                  <TextField
                    type="text"
                    fullWidth
                    variant="outlined"
                    size="small"
                    disabled
                    defaultValue="Địa chỉ"
                  />
                </div>
              </div>

              <div className="form-group row">
                <div className="col-12 col-md-6 col-lg-6">
                  <label className="text-dark">
                    Số điện thoại<span className="required"></span>
                  </label>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    disabled
                    defaultValue="Số điện thoại"
                  />
                </div>
                <div className="col-12 col-md-6 col-lg-6">
                  <label className="text-dark">
                    Email<span className="required"></span>
                  </label>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    disabled
                    defaultValue="Email"
                  />
                </div>
              </div>

              <Divider />

              <Typography variant="h6" gutterBottom className="mt-2">
                B. Nội dung xin ý kiến{" "}
                <Button
                  variant="contained"
                  className="ml-2"
                  color="primary"
                  startIcon={<AddCircle />}
                  onClick={handleAddQuestion}
                >
                  Thêm câu hỏi
                </Button>
              </Typography>

              <Questions
                list={data.questions}
                setList={(res) => setData({ ...data, questions: res })}
                register={register}
                errors={errors}
                setValue={setValue}
                isEdit={true}
              />
            </DialogContent>

            <DialogActions>
              <Button
                type="button"
                onClick={() => {
                  onShow && onShow(false);
                }}
                variant="contained"
                startIcon={<CloseIcon />}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                startIcon={<SaveIcon />}
              >
                Lưu
              </Button>
            </DialogActions>
          </form>
        </Dialog>
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

export default connect(mapStateToProps, mapDispatchToProps)(EditOpinionForm);
