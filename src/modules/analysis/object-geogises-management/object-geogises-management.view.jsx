import React, { useState, useEffect, useCallback, useRef } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Configs } from "../../../common/config";
import PictureAsPdf from "@material-ui/icons/PictureAsPdf";
import Photo from "@material-ui/icons/Photo"
import ArrowDownwardOutlined from "@material-ui/icons/ArrowDownwardOutlined";
import BarChart from "@material-ui/icons/BarChart";

import ListAnalysis from "./list-object-geogises/list-object-geogises.view.jsx";
import * as appActions from "../../../core/app.store";
import * as objectGeogisesAction from "../../../redux/store/object-geogises/object-geogises.store";
import SearchObjectsGeogies from "./search-object-geogises/search-object-geogises";
import { makeStyles } from "@material-ui/core/styles";
import ModalChartObjectGeogises from "./modal-chart-object-geogises/modal-chart-object-geogises";
import { Box, Popper } from "@material-ui/core";
import * as htmlToImage from 'html-to-image';
import * as download from 'downloadjs';
import { generatePDF } from "../../../common/generatePDF";
import { NotificationMessageType } from "../../../utils/configuration";
import ShowNotification from "../../../components/react-notifications/react-notifications";
import { useMediaQuery } from "react-responsive";
import ViewFileDialog from "../../../components/dialog-view-file/dialog-view-file.view";

const useStyles = makeStyles((theme) => ({
  popover: {
    maxHeight: "300px",
  },
  box: {
    minWidth: "15rem",
  },
  positionRelative: {
    position: "relative",
    '@media (max-width: 1224px)': {
      top:'-15px',
    }
  },
  btnGroupWrapper: {
    paddingBottom: '30px',
    display: 'flex',
    justifyContent: 'start',
    gap: '10px',
  },
  mr05: {
    marginRight: 5,
  },
  disNone: {
    display: "none",
  },
  popupButtonGroup: {
    border: 'solid 1px',
    borderRadius: '6px',
    background: 'white',
    color:'black',
    bottom: 0,
    right: '-70px',
  }
}));

const ObjectGeogises = (props) => {
  const classes = useStyles();
  const componentTargerExport = useRef(null);

  const { showLoading } = props;
  const [openChart, setOpenChart] = useState(false);
  const [page, setPage] = useState(0);
  const [data, setData] = useState([]);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("modifiedDate");
  const [totalItemCount, setTotalItemCount] = useState();
  const [rowsPerPage, setRowsPerPage] = useState(Configs.DefaultPageSize);

  const [typeSelected, setTypeSelected] = useState(null);
  const [objectTypeSelected, setObjectTypeSelected] = useState(null);

  const [currentObjectType, setCurrentObjectType] = useState('dat');

  const [objectKindSelected, setObjectKindSelected] = useState(null);
  const [districtSelected, setDistrictSelected] = useState(null);
  const [yearSelected, setYearSelected] = useState(null);

  const [loader, setLoader] = useState(false);

  const [openViewFileDialog, setOpenViewFileDialog] = useState(false);
  const [fileType, setFileType] = useState('');
  const [filePath, setFilePath] = useState('');
  const [header, setHeader] = useState('');

  const getData = useCallback(async () => {
    
    try {
      await GetListAll();
      showLoading(false);
    } catch (error) {
      
    }
  }, [showLoading]);

  // useEffect(() => {
  //   getData();
  // }, [getData]);

  const GetListAll = async (
    pageIndex = 1,
    pageSize,
    sort,
    Year,
    PlanningTypeId,
    ObjType = currentObjectType,
    ObjKind,
    DistrictId 
  ) => {
    setPage(pageIndex - 1);
    showLoading(true);
    try {
      const res = await objectGeogisesAction.GetStatisticsOfObjects(
        pageIndex,
        pageSize,
        sort,
        Year,
        PlanningTypeId,
        ObjType,
        ObjKind,
        DistrictId 
      );
      if (res && res.content) {
        setData(res.content.items);
        setTotalItemCount(res.content.totalItemCount);
      }
      setCurrentObjectType(ObjType);
      showLoading(false);
    } catch (err) {
      console.log(err);
      showLoading(false);
    }
  };

  const refresh = () => {
    getData(1, rowsPerPage, Configs.DefaultSortExpression, '');
  };

  const exportAsPicture = () => {
    let data = componentTargerExport.current;

    htmlToImage.toPng(data)
    .then((dataUrl) => {
      if(isTabletOrMobile) {
        setOpenViewFileDialog(true);
        setFileType('png');
        setFilePath(dataUrl);
        setHeader("PNG file"); 
      }
      download(dataUrl, 'Bảng biểu.png');
      ShowNotification("Trích xuất thông tin thành công.", NotificationMessageType.Success);
    });
  }

  //popper
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = anchorEl ? true : false ;
  const id = open ? 'simple-popper' : undefined;

  //media query
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  return (
    <div className="slider">
      <SearchObjectsGeogies
        onGetList={GetListAll}
        pageSize={rowsPerPage}
        refresh={refresh}
        typeSelected={typeSelected}
        setTypeSelected={setTypeSelected}
        objectTypeSelected={objectTypeSelected}
        setObjectTypeSelected={setObjectTypeSelected}
        objectKindSelected={objectKindSelected}
        setObjectKindSelected={setObjectKindSelected}
        districtSelected={districtSelected}
        setDistrictSelected={setDistrictSelected}
        yearSelected={yearSelected}
        setYearSelected={setYearSelected}
      />
      <div className={`${classes.btnGroupWrapper}`}>
        <div className="btn btn-primary" onClick={() => setOpenChart(true)}>
          <span >
            <BarChart className={classes.mr05} />
            Biểu đồ
          </span>
        </div>
        <div className="btn btn-primary" onClick={handleClick}>
          <span >
            <ArrowDownwardOutlined className={classes.mr05} />
            Xuất
          </span>
          <Popper id={id} open={open} anchorEl={anchorEl} placement={'right-end'} >
            <div className="row px-3" style={{flexDirection: 'column', gap: '10px'}}>
              <div className="col-6 btn btn-info" onClick={exportAsPicture} style={{minWidth: 'fit-content'}}>
                <span >
                  <Photo className={classes.mr05} />
                  Xuất ảnh
                </span>
              </div>
              <div className="col-6 btn btn-warning" onClick={() => {
                generatePDF(
                  loader,
                  setLoader,
                  componentTargerExport.current,
                  'Bảng biểu',
                  (val) => {showLoading(val);}
                ).then((generatedPDF_URL) => {
                  if (isTabletOrMobile) {
                    setOpenViewFileDialog(true);
                    setFileType('pdf');
                    setFilePath(generatedPDF_URL);
                    setHeader("PDF file");
                  }
                })
              }} style={{minWidth: 'fit-content'}}>
                <span >
                  <PictureAsPdf className={classes.mr05} />
                  {
                    loader ? "Đang xuất ..." : "Trích xuất thông tin"
                  }
                </span>
              </div>
            </div>
          </Popper>
        </div>
      </div>
      {data && (
        <ListAnalysis
          totalItemCount={totalItemCount}
          data={data}
          GetListAll={GetListAll}
          setPage={setPage}
          setRowsPerPage={setRowsPerPage}
          page={page}
          rowsPerPage={rowsPerPage}
          order={order}
          orderBy={orderBy}
          componentTargerExport={componentTargerExport}
          currentObjectType={currentObjectType}
        />
      )}
      {openChart && (
        <ModalChartObjectGeogises
          isOpen={openChart}
          onClose={() => setOpenChart(false)}
          data={data}
          currentObjectType={currentObjectType}
        />
      )}

      {openViewFileDialog && fileType && filePath && typeof filePath == 'string' ? (
        <ViewFileDialog
          isOpen={openViewFileDialog}
          onClose={() => {
            setOpenViewFileDialog(false);
            setFilePath('');
            setFileType('');
            setHeader("");
          }}
          header={header}
          fileType={fileType}
          filePath={filePath}
        />
      ) : (
        ""
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  isLoading: state.app.loading,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      showLoading: appActions.ShowLoading,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(ObjectGeogises);
