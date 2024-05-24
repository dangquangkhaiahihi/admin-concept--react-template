/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
//--- Material Control
import {
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';
import * as planningAction from "../../../../redux/store/planning/planning.store";
import * as appActions from "../../../../core/app.store";
import { NotificationMessageType } from "../../../../utils/configuration";
import * as viVN from "../../../../language/vi-VN.json";
import ShowNotification from "../../../../components/react-notifications/react-notifications";
import { useSelector, useDispatch } from "react-redux";

function CheckboxCheckDocument(props) {
  const {planningId} = {...props};

  const dispatch = useDispatch();
  const showLoading = (data) => dispatch(appActions.ShowLoading(data));

  const defaultPlace = "Sơn La";
  const orderDefault = 1;
  const consultingUnitDefault = "N/A";

  const [isCheckDocument, setIsCheckDocument] = useState(false);

  // Edit call stuff (copied from  src\modules\planning-announcement-process\records-management\edit-records-management\edit-records-management.view.jsx)
  const [planningModel, setPlanningModel] = useState(null);
  const [isNew, setIsNew] = useState(true);

  const onGetDetailPlanning = (id = planningId) => {
    return new Promise((resolve, reject) => {
      planningAction.GetDetailPlaning(id).then(
        (res) => {
          if (!res || !res.content) {
            reject(res);
          }
          setPlanningModel(res.content);
          setIsNew(res?.content?.isNew);
          resolve(res);
          setIsCheckDocument(res?.content?.isCheckDocument)
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

  const onGetData = () => {
    showLoading(true);
    Promise.all([
      onGetDetailPlanning(),
    ])
      .then((res) => {
        showLoading(false);
      })
      .catch((err) => {
        showLoading(false);
      });
  };

  useEffect(() => {
    onGetData();
  }, []);

  const onSubmit = (valIsCheckDocument) => {
    if (!planningModel) {
      return;
    }

    showLoading(true);

    let params = {
      Id: planningModel.id || null,
      Name: planningModel.name || null,
      PlanningCode: planningModel.planningCode || null,
      Photo: planningModel.photo || null,
      PlanningTypeId: planningModel.planningTypeId || null,
      Place: planningModel.place || defaultPlace,
      DistrictId: planningModel.districtId || null,
      Order: planningModel.order | orderDefault,
      ApprovalAgencyId: planningModel.approvalAgencyId || null,
      ConsultingUnit: planningModel.consultingUnit || consultingUnitDefault,
      InvestorId: planningModel.investorId || null,
      PlanningStatusId:  planningModel.planningStatusId || null,
      AgencySubmitted: planningModel.agencySubmitted || null,
      PlanningUnitId: planningModel.planningUnitId || null, 
      PlanningLevelId: planningModel.planningLevelId || null,
      Population: parseInt(planningModel.population) || null,
      Acreage: planningModel.acreage || null,
      LandForConstruction: planningModel.landForConstruction || null,
      Report: planningModel.report || null,
      Note: planningModel.note || null,
      Presentation: planningModel.presentation || null,
      Regulation: planningModel.regulation || null,
      DocumentTypeId: planningModel.documentTypeId || null,
      ApprovalAgencyLevelId: planningModel.approvalAgencyLevelId || null,
      PlanningDistrictIds: planningModel.districtIds || null,
      isNew: isNew,
      PlanningAdjustedId: planningModel.planningAdjustedId || null,
      Field: planningModel.field || null,
      DocumentUploadId: planningModel.documentUploadId,
      tifFile: planningModel.tifFile,
      shpFile: planningModel.shpFile,
      IsCheck: planningModel.isCheck || false,
      IsCheckDocument : valIsCheckDocument,
    };

    planningAction
      .UpdatePlanning(params)
      .then(
        (res) => {
          showLoading(false);
          ShowNotification(
            viVN.Success.EditPlanning,
            NotificationMessageType.Success
          );
        },
        (err) => {
          showLoading(false);
          err &&
            err.errorType &&
            ShowNotification(
              viVN.Errors[err.errorType],
              NotificationMessageType.Error
            );
        }
      )
      .catch((err) => {
        showLoading(false);
        ShowNotification(
          viVN.Errors[(err && err.errorType) || "UnableHandleException"],
          NotificationMessageType.Error
        );
      });
  };

  // useEffect(() => {
  //   if(!isFirstLoad) onSubmit();
  // }, [isCheckDocument]);

  return (
    <FormControlLabel 
      control={<Checkbox/>}
      label="Kiểm tra"
      checked={isCheckDocument}
      onChange={(e) =>
        {
          setIsCheckDocument(e.target.checked);
          onSubmit(e.target.checked);
        }
      }
      name="isCheckDocument"
    />
  );
}

export default CheckboxCheckDocument;