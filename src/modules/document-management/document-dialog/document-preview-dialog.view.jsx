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
import * as config from "../../../utils/configuration";

const useStyles = makeStyles((theme) => ({
    root: {
        height: 264,
        flexGrow: 1,
        maxWidth: 400,
    },
    appBar: {
        position: "relative",
        backgroundColor: "#1075BD",
    },
    title: {
        marginLeft: theme.spacing(0),
        flex: 1,
    },
    closeButton: {
        position: "absolute",
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
}));

function DocumentPreviewView(props) {
    const classes = useStyles();
    const {
        onClosePreviewDialog,
        isShowPreviewDialog,
        currentItem,
        ...other
    } = props;
    const { register, handleSubmit, errors } = useForm({
        mode: "all",
        reValidateMode: "onBlur",
    });
    const mainHeight = window.innerHeight - 64;
    console.log(mainHeight);
    return (
        isShowPreviewDialog && (
            <Dialog
                fullScreen
                open={isShowPreviewDialog}
                onClose={onClosePreviewDialog}
                maxWidth="sm"
            >
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <Typography variant="h6" className={classes.title}>
                            { currentItem && (currentItem.title ? currentItem.title : currentItem.name)}
                        </Typography>
                        <Button color="inherit" onClick={onClosePreviewDialog}>
                            <CloseIcon />
                        </Button>
                    </Toolbar>
                </AppBar>
                <div className="container-fluid pl-0 pr-0">
                    
                </div>
                <div
                    className="col-12 col-md-9 col-lg-9 align-items-center"
                    style={{ minHeight: mainHeight, maxHeight: mainHeight, width: '100%' }}
                >
                    {currentItem ? (
                        <FileViewer
                            key={currentItem.id}
                            fileType={currentItem.extension.toLowerCase()}
                            filePath={config.APIUrlDefault + currentItem.path}
                        />
                    ) : (
                            <div className="mt-4 d-flex align-items-center justify-content-center">
                                <CancelPresentationIcon className="text-danger mr-1" /> Không có file để hiển thị
                            </div>
                        )}
                </div>
            </Dialog>
        )
    )
}

const mapStateToProps = state => ({
    currentItem: state.InitDocument.documentDetail,
})

const mapDispatchToProps = dispatch => bindActionCreators({
    CreateFolder: documentStore.CreateFolder,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(DocumentPreviewView)