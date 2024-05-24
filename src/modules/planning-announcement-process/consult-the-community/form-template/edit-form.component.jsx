/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";

//--- Material Control
import { Button, Divider, TextField, Typography } from "@material-ui/core";

//--- Material Icons
import { AddCircle } from "@material-ui/icons";

import Questions from "../../../opinion-form/questions/questions";

import { compareValues } from "../../../../utils/configuration";

function EditFormComponent(props) {
  const {
    data,
    setData,
    register,
    errors,
    setValue,
    isShowActionAddEdit,
  } = props;

  const handleAddQuestion = () => {
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

  return (
    <div>
      {data && (
        <div className="add-opinion-form">
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
            {isShowActionAddEdit && (
              <Button
                variant="contained"
                className="ml-2"
                color="primary"
                startIcon={<AddCircle />}
                onClick={handleAddQuestion}
              >
                Thêm câu hỏi
              </Button>
            )}
          </Typography>

          <Questions
            list={data.questions}
            setList={(res) => setData({ ...data, questions: res })}
            isShowActionAddEdit={isShowActionAddEdit}
            register={register}
            errors={errors}
            setValue={setValue}
            isEdit={true}
          />
        </div>
      )}
    </div>
  );
}

export default EditFormComponent;
