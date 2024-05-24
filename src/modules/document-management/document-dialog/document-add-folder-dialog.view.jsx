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

function AddFolderDialog(props) {
    const classes = useStyles();
    const {
        openAddFolderDialog,
        onCloseAddOrEditDialog,
        currentItem,
        showLoading,
        ...other
    } = props;
    const { register, handleSubmit, errors } = useForm({
        mode: "all",
        reValidateMode: "onBlur",
    });

    const onSubmitCreateFolder = (data) => {
        if (!data || !currentItem) {
            return;
        }
        showLoading(true);
        props.CreateFolder({
            name: data.folderName,
            title: data.folderName,
            ordinal: 0,
            parentId: currentItem.id,
            planningId: currentItem.planningId,
            typeId: 0,
        }).then(res => {
            showLoading(false);
        })
            .finally(() => {
                showLoading(false);
            });
        onCloseAddOrEditDialog();
    }

    return (
         openAddFolderDialog && (
            <Dialog
                open={openAddFolderDialog}
                onClose={onCloseAddOrEditDialog}
                fullWidth={true}
                maxWidth="sm"
            >
                <DialogTitle disableTypography className="border-bottom">
                    <Typography variant="h6">Thêm thư mục</Typography>
                    <IconButton
                        aria-label="close"
                        className={classes.closeButton}
                        onClick={onCloseAddOrEditDialog}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <form
                    onSubmit={handleSubmit(onSubmitCreateFolder)}
                    autoComplete="off"
                >
                    <DialogContent className="pt-4 pb-4">
                        <TextField
                            fullWidth
                            type="text"
                            name="folderName"
                            placeholder="Nhập tên thư mục"
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

const mapStateToProps = state => ({
    currentItem: state.InitDocument.documentDetail,
    showLoading: appActions.ShowLoading,
})

const mapDispatchToProps = dispatch => bindActionCreators({
    CreateFolder: documentStore.CreateFolder,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(AddFolderDialog)