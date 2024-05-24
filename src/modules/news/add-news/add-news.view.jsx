import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ApiUrl } from '../../../api/api-url';

//--- Styles
import "../news.scss";

//--- Material Control
import {
    DialogActions,
    Button,
    TextField,
    DialogContent,
    DialogTitle,
    Dialog,
    Typography,
    IconButton,
    makeStyles,
    Checkbox,
} from "@material-ui/core";

//--- Material Icon
import CloseIcon from "@material-ui/icons/Close";
import SaveIcon from "@material-ui/icons/Save";
import ShowNotification from "../../../components/react-notifications/react-notifications";
import { NotificationMessageType, APIUrlDefault, MaxSizeImageUpload, } from "../../../utils/configuration";
import * as viVN from "../../../language/vi-VN.json";
import SunEditor from "suneditor-react";
//import dialog from "suneditor/src/plugins/modules/dialog";
import "suneditor/dist/css/suneditor.min.css";

//--- Action
import * as newsAction from "../../../redux/store/news/news.store";
import FileManagement from "../../../components/file_management/file_management";

const useStyles = makeStyles((theme) => ({
    closeButton: {
        position: "absolute",
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    formControl: {
        margin: theme.spacing(1),
    },
}));

export default function AddNews(props) {
    const classes = useStyles();

    const {
        isOpen,
        onClose,
        onSuccess,
        GetListAll,
        rowsPerPage,
        setOrder,
        setOrderBy,
        isQHT, isQHCC, isQHHTKT
    } = props;

    const [status, setStatus] = useState(true);
    const [isHot, setIsHot] = useState(true);
    const [image_Url, setImage_Url] = useState("");
    const [content, setContent] = useState();
    const [isShow, setShow] = useState(false);
    const [files, setFiles] = useState([]);
    const [filesTemp, setFilesTemp] = useState([]);
    const urlUploadImage = APIUrlDefault + ApiUrl.UrlUploadFromEditor;

    const { register, handleSubmit, setError, errors, clearErrors, setValue } = useForm({
        mode: "all",
        reValidateMode: "onBlur",
    });

    const onChangeContent = (editorContent) => {
        clearErrors(["editorContent"]);
        if (editorContent === "<p><br></p>") {
            setError("editorContent", { type: "required" });
            setContent("");
        } else {
            clearErrors("editorContent");
            setContent(editorContent);
        }
    };

    const onSubmit = (data) => {
        if (!data) {
            return;
        }
        let formData = new FormData();
        data.title && formData.append("title", data.title);
        data.description && formData.append("description", data.description);
        //image_Url && formData.append("imageFile", image_Url);
        formData.append("content", content);
        formData.append("image_Url", "");
        formData.append("status", status ? 1 : 0);
        formData.append("isHot", isHot ? 1 : 0);
        formData.append("isFeature", 0);
        formData.append("isHomePage", 0);
        formData.append("categoryId", isQHT ? 1 : isQHHTKT ? 2 : 3);
        if (files && files.length > 0)
            formData.append("documentUploadId", files[0].fileId);
        // onSuccess();

        newsAction
            .CreateNews(formData)
            .then((result) => {
                if (result) {
                    setOrder("desc");
                    setOrderBy("modifiedDate");
                    GetListAll(undefined, undefined, undefined, undefined, undefined, undefined, 1, rowsPerPage, undefined);
                    onSuccess();
                    ShowNotification(
                        viVN.Success.NewsAddSuccess,
                        NotificationMessageType.Success
                    );
                }
            })
            .catch((err) => {
                onSuccess();
                err.errorMessage && ShowNotification(
                    err.errorMessage,
                    NotificationMessageType.Error
                )
            });
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
                    <Typography variant="h6">Thêm tin tức</Typography>
                    <IconButton
                        aria-label="close"
                        className={classes.closeButton}
                        onClick={onClose}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                    <DialogContent className="pt-4 pb-2">
                        <div className="form-group">
                            <label className="text-dark">
                                Tiêu đề<span className="required"></span>
                            </label>
                            <TextField
                                name="title"
                                error={
                                    errors.title &&
                                    (errors.title.type === "required" ||
                                        errors.title.type === "maxLength")
                                }
                                fullWidth
                                type="text"
                                className="form-control"
                                //inputProps={{ maxLength: 200 }}
                                inputRef={register({ required: true, maxLength: 150 })}
                                inputProps={{ maxLength: 150 }}
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
                                maxLength="500"
                                className={
                                    "form-control" +
                                    (errors.description && errors.description.type === "required"
                                        ? " is-invalid"
                                        : "")
                                }
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
                                onChange={onChangeContent}
                                onBlur={(event, editorContents) => onChangeContent(editorContents)}

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
                            //<div className="form-group">
                            //    <label className="text-dark">
                            //        Ảnh (Ảnh nhập vào nhỏ hơn 5MB)
                            //  </label>
                            //    <FileInputComponent
                            //        onChangeFiles={setImage_Url}
                            //        maxFileSize={5}
                            //        filesLimit={1}

                            //        acceptedFiles={["jpeg", "png", "jpg", "gif"]}
                            //    />
                            //    {/*register={register}
                            //    errors.fileInput && errors.fileInput.type === "required" && (
                            //    <span className="error">Trường này là bắt buộc</span>
                            //    )*/
                            //    }
                            //</div>
                        }
                    </DialogContent>

                    <DialogActions className="border-top">
                        <Button
                            type="submit"
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
