/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

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
    TextField,
} from "@material-ui/core";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";

//--- Material Icon
import SaveIcon from "@material-ui/icons/Save";
import CloseIcon from "@material-ui/icons/Close";

import * as contactAction from "../../../redux/store/contact/contact.store"
import ShowNotification from "../../../components/react-notifications/react-notifications";
import { NotificationMessageType } from "../../../utils/configuration";
import * as viVN from "../../../language/vi-VN.json";

const useStyles = makeStyles((theme) => ({
    closeButton: {
        position: "absolute",
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
}));

export default function ReplyEmailView(props) {
    const {
        isShow,
        setShow,
        userEmail,
        showLoading,
        isReplied,
        repliedContent,
        onHideModal,
        UserId
    } = props;
    const classes = useStyles();
    const [content, setContent] = useState();

    const { register, handleSubmit, errors, clearErrors, setError } = useForm({
        mode: "all",
        reValidateMode: "onBlur",
    });

    const onSubmit = (_data) => {
        if (!_data) return;
        const data = {
            userEmail: userEmail,
            subject: _data.subject,
            content: _data.content,
            UserId: UserId
        }
        showLoading(true);
        contactAction.ReplyUserContactByEmail(data).then((res) => {
            if (res && res.content) {
                ShowNotification("Gửi email trả lời thành công!", NotificationMessageType.Success);
                setShow();
                onHideModal();
            }
            showLoading(false);
        }).catch((err) => {
            showLoading(false);
            err && err.errorType && ShowNotification(viVN.Errors[err.errorType], NotificationMessageType.Error);
        })
    }

    const onChangeContent = (content) => {
        clearErrors(["content"]);
        if (content === "<p><br></p>") {
            setError("content", { type: "required" });
            setContent("");
        } else {
            clearErrors("content");
            setContent(content);
        }
    };


    return (
        <Dialog
            onClose={setShow}
            open={isShow}
            fullWidth={true}
            maxWidth="md"
            className="dialog-preview-form"
        >
            <DialogTitle disableTypography>
                <Typography variant="h6">
                    Trả lời email
          </Typography>

                <IconButton
                    aria-label="close"
                    className={classes.closeButton}
                    onClick={setShow}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <form className="add-opinion-form" onSubmit={handleSubmit(onSubmit)}>
                <DialogContent dividers>
                    <div className="form-group">
                        <div className="row">
                            <div className="col-12 col-md-6 col-lg-6">
                                <label className="text-dark">Người nhận</label>
                                <TextField
                                    type="text"
                                    name="userEmail"
                                    inputRef={register}
                                    className="w-100"
                                    value={userEmail}
                                    disabled={true}
                                />
                            </div>
                            <div className="col-12 col-md-6 col-lg-6">
                                <label className="text-dark">Tiêu đề</label>
                                <TextField
                                    type="text"
                                    name="subject"
                                    inputRef={register({ required: true })}
                                    className="w-100"
                                    color={"danger"}
                                    defaultValue={isReplied ? repliedContent.subject : ""}
                                    error={errors.subject && errors.subject.type === "required"}
                                    disabled={isReplied ? true : false}
                                />
                                {errors.subject && errors.subject.type === "required" && (
                                    <span className="error">Trường này là bắt buộc</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="text-dark">
                            Bài viết Công bố QH<span className="required"></span>
                        </label>
                        <SunEditor
                            enableToolbar={true}
                            showToolbar={true}
                            setContents={repliedContent.content}
                            setOptions={{
                                height: 500,
                                buttonList: [
                                    [
                                        "undo",
                                        "redo",
                                        "font",
                                        "fontSize",
                                        "formatBlock",
                                        "paragraphStyle",
                                        "blockquote",
                                        "bold",
                                        "underline",
                                        "italic",
                                        "strike",
                                        "subscript",
                                        "superscript",
                                        "fontColor",
                                        "hiliteColor",
                                        "textStyle",
                                        "removeFormat",
                                        "outdent",
                                        "indent",
                                        "align",
                                        "horizontalRule",
                                        "list",
                                        "lineHeight",
                                        "table",
                                        "link",
                                        "image",
                                        "video",
                                        "audio",
                                        "fullScreen",
                                        "showBlocks",
                                        "codeView",
                                    ],
                                ],
                            }}
                            onChange={onChangeContent}
                            disable={isReplied ? true : false}
                            onBlur={(event, editorContents) => onChangeContent(editorContents)}
                        />
                        <TextField
                            type="text"
                            inputRef={register({ required: true })}
                            name="content"
                            className="d-none"
                            value={content}
                        />
                        {errors.content && errors.content.type === "required" && (
                            <span className="error">Trường này là bắt buộc</span>
                        )}
                    </div>
                </DialogContent>
                {
                    !isReplied && (<DialogActions>
                        <Button
                            onClick={setShow}
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
                            Gửi
                </Button>

                    </DialogActions>)
                }

            </form>
        </Dialog>
    );
}


