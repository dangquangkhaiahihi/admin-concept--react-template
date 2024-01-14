import React, { useEffect, useState } from 'react';
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { connect, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fade, withStyles } from '@material-ui/core/styles';
import {
    Breadcrumbs, Typography, Link, Divider, Paper,
    makeStyles,
    IconButton,
    Dialog,
    AppBar,
    Toolbar,
    Select,
    Button,
    TextField,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@material-ui/core";

import {
    NavigateNext as NavigateNextIcon,
    Home as HomeIcon,
    Folder as FolderIcon,
    FolderOpen as FolderOpenIcon
} from '@material-ui/icons';
import ShowNotification from "../../../components/react-notifications/react-notifications";
//--- Material Icon
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import CloseIcon from "@material-ui/icons/Close";
import SaveIcon from "@material-ui/icons/Save";
import AttachFile from "@material-ui/icons/AttachFile";
import Description from "@material-ui/icons/Description";
import PictureAsPdf from "@material-ui/icons/PictureAsPdf";
import CreateNewFolderIcon from "@material-ui/icons/CreateNewFolder";
import BorderColorIcon from "@material-ui/icons/BorderColor";
import DeleteIcon from "@material-ui/icons/Delete";
import InfoIcon from "@material-ui/icons/Info";
import CancelPresentationIcon from "@material-ui/icons/CancelPresentation";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";

import { TreeView, TreeItem } from '@material-ui/lab';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import {
    NotificationMessageType,
    Transition,
} from "../../../utils/configuration";
import FileInputComponent from "../../../components/file-input/file-input.view";
import * as configCommon from "../../../common/config";
import FileViewer from "react-file-viewer";

import * as documentStore from '../../../redux/store/document/document-management.store';
import * as appActions from "../../../core/app.store";
import DocumentListFileView from '../document-list-file/document-list-file.view'
import * as viVN from "../../../language/vi-VN.json";
import "../document-management.view.scss";

const useStyles = makeStyles((theme) => ({
    root: {
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
    closeButton: {
        position: "absolute",
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
}));

function EditFolderDialog(props) {
    const classes = useStyles();
    const {
        openEditFolderDialog,
        onCloseAddOrEditDialog,
        RenameDocument,
        currentItem,
        showLoading,
        GetLookupCommune,
        listDistrict,
        listCommune,
        ...other
    } = props;
    const { register, handleSubmit, errors } = useForm({
        mode: "all",
        reValidateMode: "onBlur",
    });
    const [districtId, setDistrictId] = useState();
    const [communeId, setCommuneId] = useState();

    const onSubmitEditFolder=(data) => {
        if (!data || !currentItem) {
            return;
        }
        showLoading(true);
        RenameDocument({
            title: data.Title,
            districtId: districtId ? districtId : currentItem.districtId,
            communeId: communeId ? communeId: currentItem.communeId,
            provinceId: null,
            documentId: currentItem.id,
            newDocumentName: data.folderName,
            type: currentItem.type === 0 ? 0 : 1,
            parentId: currentItem.parentId,
        })
            .then((res) => {
                showLoading(false);
            })
            .catch((err) => {
                showLoading(false);
            });
        onCloseAddOrEditDialog();
    }

    const handleChooseDistrict = (event) => {
        setDistrictId(event.target.value);
        GetLookupCommune(event.target.value);
    };

    const handleChooseCommune = (event) => {
        //setValue("districtId", event.target.value);
        setCommuneId(event.target.value);
    };
    
    return (
         openEditFolderDialog && currentItem && (
            <Dialog
                open={openEditFolderDialog}
                onClose={onCloseAddOrEditDialog}
                fullWidth={true}
                maxWidth="sm"
            >
                <DialogTitle disableTypography className="border-bottom">
                    <Typography variant="h6">Đổi tên {currentItem.name}</Typography>
                    <IconButton
                        aria-label="close"
                        className={classes.closeButton}
                        onClick={onCloseAddOrEditDialog}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <form onSubmit={handleSubmit(onSubmitEditFolder)} autoComplete="off">
                    <DialogContent className="pt-4 pb-4">
                        {
                            currentItem && currentItem.type !== 0 &&
                            <div className="row">
                                <div className="col-12 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label className="text-dark">
                                            Quận - huyện<span className="required"></span>
                                        </label>
                                        <Select
                                            fullWidth
                                            defaultValue={currentItem.districtId}
                                            onChange={handleChooseDistrict}
                                        >
                                            {listDistrict && listDistrict.length > 0 ? (
                                                listDistrict.map((item) => (
                                                    <MenuItem value={item.id}>{item.name}</MenuItem>
                                                ))
                                            ) : (
                                                    <MenuItem value="">Không có quận huyện nào</MenuItem>
                                                )}
                                        </Select>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label className="text-dark">
                                            Phường - xã<span className="required"></span>
                                        </label>
                                        <Select
                                            //disabled={currentItem && currentItem.districtId ? false : true}
                                            fullWidth
                                            defaultValue={currentItem.communeId}
                                            onChange={handleChooseCommune}
                                        >
                                            {listCommune && listCommune.length > 0 ? (
                                                listCommune.map((item) => (
                                                    <MenuItem value={item.id}>{item.name}</MenuItem>
                                                ))
                                            ) : (
                                                    <MenuItem value="">Không có phường - xã nào</MenuItem>
                                                )}
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        }
                        <TextField
                            fullWidth
                            type="text"
                            name="folderName"
                            placeholder="Nhập tên thư mục"
                            defaultValue={currentItem.name}
                            error={
                                errors.folderName && errors.folderName.type === "required"
                            }
                            inputRef={register({ required: true })}
                        />
                        {errors.folderName && errors.folderName.type === "required" && (
                            <span className="error">Trường này là bắt buộc</span>
                        )}
                    </DialogContent>

                    <DialogActions className="border-top">
                        <Button
                            onClick={onCloseAddOrEditDialog}
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
        )
    )
}

function AddFileDialog(props) {
    const classes = useStyles();
    const {
        openAddFileDialog,
        onCloseAddOrEditDialog,
        handleChangeFile,
        GetLookupCommune,
        CreateFile,
        currentItem,
        showLoading,
        listDistrict,
        listCommune,
        ...other
    } = props;
    const { register, handleSubmit, errors } = useForm({
        mode: "all",
        reValidateMode: "onBlur",
    });
    const [files, setFiles] = useState([]);
    const [districtId, setDistrictId] = useState();
    const [CommuneId, setCommuneId] = useState();

    const onChangeFiles = (files) => {
        setFiles(files);
        //props.handleChangeFile(files);
    }

    const handleChooseDistrict = (event) => {
        setDistrictId(event.target.value);
        GetLookupCommune(event.target.value);
    };

    const handleChooseCommune = (event) => {
        //setValue("districtId", event.target.value);
        setCommuneId(event.target.value);
    };

    const onSubmitCreateFile = () => {
        if (!currentItem || files.length === 0) return;

        showLoading(true);
        CreateFile({
            districtId: districtId,
            CommuneId: CommuneId,
            Ordinal: 0,
            ParentId: currentItem.id,
            planningId: currentItem.planningId,
            TypeId: 1,
            files: files,
        })
            .then((res) => {
                onCloseAddOrEditDialog();
                showLoading(false);
            })
            .catch((err) => {
                showLoading(false);
            });
    }

    return (openAddFileDialog && (
        <Dialog
            open={openAddFileDialog}
            onClose={onCloseAddOrEditDialog}
            fullWidth={true}
            maxWidth="md"
        >
            <DialogTitle disableTypography className="border-bottom">
                <Typography variant="h6">Thêm mới file</Typography>
                <IconButton
                    aria-label="close"
                    className={classes.closeButton}
                    onClick={onCloseAddOrEditDialog}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <form onSubmit={handleSubmit(onSubmitCreateFile)} autoComplete="off">
                <DialogContent className="pt-4 pb-4">
                    <div className="row">
                        <div className="col-12 col-md-4 col-lg-4">
                            <div className="form-group">
                                <label className="text-dark">
                                    Quận - huyện ban hành<span className="required"></span>
                                </label>
                                <Select
                                    fullWidth
                                    onChange={handleChooseDistrict}
                                >
                                    {listDistrict && listDistrict.length > 0 ? (
                                        listDistrict.map((item) => (
                                            <MenuItem value={item.id}>{item.name}</MenuItem>
                                        ))
                                    ) : (
                                            <MenuItem value="">Không có quận huyện nào</MenuItem>
                                        )}
                                </Select>
                            </div>
                        </div>
                        <div className="col-12 col-md-4 col-lg-4">
                            <div className="form-group">
                                <label className="text-dark">
                                    Phường - xã ban hành<span className="required"></span>
                                </label>
                                <Select
                                    disabled={districtId ? false : true}
                                    fullWidth
                                    onChange={handleChooseCommune}
                                >
                                    {listCommune && listCommune.length > 0 ? (
                                        listCommune.map((item) => (
                                            <MenuItem value={item.id}>{item.name}</MenuItem>
                                        ))
                                    ) : (
                                            <MenuItem value="">Không có phường - xã nào</MenuItem>
                                        )}
                                </Select>
                            </div>
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label className="text-dark">
                            Chọn file (File nhập vào nhỏ hơn 300MB)
                        </label>
                        <FileInputComponent
                            onChangeFiles={onChangeFiles}
                            maxFileSize={configCommon.Configs.fileDocument}
                            filesLimit={100}
                            sizePriority={true}
                            acceptedFiles={[
                                "doc",
                                "docx",
                                "ppt",
                                "pdf",
                                "xlsx",
                                "tif",
                                "dwg",
                                "dng",
                                "png",
                                "jpg",
                                "jpeg",
                                "xls",
                                "pptx"
                            ]}
                            placeholder="Chọn file"
                        />
                    </div>
                </DialogContent>

                <DialogActions className="border-top">
                    <Button
                        type="button"
                        onClick={onCloseAddOrEditDialog}
                        variant="contained"
                        startIcon={<CloseIcon />}
                    >
                        Hủy
              </Button>
                    {files.length > 0 && (
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
    )
    )
}

const mapStateToProps = state => ({
    InitDocument: state.InitDocument,
    currentItem: state.InitDocument.documentDetail,
    listDistrict: state.InitDocument.listDistrict,
    listCommune: state.InitDocument.listCommune,
    showLoading: appActions.ShowLoading,
})

const mapDispatchToProps = dispatch => bindActionCreators({
    DeleteFile: documentStore.DeleteFile,
    RenameDocument: documentStore.RenameDocument,
    CreateFile: documentStore.CreateFile,
    GetAllFolder: documentStore.GetAllFolder,
    GetLookupCommune: documentStore.GetLookupCommune,
}, dispatch)

//export { EditFolderDialog, AddFileDialog }
export default {
    EditFolderDialog: connect(mapStateToProps, mapDispatchToProps)(EditFolderDialog),
    AddFileDialog: connect(mapStateToProps, mapDispatchToProps)(AddFileDialog)
}