import React, { useState } from "react";
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

import "./add-opinion-form.scss";

function AddOpinionForm(props) {
  const { showLoading } = props;

  const isShow = props.isShow;
  const onShow = props.onShow;
  const callBack = props.callBack;

  const { register, handleSubmit, errors, setValue } = useForm({
    mode: "all",
    reValidateMode: "onBlur",
  });

  //Khởi tạo danh sách câu hỏi
  const [list, setList] = useState([
    {
      id: 1, //id câu hỏi
      title: "Câu hỏi 1", //Tiêu đề câu hỏi
      titleDefault: "Câu hỏi 1",
      order: 1, //Quy định vị trí của câu hỏi
      haveAdditional: true, //Ý kiến khác
      answerType: "RADIO", //Loại câu trả lời --> nếu là TEXT_BOX thì không quan tâm đến ý kiến khác
      answers: [
        //Danh sách câu trả lời
        {
          id: 1,
          title: "Nhập câu trả lời 1",
          titleDefault: "Nhập câu trả lời 1",
          order: 1,
        },
        // {
        //   id: 2,
        //   title: "Nhập câu trả lời 2",
        //   titleDefault: "Nhập câu trả lời 2",
        //   order: 2,
        // },
        // {
        //   id: 3,
        //   title: "Nhập câu trả lời 3",
        //   titleDefault: "Nhập câu trả lời 3",
        //   order: 3,
        // },
      ],
    },
    // {
    //   id: 2,
    //   title: "Câu hỏi 2",
    //   titleDefault: "Câu hỏi 2",
    //   order: 2,
    //   haveAdditional: true,
    //   answerType: "RADIO",
    //   answers: [
    //     {
    //       id: 1,
    //       title: "Nhập câu trả lời 1",
    //       titleDefault: "Nhập câu trả lời 1",
    //       order: 1,
    //     },
    //     {
    //       id: 2,
    //       title: "Nhập câu trả lời 2",
    //       titleDefault: "Nhập câu trả lời 2",
    //       order: 2,
    //     },
    //     {
    //       id: 3,
    //       title: "Nhập câu trả lời 3",
    //       titleDefault: "Nhập câu trả lời 3",
    //       order: 3,
    //     },
    //   ],
    // },
  ]);

  //Thêm câu hỏi
  const handleAddQuestion = () => {
    //Nếu không có câu hỏi nào thì thêm 1 câu hỏi mặc định với id = 1
    if (list.length === 0) {
      setList([
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
              titleDefault: "Nhập câu trả lời 1",
              order: 1,
            },
          ],
        },
      ]);
      return;
    }

    //Nếu đã có câu hỏi --> tìm id lớn nhất trong danh sách câu hỏi để khởi tạo 1 câu hỏi mới với id là lớn nhất
    let arr = list.sort(compareValues("id"));

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
            titleDefault: "Nhập câu trả lời 1",
            order: 1,
          },
        ],
      },
    ];
    setList(list.concat(question));
  };

  const onSubmit = (_data) => {
    if (!_data) return;

    let questions = list.map((question) => {
      return {
        title: question.title,
        order: question.order,
        haveAdditional: question.haveAdditional,
        answerType: question.answerType,
        answers: question.answers.map((answer) => {
          return {
            title: answer.title,
            order: answer.order,
          };
        }),
      };
    });

    let params = {
      title: _data.formName,
      questions: questions,
    };

    showLoading(true);
    opinionFormAction.CreateFormTemplate(params).then(
      (res) => {
        callBack && callBack();
        onShow && onShow(false);
        ShowNotification(
          viVN.Success.FormTemplateCreateSuccess,
          NotificationMessageType.Success
        );
      },
      (err) => {
        showLoading(false);
        //callBack && callBack();
        onShow && onShow(false);
        ShowNotification(
          err.errorMessage,
          NotificationMessageType.Error
        );
      }
    );
  };

  return (
    <Dialog
      onClose={() => {
        onShow && onShow(false);
      }}
      open={isShow}
      fullWidth={true}
      maxWidth="md"
    >
      <DialogTitle>Tạo form ý kiến</DialogTitle>
      <form className="add-opinion-form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <div className="form-group row">
            <div className="col-12 col-md-6 col-lg-6 mb-3">
              <TextField
                name="formName"
                type="text"
                fullWidth
                variant="outlined"
                size="small"
                label="Tên form (*)"
                inputRef={register({ required: true })}
                error={errors.formName && errors.formName.type === "required"}
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
            <div className="col-12 col-md-6 col-lg-6 mb-3">
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
            <div className="col-12 col-md-6 col-lg-6 mb-3">
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
            <div className="col-12 col-md-6 col-lg-6 mb-3">
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
            <div className="col-12 col-md-6 col-lg-6 mb-3">
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
            list={list}
            setList={setList}
            register={register}
            errors={errors}
            setValue={setValue}
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

export default connect(mapStateToProps, mapDispatchToProps)(AddOpinionForm);
