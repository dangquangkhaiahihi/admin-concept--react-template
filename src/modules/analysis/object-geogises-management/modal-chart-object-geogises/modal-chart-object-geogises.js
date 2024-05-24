import React, { useState, useRef } from "react";
import {
  DialogActions,
  Button,
  DialogContent,
  DialogTitle,
  Dialog,
  makeStyles,
  Typography,
  IconButton,
} from "@material-ui/core";
import PictureAsPdf from "@material-ui/icons/PictureAsPdf";
import Photo from "@material-ui/icons/Photo";
import CloseIcon from "@material-ui/icons/Close";
import PieChartCountReport from "./chart/pie-chart-count-report";
import BarChartMaxAreaReport from "./chart/bar-chart-max-areas-report";
import BarChartMinAreaReport from "./chart/bar-chart-min-areas-report";
import BarChartTotalAreaReport from "./chart/bar-chart-total-areas-report";
import * as htmlToImage from 'html-to-image';
import * as download from 'downloadjs';
import { generatePDF } from "../../../../common/generatePDF";
import { useDispatch } from "react-redux";
import * as appActions from "../../../../core/app.store";
import { NotificationMessageType } from "../../../../utils/configuration";
import ShowNotification from "../../../../components/react-notifications/react-notifications";
import { useMediaQuery } from "react-responsive";
import ViewFileDialog from "../../../../components/dialog-view-file/dialog-view-file.view";

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

const ModalChartObjectGeogises = ({
  isOpen,
  onClose,
  data,
  currentObjectType
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const showLoading = (data) => dispatch(appActions.ShowLoading(data));

  const [openViewFileDialog, setOpenViewFileDialog] = useState(false);
  const [fileType, setFileType] = useState('');
  const [filePath, setFilePath] = useState('');
  const [header, setHeader] = useState('');

  const componentTargerExport = useRef(null);;
  const [loader, setLoader] = useState(false);

  const exportAsPicture = () => {
    let data = componentTargerExport.current;

    if(!data) return;

    htmlToImage.toPng(data)
    .then((dataUrl) => {
      if(isTabletOrMobile) {
        setOpenViewFileDialog(true);
        setFileType('png');
        setFilePath(dataUrl);
        setHeader("PNG file");
      }
      download(dataUrl, 'Biểu đồ.png');
      ShowNotification("Trích xuất thông tin thành công.", NotificationMessageType.Success);
    });
  }

  //media query
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  return (
    <div>
      <Dialog open={isOpen} onClose={onClose} fullWidth={true} maxWidth="md">
        <DialogTitle disableTypography className="border-bottom">
          <Typography variant="h6">Biểu đồ tổng hợp</Typography>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

          <DialogContent className="pt-4 pb-2">
            {
              data.length > 0 && 
              <div ref={componentTargerExport}>
                <PieChartCountReport data={data} currentObjectType={currentObjectType}/>
                <BarChartTotalAreaReport data={data} currentObjectType={currentObjectType}/>
                <BarChartMaxAreaReport data={data} currentObjectType={currentObjectType}/>
                <BarChartMinAreaReport data={data} currentObjectType={currentObjectType}/>
              </div>
            }
            {
              data.length == 0 && 
              <Typography>Chưa có thông tin</Typography>
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
              color="info"
              variant="contained"
              startIcon={<Photo />}
              onClick={exportAsPicture}
            >
              Xuất ảnh
            </Button>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              startIcon={<PictureAsPdf />}
              onClick={() => {
                generatePDF(
                  loader,
                  setLoader,
                  componentTargerExport.current,
                  'Biểu đồ',
                  (val) => {showLoading(val);}
                ).then((generatedPDF_URL) => {
                  if (isTabletOrMobile) {
                    setOpenViewFileDialog(true);
                    setFileType('pdf');
                    setFilePath(generatedPDF_URL);
                    setHeader("PDF file");
                  }
                })
              }}
            >
              {
                loader ? "Đang xuất ..." : "Trích xuất thông tin"
              }
            </Button>
          </DialogActions>
      </Dialog>

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

export default ModalChartObjectGeogises;
