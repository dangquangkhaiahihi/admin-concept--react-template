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

const ModalReportAnalysis = ({
  isOpen,
  onClose,
  data
}) => {
    const classes = useStyles();
    
    return (
        <div>
            <Dialog open={isOpen} onClose={onClose} fullWidth={true} maxWidth="md">
                <DialogTitle disableTypography className="border-bottom">
                <Typography variant="h6">Bảng biểu thống kê số lượng chuyên mục theo đồ án</Typography>
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

export default ModalReportAnalysis;
