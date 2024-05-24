/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ApiUrl } from '../../../api/api-url';
import { Tabs, Tab } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.css';
//--- Action
import * as planningSyncAction from "../../../redux/store/planning-sync/planning-sync.store";
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
import FileManagement from '../../../components/document-management/file_management';
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

function UploadBlueprint(props) {
    const classes = useStyles();

    const {
        isOpen,
        onClose,
        onSuccess,
        currentId,
        setOrder,
        setOrderBy,
        GetListAll,
        rowsPerPage,
        setStatus,
        setKeyword,
        order,
        orderBy,
        status,
        keyword
    } = props;

    const [model, setModel] = useState();

    const [banVeHienTrang, setBanVeHienTrang] = useState([]);
    const [BanVeHienTrangTemp, setBanVeHienTrangTemp] = useState([]);
    const [isShowBanVeHienTrang, setShowBanVeHienTrang] = useState(false);

    const [BanVeDinhHuongPhatTrienKhongGian, setBanVeDinhHuongPhatTrienKhongGian] = useState([]);
    const [BanVeDinhHuongPhatTrienKhongGianTemp, setBanVeDinhHuongPhatTrienKhongGianTemp] = useState([]);
    const [isShowBanVeDinhHuongPhatTrienKhongGian, setShowBanVeDinhHuongPhatTrienKhongGian] = useState(false);

    const [BanVeQuyHoachSuDungDat, setBanVeQuyHoachSuDungDat] = useState([]);
    const [BanVeQuyHoachSuDungDatTemp, setBanVeQuyHoachSuDungDatTemp] = useState([]);
    const [isShowBanVeQuyHoachSuDungDat, setShowBanVeQuyHoachSuDungDat] = useState(false);

    const [BanVeQuyHoachGiaoThong, setBanVeQuyHoachGiaoThong] = useState([]);
    const [BanVeQuyHoachGiaoThongTemp, setBanVeQuyHoachGiaoThongTemp] = useState([]);
    const [isShowBanVeQuyHoachGiaoThong, setShowBanVeQuyHoachGiaoThong] = useState(false);

    const [BanVeTongHopDuongDayDuongOng, setBanVeTongHopDuongDayDuongOng] = useState([]);
    const [BanVeTongHopDuongDayDuongOngTemp, setBanVeTongHopDuongDayDuongOngTemp] = useState([]);
    const [isShowBanVeTongHopDuongDayDuongOng, setShowBanVeTongHopDuongDayDuongOng] = useState(false);

    useEffect(() => {
        planningSyncAction
            .GetDetail(currentId)
            .then((res) => {
                if (res && res.content) {
                    setModel(res.content)
                    res.content.banVeHienTrangFiles && setBanVeHienTrang(res.content.banVeHienTrangFiles);
                    res.content.banVeDinhHuongPhatTrienKhongGianFiles && setBanVeDinhHuongPhatTrienKhongGian(res.content.banVeDinhHuongPhatTrienKhongGianFiles);
                    res.content.banVeQuyHoachGiaoThongFiles && setBanVeQuyHoachGiaoThong(res.content.banVeQuyHoachGiaoThongFiles);
                    res.content.banVeQuyHoachSuDungDatFiles && setBanVeQuyHoachSuDungDat(res.content.banVeQuyHoachSuDungDatFiles);
                    res.content.banVeTongHopDuongDayDuongOngFiles && setBanVeTongHopDuongDayDuongOng(res.content.banVeTongHopDuongDayDuongOngFiles);
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
        let params = {planningId: currentId}
        if (banVeHienTrang && banVeHienTrang.length > 0) 
            params = {...params,banVeHienTrang: banVeHienTrang};
        if (BanVeDinhHuongPhatTrienKhongGian && BanVeDinhHuongPhatTrienKhongGian.length > 0) 
            params = {...params,BanVeDinhHuongPhatTrienKhongGian: BanVeDinhHuongPhatTrienKhongGian};
        if (BanVeQuyHoachGiaoThong && BanVeQuyHoachGiaoThong.length > 0) 
            params = {...params,BanVeQuyHoachGiaoThong: BanVeQuyHoachGiaoThong};
        if (BanVeQuyHoachSuDungDat && BanVeQuyHoachSuDungDat.length > 0) 
            params = {...params,BanVeQuyHoachSuDungDat: BanVeQuyHoachSuDungDat};
        if (BanVeTongHopDuongDayDuongOng && BanVeTongHopDuongDayDuongOng.length > 0) 
            params = {...params,BanVeTongHopDuongDayDuongOng: BanVeTongHopDuongDayDuongOng};

        planningSyncAction
            .Update(params)
            .then((result) => {
                if (result.content.status) {
                    setOrderBy("modifiedDate");
                    setOrder("desc");      
                    ShowNotification(
                        "Cập nhật bản vẽ thành công",
                        NotificationMessageType.Success
                    );
                    GetListAll(
                        1,
                        rowsPerPage,
                        orderBy + " " + order,
                        keyword,
                        status,
                      );
                      onSuccess();
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

    const onOpenSelectFile = (type) => {
        switch(type){
            case 1 : 
                setShowBanVeHienTrang(true);
                setBanVeHienTrangTemp(banVeHienTrang);
                break;
            case 2 :
                setShowBanVeDinhHuongPhatTrienKhongGian(true);
                setBanVeDinhHuongPhatTrienKhongGianTemp(BanVeDinhHuongPhatTrienKhongGian);
                break;
            case 3 :
                setShowBanVeQuyHoachSuDungDat(true);
                setBanVeQuyHoachSuDungDatTemp(BanVeQuyHoachSuDungDat);     
                break;
            case 4 :
                setShowBanVeQuyHoachGiaoThong(true);
                setBanVeQuyHoachGiaoThongTemp(BanVeQuyHoachGiaoThong);
                break;
            case 5 :
                setShowBanVeTongHopDuongDayDuongOng(true);
                setBanVeTongHopDuongDayDuongOngTemp(BanVeTongHopDuongDayDuongOng);
                break;          
        }
    };

    const onCloseSelectFile = (type) => {
        switch(type){
            case 1 : 
                setShowBanVeHienTrang(false);
                setBanVeHienTrang(BanVeHienTrangTemp);
                break;
            case 2 :
                setShowBanVeDinhHuongPhatTrienKhongGian(false);
                setBanVeDinhHuongPhatTrienKhongGian(BanVeDinhHuongPhatTrienKhongGianTemp);
                break;
            case 3 :
                setShowBanVeQuyHoachSuDungDat(false);
                setBanVeQuyHoachSuDungDat(BanVeQuyHoachSuDungDatTemp);    
                break; 
            case 4 :
                setShowBanVeQuyHoachGiaoThong(false);
                setBanVeQuyHoachGiaoThong(BanVeQuyHoachGiaoThongTemp);
                break;
            case 5 :
                setShowBanVeTongHopDuongDayDuongOng(false);
                setBanVeTongHopDuongDayDuongOng(BanVeTongHopDuongDayDuongOngTemp); 
                break;         
        }
    };

    const onSaveSelectFile = (type) => {
        switch(type){
            case 1 : 
                setShowBanVeHienTrang(false);
                setBanVeHienTrang([...banVeHienTrang, ...BanVeHienTrangTemp]);
                break;
            case 2 :
                setShowBanVeDinhHuongPhatTrienKhongGian(false);
                setBanVeDinhHuongPhatTrienKhongGian([...BanVeDinhHuongPhatTrienKhongGian, ...BanVeDinhHuongPhatTrienKhongGianTemp]);
                break;
            case 3 :
                setShowBanVeQuyHoachSuDungDat(false);   
                setBanVeQuyHoachSuDungDat([...BanVeQuyHoachSuDungDat, ...BanVeQuyHoachSuDungDatTemp]);
                break;
            case 4 :
                setShowBanVeQuyHoachGiaoThong(false);
                setBanVeQuyHoachGiaoThong([...BanVeQuyHoachGiaoThong, ...BanVeQuyHoachGiaoThongTemp]);
                break;
            case 5 :
                setShowBanVeTongHopDuongDayDuongOng(false);      
                setBanVeTongHopDuongDayDuongOng([...BanVeTongHopDuongDayDuongOng, ...BanVeTongHopDuongDayDuongOngTemp]);
                break;  
        }
    };

    return (
        <div>
            <Dialog open={isOpen} onClose={onClose} fullWidth={true} maxWidth="xl">
                <DialogTitle disableTypography className="border-bottom">
                    <Typography variant="h6">Cập nhật bản vẽ quy hoạch</Typography>
                    <IconButton
                        aria-label="close"
                        className={classes.closeButton}
                        onClick={onClose}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                    {model && (
                        <DialogContent className="pt-4 pb-2">
                            <div className="form-group row">
                            <div className="col-12 pl-3">
                            <Tabs defaultActiveKey="home" id="uncontrolled-tab-example">
                                        <Tab eventKey="home" title="Bản vẽ hiện trạng">
                                            <RenderElementFile
                                                file={banVeHienTrang}
                                                setFile={setBanVeHienTrang}
                                                isShow={isShowBanVeHienTrang}
                                                type={1}
                                                onOpenSelectFile={onOpenSelectFile}
                                            >
                                            </RenderElementFile>
                                        </Tab>
                                        <Tab eventKey="profile" title="Bản vẽ định hướng phát triển không gian">
                                        <RenderElementFile
                                                file={BanVeDinhHuongPhatTrienKhongGian}
                                                setFile={setBanVeDinhHuongPhatTrienKhongGian}
                                                isShow={isShowBanVeDinhHuongPhatTrienKhongGian}
                                                type={2}
                                                onOpenSelectFile={onOpenSelectFile}
                                            >
                                            </RenderElementFile>
                                        </Tab>
                                        <Tab eventKey="contact1" title="Bản vẽ quy hoạch sử dụng đất">
                                        <RenderElementFile
                                                file={BanVeQuyHoachSuDungDat}
                                                setFile={setBanVeQuyHoachSuDungDat}
                                                isShow={isShowBanVeQuyHoachSuDungDat}
                                                type={3}
                                                onOpenSelectFile={onOpenSelectFile}
                                            >
                                            </RenderElementFile>
                                        </Tab>
                                        
                                        <Tab eventKey="contact2" title="Bản vẽ quy hoạch giao thông">
                                        <RenderElementFile
                                                file={BanVeQuyHoachGiaoThong}
                                                setFile={setBanVeQuyHoachGiaoThong}
                                                isShow={isShowBanVeQuyHoachGiaoThong}
                                                type={4}
                                                onOpenSelectFile={onOpenSelectFile}
                                            >
                                            </RenderElementFile>
                                        </Tab>
                                        <Tab eventKey="contact3" title="Bản vẽ tổng hợp đường ống">
                                        <RenderElementFile
                                                file={BanVeTongHopDuongDayDuongOng}
                                                setFile={setBanVeTongHopDuongDayDuongOng}
                                                isShow={isShowBanVeTongHopDuongDayDuongOng}
                                                type={5}
                                                onOpenSelectFile={onOpenSelectFile}
                                            >
                                            </RenderElementFile>
                                        </Tab>
                                    </Tabs>
                                </div>                          
                            </div>
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
            <RenderElementChooseFile
                file={banVeHienTrang}
                setFiles={setBanVeHienTrang}
                isShow={isShowBanVeHienTrang}
                type={1}
                planningId={currentId}
                onSaveSelectFile={onSaveSelectFile}
                onCloseSelectFile={onCloseSelectFile}
            ></RenderElementChooseFile>
            <RenderElementChooseFile
                file={BanVeDinhHuongPhatTrienKhongGian}
                setFiles={setBanVeDinhHuongPhatTrienKhongGian}
                isShow={isShowBanVeDinhHuongPhatTrienKhongGian}
                type={2}
                planningId={currentId}
                onSaveSelectFile={onSaveSelectFile}
                onCloseSelectFile={onCloseSelectFile}
            ></RenderElementChooseFile>
            <RenderElementChooseFile
                file={BanVeQuyHoachSuDungDat}
                setFiles={setBanVeQuyHoachSuDungDat}
                isShow={isShowBanVeQuyHoachSuDungDat}
                type={3}
                planningId={currentId}
                onSaveSelectFile={onSaveSelectFile}
                onCloseSelectFile={onCloseSelectFile}
            ></RenderElementChooseFile>
            <RenderElementChooseFile
                file={BanVeQuyHoachGiaoThong}
                setFiles={setBanVeQuyHoachGiaoThong}
                isShow={isShowBanVeQuyHoachGiaoThong}
                type={4}
                planningId={currentId}
                onSaveSelectFile={onSaveSelectFile}
                onCloseSelectFile={onCloseSelectFile}
            ></RenderElementChooseFile>
            <RenderElementChooseFile
                file={BanVeTongHopDuongDayDuongOng}
                setFiles={setBanVeTongHopDuongDayDuongOng}
                isShow={isShowBanVeTongHopDuongDayDuongOng}
                type={5}
                planningId={currentId}
                onSaveSelectFile={onSaveSelectFile}
                onCloseSelectFile={onCloseSelectFile}
            ></RenderElementChooseFile>
        </div>
    );
}
function RenderElementFile(props){
    const { file, setFile,isShow,type,onOpenSelectFile } = props;
    return (
        <div className="col-12">
        <label className="text-dark" style={{fontWeight:"bold"}}>
         
        </label>
        <div className="list__img d-flex flex-wrap mt-1">
        {!isShow &&
            file &&
            file.length > 0 &&
            file.map((item) => (
                <div key={item.fileName} className='file_item mr-3' style={{ width: "15.5%" }}>
                    <img
                        src={APIUrlDefault + item.filePreview}
                        //src={require("../../../../assets/icon/default.svg")}
                        alt={item.fileName}
                        title={item.fileName}
                        className="img-fluid mb-2"
                        style={{
                            width: "100%",
                            height: "130px",
                            maxWidth: "100%",
                            maxHeight: "100%",
                        }}
                    />
                    <p className="file_name" style={{textAlign:"center"}}>{item.fileName.length > 10 ? item.fileName : item.fileName.substring(0,10)}</p>
                    <p
                        className="close_x"
                        style={{marginTop:"10px"}}
                        onClick={() =>
                            setFile(file.filter(i => i !== item))
                        }
                    >
                        &#10005;
                    </p>
                </div>
            ))}
        </div>
        <div>
            <Button
                variant="contained"
                color="primary"
                onClick={()=>onOpenSelectFile(type)}
            >
                Chọn file
            </Button>
        </div>
    </div>
    )
}
function RenderElementChooseFile(props)
{
    const { file,setFiles,isShow,type,onSaveSelectFile,onCloseSelectFile, planningId,showLoading } = props;
    const classes = useStyles();
    return    isShow && (
        <Dialog
            onClose={()=>onCloseSelectFile(type)}
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
                    onClick={()=>onCloseSelectFile(type)}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <FileManagement
                    planningId={planningId}
                    showLoading={showLoading}
                    files={file}
                    isLock={false}
                    setFiles={setFiles}
                    multiple={false}
                    acceptedFiles={["jpeg", "png", "jpg"]}
                />
            </DialogContent>

            <DialogActions>
                <Button
                    type="button"
                    onClick={()=>onCloseSelectFile(type)}
                    variant="contained"
                    startIcon={<CloseIcon />}
                >
                    Hủy
                        </Button>
                {file && file.length > 0 && (
                    <Button
                        type="button"
                        color="primary"
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={()=>onSaveSelectFile(type)}
                    >
                        Lưu
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    )
}
const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            showLoading: appActions.ShowLoading,
        },
        dispatch
    );

export default connect(null, mapDispatchToProps)(UploadBlueprint);
