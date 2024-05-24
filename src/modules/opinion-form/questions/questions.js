import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

//--- Material Control
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  IconButton,
  makeStyles,
  Switch,
  TextField,
  Typography,
} from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";

//--- Material Icons
import { Autocomplete } from "@material-ui/lab";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import DeleteIcon from "@material-ui/icons/Delete";
import OpenWithIcon from "@material-ui/icons/OpenWith";

import { compareValues } from "../../../utils/configuration";

import { Reorder } from "./utils";
import Answers from "./answer";

const useStyles = makeStyles((theme) => ({
  accordionSummary: {
    minHeight: "50px !important",
    borderBottom: "1px solid #e3e6f0",
    height: 50,
    paddingLeft: 0,
  },
  accordionHeading: {
    fontSize: theme.typography.pxToRem(18),
    fontWeight: theme.typography.fontWeightBold,
    marginTop: 2,
  },
}));

const ANSWER_TYPE = {
  RADIO: "RADIO",
  TEXT_BOX: "TEXT_BOX",
  CHECK_BOX: "CHECK_BOX",
  DROPDOWN: "DROPDOWN",
};

const QuestionsComponent = (props) => {
  const classes = useStyles();
  const questions = props.list.sort(compareValues("order"));
  const setQuestions = props.setList;

  const register = props.register;
  const errors = props.errors;

  const isEdit = props.isEdit || false;
  const isShowActionAddEdit =
    props.isShowActionAddEdit === null ||
    props.isShowActionAddEdit === undefined
      ? true
      : props.isShowActionAddEdit;

  //--- Answer type list
  const answerTypeList = [
    { title: "Radio", value: ANSWER_TYPE.RADIO },
    { title: "TextBox", value: ANSWER_TYPE.TEXT_BOX },
    { title: "CheckBox", value: ANSWER_TYPE.CHECK_BOX },
    { title: "Dropdown", value: ANSWER_TYPE.DROPDOWN },
  ];

  //--- Switch other
  const [switchOther, setSwitchOther] = useState({ haveAdditional: true });
  const handleChangeSwitchOther = (event, _questionId) => {
    setSwitchOther({
      ...switchOther,
      [event.target.name]: event.target.checked,
    });
    handleChangeAnotherIdea(event.target.checked, _questionId);
  };

  //Thêm câu hỏi
  // const handleAddQuestion = () => {
  //   //Nếu không có câu hỏi nào thì thêm 1 câu hỏi mặc định với id = 1
  //   if (questions.length === 0) {
  //     setQuestions([
  //       {
  //         id: 1,
  //         title: `Câu hỏi 1`,
  //         titleDefault: "Câu hỏi 1",
  //         order: 1,
  //         haveAdditional: true,
  //         answers: [
  //           {
  //             id: 1,
  //             title: "Nhập câu trả lời 1",
  //             titleDefault: "Câu trả lời 1",
  //             order: 1,
  //           },
  //         ],
  //       },
  //     ]);
  //     return;
  //   }

  //   //Nếu đã có câu hỏi --> tìm id lớn nhất trong danh sách câu hỏi để khởi tạo 1 câu hỏi mới với id là lớn nhất
  //   let arr = questions.sort(compareValues("id"));

  //   let index = arr.length > 0 ? arr[arr.length - 1].id + 1 : 1;
  //   let question = [
  //     {
  //       id: index,
  //       title: `Câu hỏi ${index}`,
  //       titleDefault: `Câu hỏi ${index}`,
  //       order: index,
  //       haveAdditional: true,
  //       answers: [
  //         {
  //           id: 1,
  //           title: "Nhập câu trả lời 1",
  //           titleDefault: "Câu trả lời 1",
  //           order: 1,
  //         },
  //       ],
  //     },
  //   ];
  //   setQuestions(questions.concat(question));
  // };

  //Xóa câu hỏi
  const handleDeleteQuestion = (_index = -1) => {
    if (_index === -1) return;
    if (questions.length === 1) {
      setQuestions([]);
      return;
    }

    let _questions = questions.splice(_index, 1);
    if (_questions.length !== 1) return;
    setQuestions(questions.filter((item) => item.id !== _questions[0].id));
  };

  //Thêm câu trả lời
  const handleAddAnswer = (_questionId = -1) => {
    console.log("_questionId",_questionId);
    if (_questionId === -1) return;

    let question = questions.find((item) => item.id === _questionId);
    if (!question) return;

    let arr = question.answers.sort(compareValues("id"));
    let index = arr.length > 0 ? arr[arr.length - 1].id + 1 : 1;
    let answer = [
      {
        id: index,
        title: `Nhập câu trả lời ${index}`,
        titleDefault: `Câu trả lời ${index}`,
        order: index,
      },
    ];

    question = {
      ...question,
      answers: question.answers.concat(answer),
    };

    let result = [
      ...questions.filter((item) => item.id !== _questionId),
      question,
    ];

    setQuestions(result.sort(compareValues("order")));
  };

  //Xóa câu trả lời
  const handleDeleteAnswer = (_questionId = -1, _index = -1) => {
    if (_questionId === -1 || _index === -1) return;

    let question = questions.find((item) => item.id === _questionId);
    if (!question || question.answers.length <= 1) return;

    let answer = question.answers.splice(_index, 1);
    if (answer.length !== 1) return;

    question = {
      ...question,
      answers: question.answers.filter((item) => item.id !== answer[0].id),
    };

    let result = [
      ...questions.filter((item) => item.id !== _questionId),
      question,
    ];

    setQuestions(result.sort(compareValues("order")));
  };

  //Thay đổi loại câu trả lời
  const handleChangeAnswerType = (_item = null, _questionId = -1) => {
    if (!_item || _questionId === -1) return;

    let question = questions.find((item) => item.id === _questionId);
    if (!question) return;

    question = {
      ...question,
      answerType: _item.value,
    };

    let result = [
      ...questions.filter((item) => item.id !== _questionId),
      question,
    ];

    setQuestions(result.sort(compareValues("order")));
  };

  //Ý kiến khác
  const handleChangeAnotherIdea = (_isAnotherIdea = null, _questionId = -1) => {
    if (_isAnotherIdea === null || _questionId === -1) return;

    let question = questions.find((item) => item.id === _questionId);
    if (!question) return;

    question = {
      ...question,
      haveAdditional: _isAnotherIdea,
    };

    let result = [
      ...questions.filter((item) => item.id !== _questionId),
      question,
    ];

    setQuestions(result.sort(compareValues("order")));
  };

  const onChangeDataQuestion = (
    _index = -1,
    _prototype = null,
    _data = null
  ) => {
    if (_index === -1 || _prototype === null || _data === null) return;

    const _questions = [...questions];

    _questions[_index][_prototype] = _data;

    setQuestions(_questions);
  };

  const onChangeDataAnswer = (
    _indexQuestion = -1,
    _indexAnswer = -1,
    _prototype = null,
    _data = null
  ) => {
    if (
      _indexQuestion === -1 ||
      _indexAnswer === -1 ||
      _prototype === null ||
      _data === null
    )
      return;

    const _questions = [...questions];

    _questions[_indexQuestion].answers[_indexAnswer][_prototype] = _data;

    setQuestions(_questions);
  };

  function onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    if (result.type === "QUESTIONS") {
      const _questions = Reorder(
        questions,
        result.source.index,
        result.destination.index
      );

      setQuestions(_questions);
    } else {
      const answers = Reorder(
        questions[parseInt(result.type, 10)].answers,
        result.source.index,
        result.destination.index
      );

      const _questions = JSON.parse(JSON.stringify(questions));

      _questions[result.type].answers = answers;

      setQuestions(_questions);
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={`droppable_question`} type={`QUESTIONS`}>
        {(provided, snapshot) => (
          <div ref={provided.innerRef}>
            {questions.map((question, index) => (
              <Draggable
                key={`question_${question.id}`}
                draggableId={`question_${question.id}`}
                index={index}
              >
                {(provided, snapshot) => (
                  <div>
                    <Accordion
                      defaultExpanded={index === 0 ? true : false}
                      elevation={2}
                      className="accordion-question-list mt-3"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        className={classes.accordionSummary}
                        style={{height:'auto'}}
                      >
                        <div className="d-flex align-items-center w-lg-75">
                          {questions.length > 1 && (
                            <IconButton
                              color="primary"
                              {...provided.dragHandleProps}
                              onClick={(event) => event.stopPropagation()}
                            >
                              <OpenWithIcon fontSize="small" />
                            </IconButton>
                          )}

                          <Typography
                            className={`text-truncate negate-text-truncate-mobile ${
                              classes.accordionHeading
                            } ${questions.length <= 1 ? "pl-3" : ""}`}
                          >
                            {question.title || question.titleDefault}
                          </Typography>
                        </div>

                        {isShowActionAddEdit && questions.length > 1 && (
                          <div className="text-right w-25">
                            <IconButton
                              color="secondary"
                              onClick={(event) => {
                                handleDeleteQuestion(index);
                                event.stopPropagation();
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </div>
                        )}
                      </AccordionSummary>
                      <AccordionDetails>
                        <div className="question-item w-100 mt-2">
                          <div className="form-group">
                            <TextField
                              fullWidth
                              name={`titleQuestion_${question.id}`}
                              variant="outlined"
                              size="small"
                              defaultValue={isEdit ? question.title : ""}
                              onChange={(event) =>
                                onChangeDataQuestion(
                                  index,
                                  "title",
                                  event.target.value
                                )
                              }
                              label="Nhập câu hỏi (*)"
                              inputRef={register({ required: true })}
                              error={
                                errors[`titleQuestion_${question.id}`] &&
                                errors[`titleQuestion_${question.id}`].type ===
                                  "required"
                              }
                            />
                            {errors[`titleQuestion_${question.id}`] && (
                              <span className="error">
                                Trường này là bắt buộc
                              </span>
                            )}
                          </div>

                          <div className="form-group row">
                            <div className="col-12 col-md-6 col-lg-6">
                              <Autocomplete
                                name={`answerType_${question.id}`}
                                disableClearable={true}
                                defaultValue={answerTypeList.find(
                                  (item) => item.value === question.answerType
                                )}
                                options={answerTypeList}
                                getOptionLabel={(option) => option.title}
                                getOptionSelected={(option) =>
                                  option.value === question.answerType
                                }
                                onChange={(event, value) =>
                                  handleChangeAnswerType(value, question.id)
                                }
                                disabled={!isShowActionAddEdit}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    variant="outlined"
                                    size="small"
                                    label="Chọn loại câu trả lời"
                                  />
                                )}
                              />
                            </div>
                            {question.answerType !== ANSWER_TYPE.TEXT_BOX && (
                              <div className="col-12 col-md-6 col-lg-6">
                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={question.haveAdditional}
                                      onChange={(event) =>
                                        handleChangeSwitchOther(
                                          event,
                                          question.id
                                        )
                                      }
                                      name={`haveAdditional_${question.id}`}
                                      color="primary"
                                      disabled={!isShowActionAddEdit}
                                    />
                                  }
                                  label="Ý kiến khác"
                                />
                              </div>
                            )}
                          </div>

                          {question.answerType !== ANSWER_TYPE.TEXT_BOX && (
                            <Divider />
                          )}

                          {question.answerType !== ANSWER_TYPE.TEXT_BOX && (
                            <div className="answer-body mt-3">
                              <h6 className="font-weight-bold">
                                <QuestionAnswerIcon
                                  className="mr-1 mt-n1"
                                  fontSize="small"
                                />
                                Danh sách câu trả lời
                              </h6>

                              <div className="form-group mt-3">
                                <Answers
                                  questionNum={index}
                                  question={question}
                                  handleAddAnswer={handleAddAnswer}
                                  handleDeleteAnswer={handleDeleteAnswer}
                                  onChangeDataAnswer={onChangeDataAnswer}
                                  isShowActionAddEdit={isShowActionAddEdit}
                                  register={register}
                                  errors={errors}
                                  isEdit={isEdit}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </AccordionDetails>
                    </Accordion>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default QuestionsComponent;
