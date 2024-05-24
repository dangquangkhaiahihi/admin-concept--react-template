/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

//--- Material Control
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  makeStyles,
  Typography,
  IconButton,
} from "@material-ui/core";

//--- Material Icon
import SaveIcon from "@material-ui/icons/Save";
import CloseIcon from "@material-ui/icons/Close";
import EditIcon from "@material-ui/icons/Edit";
import VisibilityIcon from "@material-ui/icons/Visibility";

import * as appActions from "../../../../core/app.store";
import * as opinionFormAction from "../../../../redux/store/opinion-form/opinion-form.store";

import PreviewFormTemplateComponent from "./preview-form.component";
import EditFormComponent from "./edit-form.component";

import ShowNotification from "../../../../components/react-notifications/react-notifications";
import { NotificationMessageType } from "../../../../utils/configuration";
import * as viVN from "../../../../language/vi-VN.json";

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

function FormTemplateView(props) {
  const {
    isLock,
    showLoading,
    isShow,
    setShow,
    formTemplateId,
    formTemplateModel,
    setFormTemplateModel,
    setFormTemplateStringModel,
    isShowActionAddEdit,
    setFormTitle,
    refreshForm,
    isAddForm
  } = props;
  const isCreateForm = props.isCreateForm || false;
  const classes = useStyles();

  const { register, handleSubmit, errors, setValue } = useForm({
    mode: "all",
    reValidateMode: "onBlur",
  });

  const [isPreviewForm, setShowPreviewForm] = useState(!isCreateForm);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (formTemplateModel) {
      setData(formTemplateModel);
    } else if (isCreateForm) {
      createDataDefaults();
    } else if (formTemplateId > 0) {
      onGetData(formTemplateId);
    }
  }, [formTemplateId]);
  useEffect(() => {
    console.log('lock',props)
  },[])
  const createDataDefaults = () => {
    let _resData = {
      consultantCommunityId: 0,
      id: 0,
      title: "",
      questions: [
        {
          id: 1,
          title: "Câu hỏi 1",
          titleDefault: "Câu hỏi 1",
          order: 1,
          haveAdditional: true,
          answerType: "RADIO",
          answers: [
            {
              id: 1,
              title: "Nhập câu trả lời 1",
              titleDefault: "Nhập câu trả lời 1",
              order: 1,
            },
          ],
        },
      ],
    };
    setData(_resData);
  };

  const onGetData = () => {
    showLoading(true);
    opinionFormAction.GetDetailFormTemplate(formTemplateId).then(
      (res) => {
        if (res && res.content) {
          let content = res.content;
          let _resData = {
            consultantCommunityId: content.consultantCommunityId,
            id: content.id,
            title: content.title,
            questions: content.questions.map((question) => {
              return {
                isEdit: !isShowActionAddEdit,
                id: question.id,
                title: question.title,
                titleDefault: `Câu hỏi ${question.order}`,
                order: question.order,
                haveAdditional: question.haveAdditional,
                answerType: question.answerType,
                answers: question.answers.map((answer) => {
                  return {
                    isEdit: !isShowActionAddEdit,
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
        } else {
          ShowNotification(
            viVN.Errors[(res && res.errorType) || "UnableHandleException"],
            NotificationMessageType.Error
          );
        }
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

  const handleClickShowPreviewForm = () => {
    setShowPreviewForm(true);
  };

  const handleClickHiddenPreviewForm = () => {
    setShowPreviewForm(false);
  };

  const onSubmit = (_data) => {
    if (!_data) return;
    console.log("questions", _data);
    setFormTitle(_data.formName);

    let questions = data.questions.map((question) => {
      let _question = {
        id: question.id,
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

    let questions1 = data.questions.map((question) => {
      let _question = {
        id: question.id,
        title: question.title,
        order: question.order,
        haveAdditional: question.haveAdditional,
        answerType: question.answerType,
        answers: question.answers.map((answer) => {
          let _answer = {
            title: answer.title,
            order: answer.order,
            id: answer.id
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
    let params1 = {
      consultantCommunityId: data.consultantCommunityId,
      id: data.id,
      title: _data.formName,
      questions: questions1,
    };

    setFormTemplateModel(params1);
    setFormTemplateStringModel(JSON.stringify(params));
    refreshForm();
    setShow();
  };

  return (
    <Dialog
      onClose={setShow}
      open={isShow}
      fullWidth={true}
      maxWidth="md"
      className="dialog-preview-form"
    >
      {!isLock && (
        <DialogTitle disableTypography>
        {isPreviewForm ? (
          <Typography variant="h6">
            Preview form ({(data && data.title) || ""})
            {
              isAddForm &&
              <Button
                variant="contained"
                className="ml-2 bg-success text-white"
                startIcon={<EditIcon />}
                onClick={handleClickHiddenPreviewForm}
              >
                Sửa form
              </Button>
            }
          </Typography>
        ) : (
            <Typography variant="h6">
              {isCreateForm ? "Tạo form" : "Sửa form"}
              <Button
                variant="contained"
                className="ml-2 bg-success text-white"
                startIcon={<VisibilityIcon />}
                onClick={handleClickShowPreviewForm}
              >
                Preview form
            </Button>
            </Typography>
          )}
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={setShow}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      )}
      
      <form className="add-opinion-form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          {isPreviewForm ? (
            <PreviewFormTemplateComponent
              formTemplateId={formTemplateId}
              data={data}
              setData={setData}
            />
          ) : (
              <EditFormComponent
                formTemplateId={formTemplateId}
                data={data}
                setData={setData}
                isShowActionAddEdit={isShowActionAddEdit}
                register={register}
                errors={errors}
                setValue={setValue}
              />
            )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={setShow}
            variant="contained"
            startIcon={<CloseIcon />}
          >
            Hủy
          </Button>
          {!isPreviewForm && (
            <Button
              type="submit"
              color="primary"
              variant="contained"
              startIcon={<SaveIcon />}
            >
              Lưu
            </Button>
          )}
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

export default connect(mapStateToProps, mapDispatchToProps)(FormTemplateView);
