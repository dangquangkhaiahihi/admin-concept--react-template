import React, { useState } from 'react';
import PropTypes from "prop-types";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    Typography,
    makeStyles,
} from "@material-ui/core";

//--- Material Icon
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import CreateNewFolderIcon from "@material-ui/icons/CreateNewFolder";
import BorderColorIcon from "@material-ui/icons/BorderColor";
import DeleteIcon from "@material-ui/icons/Delete";

import { TreeItem } from '@material-ui/lab';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

import * as documentStore from '../../redux/store/document/document-management.store';
import * as appActions from "../../core/app.store";
import "./document-management.view.scss";
import FileManagement from "../../components/file_management/file_management";

/*StyledTreeItem*/
const useTreeItemStyles = makeStyles((theme) => ({
    root: {
        color: theme.palette.text.secondary,
        "&:hover > $content": {
            backgroundColor: theme.palette.action.hover,
        },
        "&:focus > $content, &$selected > $content": {
            backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
            color: "var(--tree-view-color)",
        },
        "&:focus > $content $label, &:hover > $content $label, &$selected > $content $label": {
            backgroundColor: "transparent",
        },
    },
    content: {
        color: theme.palette.text.secondary,
        paddingRight: theme.spacing(1),
        fontWeight: theme.typography.fontWeightMedium,
        "$expanded > &": {
            fontWeight: theme.typography.fontWeightRegular,
        },
    },
    group: {
        marginLeft: 7,
        paddingLeft: 10,
        "& $content": {
            paddingLeft: theme.spacing(2),
        },
    },
    expanded: {},
    selected: {},
    label: {
        fontWeight: "inherit",
        color: "inherit",
    },
    labelRoot: {
        display: "flex",
        alignItems: "center",
        padding: theme.spacing(0.5, 0),
    },
    labelIcon: {
        marginRight: theme.spacing(1),
    },
    labelText: {
        fontWeight: "inherit",
        flexGrow: 1,
    },
}));

function StyledTreeItem(props) {
    const classes = useTreeItemStyles();
    const {
        labelText,
        labelIcon: LabelIcon,
        labelInfo,
        color,
        bgColor,
        item,
        setDocument,
        setParentId,
        GetAllFileByFolder,
        setPage,
        rowsPerPage,
        ...other
    } = props;

    const handleItemClick = () => {
        if (item.isLoaded) return;
        setParentId(item.id);
        setPage(0);
        GetAllFileByFolder(item.id, 1, rowsPerPage);
    }

    return (
        <TreeItem
            onClick={() => {handleItemClick()
            }}
            label={
                <div className={classes.labelRoot}>
                    <LabelIcon color="inherit" className={classes.labelIcon} />
                    <Typography className={classes.labelText}>{labelText}</Typography>
                    <Typography variant="caption" color="inherit">
                        {labelInfo}
                    </Typography>
                </div>
            }
            style={{
                "--tree-view-color": color,
                "--tree-view-bg-color": bgColor,
            }}
            classes={{
                root: classes.root,
                content: classes.content,
                expanded: classes.expanded,
                selected: classes.selected,
                group: classes.group,
                label: classes.label,
            }}
            {...other}
        />
    );
}

StyledTreeItem.propTypes = {
    bgColor: PropTypes.string,
    color: PropTypes.string,
    labelIcon: PropTypes.elementType.isRequired,
    labelInfo: PropTypes.string,
    labelText: PropTypes.string.isRequired,
};
/*End StyledTreeItem */

const useStyles = makeStyles((theme) => ({
    root: {
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
    treeview: {
        fontSize: "0.85rem!important",
        //height: 264,
        flexGrow: 1,
        //maxWidth: 400,
    },
    paper: {
        height: 400,
        display: 'flex',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(1),
            width: theme.spacing(16),
            height: theme.spacing(16),
        },
    },
    closeButton: {
        position: "absolute",
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
}));

function IconFolder() {
    return (
        <img
            src={require("../../assets/icon/folder.svg")}
            alt="Folder"
            style={{ width: "16px", height: "16px", marginTop: "-2px" }}
            className="mr-2"
        />
    );
}

function FolderComponent(
    listData,
    onCreateFolder,
    onCreateFile,
    onEditItem,
    onDeleteItem,
    GetAllFileByFolder,
    setDocument,
    setParentId,
    setPage,
    rowsPerPage,
) {
    const itemList = listData && listData.length > 0 ? listData : [];
    return (
        <div>
            {itemList &&
                itemList.length > 0 &&
                itemList.map((item) => (
                    <div key={item.id}>
                        <ContextMenuTrigger id={`treeLevel-${item.id}`}>
                            {item.typeName === DOCUMENT_TYPE.FOLDER && (
                                <StyledTreeItem
                                    item={item}
                                    setDocument={setDocument}
                                    GetAllFileByFolder={GetAllFileByFolder}
                                    nodeId={`nodeId-${item.id}`}
                                    labelText={item.name}
                                    labelIcon={IconFolder}
                                    setParentId={setParentId}
                                    setPage={setPage}
                                    rowsPerPage={rowsPerPage}
                                >
                                    {item.childrent &&
                                        item.childrent.length > 0 &&
                                        FolderComponent(
                                            item.childrent,
                                            onCreateFolder,
                                            onCreateFile,
                                            onEditItem,
                                            onDeleteItem,
                                            GetAllFileByFolder,
                                            setDocument,
                                            setParentId,
                                            setPage,
                                            rowsPerPage,
                                        )}
                                    <div></div>
                                </StyledTreeItem>
                            )
                            }
                        </ContextMenuTrigger>

                        <ContextMenu id={`treeLevel-${item.id}`}>
                            
                            {item.typeName && item.typeName === DOCUMENT_TYPE.FOLDER && (
                                <div>
                                    <MenuItem data={item} onClick={onCreateFolder}>
                                        <CreateNewFolderIcon className="mr-2" /> Thư mục mới
                                    </MenuItem>
                                    <MenuItem data={item} onClick={onCreateFile}>
                                        <InsertDriveFileIcon className="mr-2" /> Thêm file
                                    </MenuItem>
                                </div>
                            )}
                            <MenuItem data={item} onClick={onEditItem}>
                                <BorderColorIcon className="mr-2" /> Đổi tên
                            </MenuItem>
                            <MenuItem data={item} onClick={onDeleteItem}>
                                <DeleteIcon className="mr-2" /> Xóa
                            </MenuItem>
                            <MenuItem divider />
                        </ContextMenu>
                    </div>
                ))}
        </div>
    );
}

const DOCUMENT_TYPE = {
    FOLDER: "Folder",
    FILE: "File",
};

function DocumentManagementView(props) {
    const [files, setFiles] = useState([]);
    return (
        <FileManagement
            files={files}
            setFiles={setFiles}
            isShowUi={1}
            acceptedFiles={["jpeg", "png", "jpg", "gif","xlsx","docx","pptx","pdf"]}
        />
        );
}
//function DocumentManagementView(props) {
//    //const [extend, setExtend] = useState([]);
//    useEffect(() => {
//        props.GetAllFolder();
//        props.GetLookupDistrict();
//    }, []);
    
//    const classes = useStyles();
//    const classTreeItem = useTreeItemStyles();
//    //use for treeview
//    const StyledTreeItem = withStyles((theme) => ({
//        iconContainer: {
//            '& .close': {
//                opacity: 0.3,
//            },
//        },
//        group: {
//            marginLeft: 7,
//            paddingLeft: 18,
//            borderLeft: `1px dashed ${fade(theme.palette.text.primary, 0.4)}`,
//        },
//    }))((props) => <TreeItem {...props} />);

//    //end use for treeview
//    const { register, handleSubmit, errors } = useForm({
//        mode: "all",
//        reValidateMode: "onBlur",
//    });

//    const [openAddFolderDialog, setOpenAddFolderDialog] = useState(false);
//    const [openAddFileDialog, setOpenAddFileDialog] = useState(false);
//    const [openEditFolderDialog, setOpenEditFolderDialog] = useState(false);
//    const [openDeleteFolderDialog, setOpenDeleteFolderDialog] = useState(false);
//    const [files, setFiles] = useState([]);
//    const [page, setPage] = useState(0);
//    const [rowsPerPage, setRowsPerPage] = useState(Configs.DefaultPageSize);

//    const [currentItem, setCurrentItem] = useState();
//    const [parentId, setParentId] = useState();

//    const handleClick = (id) => {
//        props.GetAllFileByFolder(id);
//    }
    
//    const setDocument = (event) => { }

//    function onCloseAddOrEditDialog() {
//        setCurrentItem(null);
//        setOpenAddFolderDialog(false);
//        setOpenAddFileDialog(false);
//        setOpenEditFolderDialog(false);
//        setOpenDeleteFolderDialog(false);

//        props.SaveCurrentData(null);
//    }

//    function onCreateFolder(event, data) {
//        props.SaveCurrentData(data);
//        setCurrentItem(data);
//        setOpenAddFolderDialog(true);
//    }

//    function onEditFolder(e, data) {
//        props.SaveCurrentData(data);
//        setCurrentItem(data);
//        setOpenEditFolderDialog(true);
//    }

//    function onEditFile(data) {
//        props.SaveCurrentData(data);
//        setCurrentItem(data);
//        setOpenEditFolderDialog(true);
//    }

//    const onDeleteFolder = (event, data) => {
//        props.SaveCurrentData(data);
//        setCurrentItem(data);
//        setOpenDeleteFolderDialog(true);
//    }
//    const onSuccessDeleteFolder=() =>{
//        if (!currentItem) {
//            return;
//        }
//        props.showLoading(true);
//        props.RemoveDocument(currentItem.id)
//            .then((res) => {
//                //if (res)
//                //    props.GetAllFolder();
//                props.showLoading(false);
//            })
//            .catch((err) => {
//                ShowNotification(
//                    viVN.Errors[(err && err.errorType) || "UnableHandleException"],
//                    NotificationMessageType.Error
//                );
//                props.showLoading(false);
//            });
//        onCloseAddOrEditDialog();
//    }

//    const handleChangeFile = (files) => {
//        setFiles(files);
//    }

//    const onCreateFile = (event, data) => {
//        props.SaveCurrentData(data);
//        setCurrentItem(data);
//        setOpenAddFileDialog(true);
//    }
    
//    return (

//        <div className="init-map-data-container h-100 container-fluid p-0 treeview">
//            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
//                <Link color="inherit" href="#" data="-1" onClick={() => handleClick(-1)} className={classes.link} >
//                    <HomeIcon className={classes.icon} /> Hồ sơ, văn bản
//                </Link>
//                {
//                    props.listBreadCrumbs.map((doc, index) => {
//                        return (
//                            <Link key={index} color="inherit" href="#" data={doc.id} onClick={() => handleClick(doc.id)}>
//                                <IconFolder />{doc.title}
//                            </Link>
//                            )
//                    })
//                }
//            </Breadcrumbs>
//            <Divider />
//            <div className="row">
//                <div className="col-12 col-md-4 col-lg-4">
//                    <Paper elevation={0} className="paper document-settings p-2 border-right h-100">
//                        <ContextMenuTrigger id="root-folder">
//                            <TreeView
//                                className={classes.treeview}
//                                defaultExpanded={["1"]}//props.listFolderIds
//                                defaultCollapseIcon={<KeyboardArrowDownIcon />}
//                                defaultExpandIcon={<KeyboardArrowRightIcon />}
//                                defaultEndIcon={<div style={{ width: 24 }} />}
//                            >
//                                <TreeItem nodeId="1"
//                                    label={
//                                        <div className={classTreeItem.labelRoot}>
//                                            <HomeIcon className={classTreeItem.labelIcon} color="text-primary" />
//                                            <Typography className={classTreeItem.labelText}>Hồ sơ, văn bản</Typography>
                                            
//                                        </div>
//                                    }
//                                    classes={{
//                                        root: classTreeItem.root,
//                                        content: classTreeItem.content,
//                                        expanded: classTreeItem.expanded,
//                                        selected: classTreeItem.selected,
//                                        group: classTreeItem.group,
//                                        label: classTreeItem.label,
//                                    }}
//                                >
//                                    {props.listAllFolder && props.listAllFolder.length > 0 ? (
//                                        FolderComponent(
//                                            props.listAllFolder,
//                                            onCreateFolder,
//                                            onCreateFile,
//                                            onEditFolder,
//                                            onDeleteFolder,
//                                            props.GetAllFileByFolder,
//                                            setDocument,
//                                            setParentId,
//                                            setPage,
//                                            rowsPerPage
//                                        )
//                                    ) : (
//                                            <div className="mt-3 d-flex align-items-center justify-content-center">
//                                                <InfoIcon className="text-info mr-1" /> Click chuột phải để tạo thư mục mới
//                                            </div>
//                                        )}
//                                </TreeItem>
                                
//                            </TreeView>

//                            <ContextMenu id="root-folder">
//                                <MenuItem data={{ parentId: null }} onClick={onCreateFolder}>
//                                    <CreateNewFolderIcon className="mr-2" /> Thư mục mới
//                                    </MenuItem>
//                            </ContextMenu>
//                        </ContextMenuTrigger>
//                    </Paper>
//                </div>
//                <div className="col-12 col-md-8 col-lg-8">
//                    <Paper elevation={0} style={{ overflowX: "hidden" }} className="paper">
//                        <DocumentListFileView
//                            editAction={onEditFile}
//                            page={page}
//                            rowsPerPage={rowsPerPage}
//                            setPage={setPage}
//                            setRowsPerPage={setRowsPerPage}
//                            parentId={parentId}
//                        />
//                    </Paper>
//                </div>
//            </div>
//            {
//                openAddFolderDialog && <AddFolderDialog
//                    openAddFolderDialog={openAddFolderDialog}
//                    onCloseAddOrEditDialog={onCloseAddOrEditDialog}
//                ></AddFolderDialog>
//            }
//            {
//                openEditFolderDialog && <Components.EditFolderDialog
//                    openEditFolderDialog={openEditFolderDialog}
//                    onCloseAddOrEditDialog={onCloseAddOrEditDialog}
//                    currentItem={currentItem}
//                ></Components.EditFolderDialog>
//            }
//            {
//                openAddFileDialog && <Components.AddFileDialog
//                    openAddFileDialog={openAddFileDialog}
//                    onCloseAddOrEditDialog={onCloseAddOrEditDialog}
//                    handleChangeFile={handleChangeFile}
//                    currentItem={currentItem}
//                ></Components.AddFileDialog>
//            }
//            {openDeleteFolderDialog && currentItem && (
//                <DeleteDialog
//                    isOpen={openDeleteFolderDialog}
//                    onClose={onCloseAddOrEditDialog}
//                    onSuccess={onSuccessDeleteFolder}
//                    header={"Xóa thư mục"}
//                    content={"Bạn có chắc chắn muốn xóa?"}
//                />
//            )}
//        </div>
//    )
//}

const mapStateToProps = state => ({
    InitDocument: state.InitDocument,
    listBreadCrumbs: state.InitDocument.listBreadCrumbs,
    listAllDocument: state.InitDocument.listAllDocument,
    listAllFolder: state.InitDocument.listAllFolder,
    listAllFile: state.InitDocument.listAllFile,
    listFolderIds: state.InitDocument.listFolderIds,
})

const mapDispatchToProps = dispatch => bindActionCreators({
    SaveCurrentData: documentStore.SaveCurrentData,
    RemoveDocument: documentStore.RemoveDocument,
    GetAllFolder: documentStore.GetAllFolder,
    GetAllFileByFolder: (parentId, pageIndex, pageSize) => documentStore.GetAllFileByFolder(parentId, pageIndex, pageSize),
    GetAllFileAndFolder: (parentId) => documentStore.GetAllFileAndFolder(parentId),
    GetLookupDistrict: documentStore.GetLookupDistrict,
    GetLookupCommune: documentStore.GetLookupCommune,
    showLoading: appActions.ShowLoading,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(DocumentManagementView)