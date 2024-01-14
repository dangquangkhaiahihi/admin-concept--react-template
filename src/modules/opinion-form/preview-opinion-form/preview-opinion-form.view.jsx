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
} from "@material-ui/core";

//--- Material Icons
import CloseIcon from "@material-ui/icons/Close";

import PreviewComponent from "../questions/preview";

import ShowNotification from "../../../components/react-notifications/react-notifications";
import { NotificationMessageType } from "../../../utils/configuration";
import * as viVN from "../../../language/vi-VN.json";
import * as opinionFormAction from "../../../redux/store/opinion-form/opinion-form.store";
import * as appActions from "../../../core/app.store";

import "./preview-opinion-form.scss";

function PreviewOpinionForm(props) {
  const { showLoading, dataItem } = props;
  const isShow = props.isShow;
  const onShow = props.onShow;

  const [data, setData] = useState(null);

  useEffect(() => {
    onGetData(dataItem);
  }, [dataItem]);

  const { register, errors, setValue } = useForm({
    mode: "all",
    reValidateMode: "onBlur",
  });

  const onGetData = (_dataItem) => {
    if (!_dataItem && _dataItem.id <= 0) return;

    showLoading(true);
    opinionFormAction.GetDetailFormTemplate(_dataItem.id).then(
      (res) => {
        if (!res || !res.content) {
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
          <DialogTitle>Preview form xin ý kiến</DialogTitle>
          <DialogContent dividers>
            <PreviewComponent
              list={data.questions}
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
          </DialogActions>
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

export default connect(mapStateToProps, mapDispatchToProps)(PreviewOpinionForm);
