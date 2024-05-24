import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";

//--- Material Control
import { IconButton, TextField } from "@material-ui/core";

//--- Material Icons
import OpenWithIcon from "@material-ui/icons/OpenWith";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import AddCircleIcon from "@material-ui/icons/AddCircle";

import { compareValues } from "../../../utils/configuration";
import { useMediaQuery } from "react-responsive";

const Answers = (props) => {
  const { question, questionNum, isEdit, isShowActionAddEdit } = props;
  const answers = question.answers.sort(compareValues("order"));

  const register = props.register;
  const errors = props.errors;

  //media query
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });
  const isBigScreen = useMediaQuery({ query: "(min-width: 1824px)" });
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });
  const isRetina = useMediaQuery({ query: "(min-resolution: 2dppx)" });


  return (
    <Droppable
      droppableId={`droppable_answer_${question.id}`}
      type={`${questionNum}`}
    >
      {(provided, snapshot) => (
        <div ref={provided.innerRef}>
          {answers.map((answer, index) => {
            return (
              <Draggable
                key={`answer_${questionNum}_${answer.id}`}
                draggableId={`answer_${questionNum}_${index}`}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    className="row mt-2"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div className="col-lg-9 col-sm-12">
                      <div className="row align-items-center no-gutters">
                        {answers.length > 1 && (
                          <div className="col-1">
                            <IconButton
                              color="primary"
                              style={isTabletOrMobile ? {padding:0} : {}}
                              {...provided.dragHandleProps}
                            >
                              <OpenWithIcon fontSize="small" />
                            </IconButton>
                          </div>
                        )}
                        <div className="col-9">
                          <TextField
                            name={`titleAnswer_${questionNum}_${answer.id}`}
                            fullWidth
                            variant="outlined"
                            size="small"
                            label={answer.title + " (*)"}
                            defaultValue={isEdit ? answer.title : ""}
                            onChange={(event) =>
                              props.onChangeDataAnswer(
                                questionNum,
                                index,
                                "title",
                                event.target.value
                              )
                            }
                            inputRef={register({ required: true })}
                            error={
                              errors[
                              `titleAnswer_${questionNum}_${answer.id}`
                              ] &&
                              errors[`titleAnswer_${questionNum}_${answer.id}`]
                                .type === "required"
                            }
                          />
                          {errors[
                            `titleAnswer_${questionNum}_${answer.id}`
                          ] && (
                              <span className="error">
                                Trường này là bắt buộc
                              </span>
                            )}
                        </div>
                        {isShowActionAddEdit && answers.length > 1 && (
                          <div className="col-1">
                            <IconButton
                              color="secondary"
                              onClick={() =>
                                props.handleDeleteAnswer(question.id, index)
                              }
                              style={isTabletOrMobile ? {padding:0} : {}}
                            >
                              <HighlightOffIcon />
                            </IconButton>
                          </div>
                        )}
                        {isShowActionAddEdit && (
                          <div className="col-1">
                            <IconButton
                              onClick={() => props.handleAddAnswer(question.id)}
                              style={isTabletOrMobile ? {padding:0} : {}}
                            >
                              <AddCircleIcon className="text-success" />
                            </IconButton>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            );
          })}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default Answers;
