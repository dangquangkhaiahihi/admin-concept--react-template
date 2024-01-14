import React, { useState, useEffect } from 'react';
import * as MaterialUi from '@material-ui/core';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useForm } from "react-hook-form";
import * as InitMapStore from '../../../../../redux/store/init-map/init-map.store';
import * as InitmapConfig from '../../../config/config';
import { WmsBaseLink, APIUrlDefault } from '../../../../../utils/configuration';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
    DialogActions,
    Button,
    TextField,
    DialogContent,
    DialogTitle,
    Dialog,
    makeStyles,
    Typography,
    IconButton,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import SaveIcon from "@material-ui/icons/Save";
import FileManagement from "../../../../../components/file_management/file_management";

let GlobalIdSetTimeOut = null

const useStyles = makeStyles((theme) => ({
    closeButton: {
        position: "absolute",
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
}));

function SettingDescription(props) {
    const classes = useStyles();

    const [files, setFiles] = useState([]);
    const [filesTemp, setFilesTemp] = useState([]);
    const [isShow, setShow] = useState(false);

    const { register} = useForm({
        mode: "all",
        reValidateMode: "onBlur",
    });

    useEffect(() => {
        setFiles(props.data?.files ? [props.data.files] : []);
    }, [])

    const onOpenSelectFile = () => {
        setShow(true);
        setFilesTemp(files);
    };

    const onCloseSelectFile = () => {
        setShow(false);
        setFiles(filesTemp);
    };

    const onSaveSelectFile = () => {
        setShow(false);
        if (files && files.length > 0) {
            props.setData({
                ...props.data,
                document_upload_id: files[0].fileId,
                files: files[0],
            });
        }
    };

    return (
        <div className='change-layer-data-source container-fluid'>
            <div className="col-12">
                <label className="text-dark">
                    Ảnh ghi chú bản đồ GeoTiff
                    </label>
                {!isShow &&
                    files &&
                    files.length > 0 &&
                    files.map((item) => (
                        <div key={item.fileName} style={{ width: "400px" }}>
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
                        inputRef={register({})}
                        type="hidden"
                        name="image"
                        value={
                            (files && files.length > 0 && files[0].fileName) || ""
                        }
                    />
                </div>
            </div>

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
                            <Typography component={'span'} variant="h6">Quản lý file</Typography>
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
    )
}

const mapStateToProps = state => ({
    //listDataSource: state.initMap.arrayDataSource
})

const mapDispatchToProps = dispatch => bindActionCreators({
    //GetListDataSource: InitMapStore.GetListDataSource
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SettingDescription)