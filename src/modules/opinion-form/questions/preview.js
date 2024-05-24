/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";

import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

import { compareValues } from "../../../utils/configuration";

const ANSWER_TYPE = {
  RADIO: "RADIO",
  TEXT_BOX: "TEXT_BOX",
  CHECK_BOX: "CHECK_BOX",
  DROPDOWN: "DROPDOWN",
};

export default function PreviewComponent(props) {
  const questions = props.list.sort(compareValues("order"));

  if (questions === undefined || questions === null || questions.length === 0) {
    return null;
  }

  const renderAnswerInput = (_question) => {
    if (!_question) return null;

    switch (_question.answerType) {
      case ANSWER_TYPE.RADIO:
        if (!_question.answers || _question.answers.length === 0) return null;
        return (
          _question.answers &&
          _question.answers.length > 0 &&
          _question.answers.map((answerItem, answerIndex) => (
            <div
              key={`answerRadio_${_question.id}_${answerItem.id}`}
              className="form-check"
            >
              <input
                className="form-check-input"
                type="radio"
                name={`answer_${_question.id}_${answerItem.id}`}
                value={answerItem.id}
                defaultChecked={answerIndex === 0 ? true : false}
              />
              <label
                className="form-check-label"
                htmlFor={`answer_${_question.id}_${answerItem.id}`}
              >
                {answerItem.title}
              </label>
            </div>
          ))
        );
      case ANSWER_TYPE.TEXT_BOX:
        return (
          <div
            key={`answerTextBox_${_question.id}`}
            className="form-group w-100"
          >
            <input
              type="text"
              name={`answerTextBox_${_question.id}`}
              className="form-control"
            />
          </div>
        );
      case ANSWER_TYPE.CHECK_BOX:
        if (!_question.answers || _question.answers.length === 0) return null;
        return (
          _question.answers &&
          _question.answers.length > 0 &&
          _question.answers.map((answerItem, answerIndex) => (
            <div
              key={`answerCheckBox_${_question.id}_${answerItem.id}`}
              className="form-check"
            >
              <input
                className="form-check-input"
                type="checkbox"
                name={`answerCheckBox_${_question.id}_${answerItem.id}`}
              />
              <label
                className="form-check-label"
                htmlFor={`answerCheckBox_${_question.id}_${answerItem.id}`}
              >
                {answerItem.title}
              </label>
            </div>
          ))
        );
      case ANSWER_TYPE.DROPDOWN:
        if (!_question.answers || _question.answers.length === 0) return null;
        return (
          <div
            key={`answerDropdown_${_question.id}`}
            className="form-group w-100"
          >
            <Autocomplete
              name={`answerDropdown_${_question.id}`}
              options={_question.answers}
              getOptionLabel={(option) => option.title}
              renderInput={(params) => (
                <TextField {...params} variant="outlined" size="small" />
              )}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <b>A. THÔNG TIN CƠ QUAN, CÁ NHÂN ĐƯỢC XIN Ý KIẾN</b>
      <div className="row mt-3">
        <div className="col-12 col-sm-12 col-md-6 col-lg-6 form-group">
          <label htmlFor="name" className="font-weight-bold">
            Họ và tên (*)
          </label>
          <input type="text" name="fullName" className="form-control" />
        </div>

        <div className="col-12 col-sm-12 col-md-6 col-lg-6 form-group">
          <label className="font-weight-bold">Địa chỉ (*)</label>
          <input type="text" name="address" className="form-control" />
        </div>

        <div className="col-12 col-sm-12 col-md-6 col-lg-6 form-group">
          <label className="font-weight-bold">Số điện thoại</label>
          <input type="text" name="mobilePhone" className="form-control" />
        </div>

        <div className="col-12 col-sm-12 col-md-6 col-lg-6 form-group">
          <label className="font-weight-bold">Email</label>
          <input type="text" name="email" className="form-control" />
        </div>

        {questions.map((questionItem, questionIndex) => (
          <div key={`question_${questionItem.id}`} className="col-12">
            <label className="font-weight-bold">
              {`${questionIndex + 1}. ${questionItem.title}`}
            </label>

            <div className="d-flex justify-content-between">
              {renderAnswerInput(questionItem)}
            </div>

            {questionItem.haveAdditional &&
              questionItem.answerType !== ANSWER_TYPE.TEXT_BOX && (
                <div className="form-group">
                  <label className="font-weight-bold">Ý kiến khác</label>
                  <textarea
                    name={`haveAdditional_${questionItem.id}`}
                    rows={2}
                    className="form-control"
                  ></textarea>
                </div>
              )}
          </div>
        ))}
      </div>

      <button
        type="button"
        className="btn btn-success text-uppercase pl-5 pr-5"
      >
        Gửi ý kiến
      </button>
    </div>
  );
}
