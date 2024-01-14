/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ApiUrl } from '../../../api/api-url';

//--- Action
import * as newsAction from "../../../redux/store/news/news.store";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import * as viVN from "../../../language/vi-VN.json";

//--- Material Control
import {
    DialogActions,
    TextareaAutosize,
    Button,
    TextField,
    DialogContent,
    DialogTitle,
    Dialog,
    makeStyles,
    Typography,
    IconButton,
    Select,
    MenuItem,
    Checkbox,
} from "@material-ui/core";

//--- Material Icon
import CloseIcon from "@material-ui/icons/Close";
import SaveIcon from "@material-ui/icons/Save";

//--- Notifications
import FileInputComponent from "../../../components/file-input/file-input.view";
import ShowNotification from "../../../components/react-notifications/react-notifications";
import {
    NotificationMessageType,
    APIUrlDefault,
    MaxSizeImageUpload,
} from "../../../utils/configuration";
import * as appActions from "../../../core/app.store";
import FileManagement from "../../../components/file_management/file_management";
//--- Styles
import "../news.scss";

const useStyles = makeStyles((theme) => ({
    closeButton: {
        position: "absolute",
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
}));

function EditSlider(props) {
    const classes = useStyles();

    const {
        isOpen,
        onClose,
        onSuccess,
        newsId,
        setOrder,
        setOrderBy,
        GetListAll,
        rowsPerPage,
        isQHT, isQHCC, isQHHTKT
    } = props;

    const [newsModel, setNewsModel] = useState();
    const [status, setStatus] = useState(true);
    const [isHot, setIsHot] = useState(true);
    const [imageUrl, setImageUrl] = useState("");
    const [imageFile, setImageFile] = useState();
    const [content, setContent] = useState();
    const [isDelete, setIsDelete] = useState(false);
    const [isDeleteImage, setIsDeleteImage] = useState(false);
    //const [isHaveAvatar, setIsHaveAvatar] = useState(true);
    //const [avatarRequiredWarning, setAvatarRequiredWarning] = useState(false);
    const [isShow, setShow] = useState(false);
    const [files, setFiles] = useState([]);
    const [filesTemp, setFilesTemp] = useState([]);
    const urlUploadImage = APIUrlDefault + ApiUrl.UrlUploadFromEditor;

    useEffect(() => {
        newsAction
            .GetDetailNews(newsId)
            .then((res) => {
                if (res && res.content) {
                    console.log(res.content.image_Url)
                    if (res.content.image_Url && res.content.image_Url!="null")
                        res.content.image_Url = APIUrlDefault + res.content.image_Url;
                    setNewsModel(res.content);
                    setImageUrl(res.content.image_Url);
                    setStatus(res.content.status);
                    setIsHot(res.content.isHot);
                    setContent(res.content.content);
                    setFiles(res.content.files ? [res.content.files] : []);
                    //setIsHaveAvatar(res.content.image_Url);
                }
            })
            .catch((err) => console.log(err));
    }, []);

    const { register, handleSubmit, setError, errors, clearErrors, setValue } = useForm({
        mode: "all",
        reValidateMode: "onBlur",
    });

    const onSubmit = (data) => {
        if (!data) {
            return;
        }

        //if (!isHaveAvatar) {
        //    setAvatarRequiredWarning(true);
        //    return;
        //}

        let formData = new FormData();
        formData.append("id", newsId);
        formData.append("xmin", newsModel.xmin);
        data.title && formData.append("title", data.title);
        data.description && formData.append("description", data.description);
        //imageFile && formData.append("imageFile", imageFile);
        formData.append("content", content);
        formData.append("image_Url", imageUrl);
        formData.append("status", status ? 1 : 0);
        formData.append("isHot", isHot ? 1 : 0);
        formData.append("isDeleteImage", isDeleteImage ? 1 : 0);
        formData.append("isFeature", 0);
        formData.append("isHomePage", 0);
        formData.append("categoryId",  isQHT ? 1 : isQHHTKT ? 2 : 3);
        if (files && files.length > 0)
            formData.append("documentUploadId", files[0].fileId);

        newsAction
            .UpdateNews(formData)
            .then((result) => {
                if (result) {
                    setOrder("asc");
                    setOrderBy("order");
                    onSuccess();
                    
                    ShowNotification(
                        viVN.Success.NewsEditSuccess,
                        NotificationMessageType.Success
                    );
                    GetListAll(undefined, undefined, undefined, undefined, undefined, undefined, 1, rowsPerPage, undefined);
                }
            })
            .catch((err) => {
                onSuccess();
                ShowNotification(
                    err.errorMessage,
                    NotificationMessageType.Error
                );
            });
    };

    const handleChangeContent = (editorContent) => {
        clearErrors(["editorContent"]);
        if (editorContent === "<p><br></p>") {
            setError("editorContent", { type: "required" });
            setContent("");
        } else {
            clearErrors("editorContent");
            setContent(editorContent);
        }
    };

    const handleChangeStatus = (event) => {
        event.persist();
        setStatus(event.target.checked);
    }

    const handleChangeHot = (event) => {
        event.persist();
        setIsHot(event.target.checked);
    }

    const onOpenSelectFile = () => {
        setShow(true);
        setFilesTemp(files);
    };

    const onCloseSelectFile = () => {
        setShow(false);
        setFiles(filesTemp);
    };

    const onSaveSelectFile = () => {
        console.log(files);
        setShow(false);
    };

    return (
        <div>
            <Dialog open={isOpen} onClose={onClose} fullWidth={true} maxWidth="md">
                <DialogTitle disableTypography className="border-bottom">
                    <Typography variant="h6">Chỉnh sửa Tin tức</Typography>
                    <IconButton
                        aria-label="close"
                        className={classes.closeButton}
                        onClick={onClose}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                    {newsModel && (
                        <DialogContent className="pt-4 pb-2">
                            <div className="form-group">
                                <label className="text-dark">
                                    Tiêu đề<span className="required"></span>
                                </label>
                                <TextField
                                    inputRef={register({ required: true, maxLength: 150 })}
                                    name="title"
                                    error={errors.title && errors.title.type === "required"}
                                    fullWidth
                                    type="text"
                                    className="form-control"
                                    inputProps={{ maxLength: 150 }}
                                    defaultValue={newsModel.title}
                                    onChange={(e) =>
                                        setValue("title", e.target.value)
                                    }
                                />
                                {errors.title && errors.title.type === "required" && (
                                    <span className="error">Trường này là bắt buộc</span>
                                )}
                                {errors.title && errors.title.type === "maxLength" && (
                                    <span className="error">Trường này không quá 150 ký tự</span>
                                )}
                            </div>
                            <div className="form-group">
                                <label className="text-dark">Tóm tắt<span className="required"></span></label>
                                <textarea
                                    name="description"
                                    rows="5"
                                    ref={register({ required: true, maxLength: 500 })}
                                    className={
                                        "form-control" +
                                        (errors.description && errors.description.type === "required"
                                            ? " is-invalid"
                                            : "")
                                    }
                                    maxLength="500"
                                    defaultValue={newsModel.description}
                                ></textarea>
                                {errors.description && errors.description.type === "required" && (
                                    <span className="error">Trường này là bắt buộc</span>
                                )}
                                {errors.description && errors.description.type === "maxLength" && (
                                    <span className="error">Trường này không quá 500 ký tự</span>
                                )}

                            </div>

                            <div className="form-group">
                                <label className="text-dark">Nội dung</label>
                                <SunEditor
                                    enableToolbar={true}
                                    showToolbar={true}
                                    setContents={newsModel.content}
                                    videoFileInput={false}
                                    setOptions={{
                                        height: 500,
                                        imageUploadUrl: urlUploadImage,
                                        imageUploadSizeLimit: MaxSizeImageUpload,
                                        imageAccept: '.jpg,.jpeg,.png,.gift,.svg,.tif',
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
                                    onChange={handleChangeContent}
                                    onBlur={(event, editorContents) => handleChangeContent(editorContents)}
                                />
                            </div>
                            <div className="form-group">
                                <div className="row">
                                    <div className="col-12 col-md-4 col-lg-4">
                                        <label className="text-dark">Kích hoạt</label>
                                        <Checkbox
                                            checked={status}
                                            onChange={handleChangeStatus}
                                            color="primary"
                                            inputProps={{ "aria-label": "secondary checkbox" }}
                                            className="p-0 mt-0 ml-4"
                                        />
                                    </div>
                                    <div className="col-12 col-md-4 col-lg-4">
                                        <label className="text-dark">Tin nóng</label>
                                        <Checkbox
                                            checked={isHot}
                                            onChange={handleChangeHot}
                                            color="primary"
                                            inputProps={{ "aria-label": "secondary checkbox" }}
                                            className="p-0 mt-0 ml-4"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="form-group row">
                                <div className="col-12">
                                    <label className="text-dark">
                                        Ảnh<span className="required"></span>
                                    </label>
                                    {!isShow &&
                                        files &&
                                        files.length > 0 &&
                                        files.map((item) => (
                                            <div key={item.fileName} style={{ width: "150px" }}>
                                                <img
                                                    src={APIUrlDefault + item.filePreview}
                                                    alt={item.fileName}
                                                    className="img-fluid mb-2"
                                                    style={{
                                                        width: "auto",
                                                        height: "auto",
                                                        maxWidth: "100%",
                                                        maxHeight: "100%",
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    <div>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={onOpenSelectFile}
                                        >
                                            Chọn file
                                </Button>
                                        <TextField
                                            inputRef={register({ required: true })}
                                            type="hidden"
                                            name="image"
                                            value={
                                                (files && files.length > 0 && files[0].fileName) || ""
                                            }
                                        />
                                        {errors.image && errors.image.type === "required" && (
                                            <p className="error">Trường này là bắt buộc</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {
                //            <div className="form-group">
                //                <label className="text-dark">
                //                    Ảnh<span className="required"></span> (Ảnh nhập vào nhỏ hơn
                //  5MB)
                //</label>
                //                <FileInputComponent
                //                    onChangeFiles={setImageFile}
                //                    onDeleteFiles={(e) => setIsDeleteImage(e ? true : false)}
                //                    maxFileSize={5}
                //                    filesLimit={1}
                //                    //register={register}
                //                    acceptedFiles={["jpeg", "png", "jpg", "gif"]}
                //                    initialFiles={[newsModel.image_Url]}
                //                />
                //            </div>
                            }
                        </DialogContent>
                    )}

                    <DialogActions className="border-top">
                        <Button
                            type="button"
                            onClick={onClose}
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

            {
                isShow && (
                    <Dialog
                        onClose={onCloseSelectFile}
                        open={isShow}
                        fullWidth={true}
                        maxWidth="md"
                        className="dialog-preview-form"
                    >
                        <DialogTitle disableTypography>
                            <Typography variant="h6">Quản lý file</Typography>
                            <IconButton
                                aria-label="close"
                                className={classes.closeButton}
                                onClick={onCloseSelectFile}
                            >
                                <CloseIcon />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent dividers>
                            <FileManagement
                                files={files}
                                setFiles={setFiles}
                                acceptedFiles={["jpeg", "png", "jpg", "gif"]}
                            />
                        </DialogContent>

                        <DialogActions>
                            <Button
                                type="button"
                                onClick={onCloseSelectFile}
                                variant="contained"
                                startIcon={<CloseIcon />}
                            >
                                Hủy
                                    </Button>
                            {files && files.length > 0 && (
                                <Button
                                    type="button"
                                    color="primary"
                                    variant="contained"
                                    startIcon={<SaveIcon />}
                                    onClick={onSaveSelectFile}
                                >
                                    Lưu
                                </Button>
                            )}
                        </DialogActions>
                    </Dialog>
                )
            }
        </div>
    );
}
const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            showLoading: appActions.ShowLoading,
        },
        dispatch
    );

export default connect(null, mapDispatchToProps)(EditSlider);
