import React, { useEffect, useState } from "react";
import * as documentAction from '../../../../redux/store/document/document.store';

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
import { NotificationMessageType } from "../../../../utils/configuration";
import * as viVN from "../../../../language/vi-VN.json";
import ShowNotification from "../../../../components/react-notifications/react-notifications";

import CloseIcon from "@material-ui/icons/Close";
import ListDocumentPlanningStatistic from "./list-document-planning-statistic";

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

const ModalReportDocument = ({
  isOpen,
  onClose,
  planningId
}) => {
    const classes = useStyles();
    const [data, setData] = useState([]);

    useEffect(() => {GetStatisticByPlanningId()}, [])
  
    const GetStatisticByPlanningId = (id = planningId) => {
        return new Promise((resolve, reject) => {
            documentAction.GetStatisticByPlanningId(id).then(
                (res) => {
                    if (!res || !res.content) {
                        reject(res);
                    }

                    setData(res?.content);
                    resolve(res);
                },
                (err) => {
                    reject(err);
                    ShowNotification(
                        viVN.Errors[(err && err.errorType) || "UnableHandleException"],
                        NotificationMessageType.Error
                    );
                }
            );
        });
    };
    
    return (
        <div>
            <Dialog open={isOpen} onClose={onClose} fullWidth={true} maxWidth="md">
                <DialogTitle disableTypography className="border-bottom">
                <Typography variant="h6">Bảng biểu thống kê số lượng hồ sơ dự án</Typography>
                <IconButton
                    aria-label="close"
                    className={classes.closeButton}
                    onClick={onClose}
                >
                    <CloseIcon />
                </IconButton>
                </DialogTitle>

                <DialogContent className="pt-4 pb-2">
                    <ListDocumentPlanningStatistic
                        dataModels={data}
                    />
                </DialogContent>

                <DialogActions className="border-top">
                    <Button
                    type="submit"
                    onClick={onClose}
                    variant="contained"
                    startIcon={<CloseIcon />}
                    >
                    Đóng
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ModalReportDocument;
