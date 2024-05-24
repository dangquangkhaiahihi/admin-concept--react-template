import React, { useState, useEffect } from "react";
import "date-fns";
import { useForm } from "react-hook-form";
import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import ShowNotification from "../../../../components/react-notifications/react-notifications";
import { NotificationMessageType } from "../../../../utils/configuration";
import * as viVN from "../../../../language/vi-VN.json";
import { Configs } from "../../../../common/config";
import * as planningAction from "../../../../redux/store/planning/planning.store";
import * as planningUnitAction from "../../../../redux/store/planning-unit/planning-unit.store";
import * as approvalAgencyAction from "../../../../redux/store/approval-agency/approval-agency.store";
import * as investorAction from "../../../../redux/store/investor/investor.store";
import { useMediaQuery } from "react-responsive";

function SearchRecordManagement(props) {
  const { 
    onGetListPlanning, pageSize, refresh, isQHHTKT, isOtherPlanning, isQHT, isQHCC,
    title, setTitle,
    planningUnitSelected, setPlanningUnitSelected,
    approvalAgencySelected, setApprovalAgencySelected,
    investorSelected, setInvestorSelected,
    typeSelected, setTypeSelected,
    levelSelected, setLevelSelected,
    statusIdSelected, setStatusIdSelected,
    districtSelected, setDistrictSelected,
  } = props;
  const { handleSubmit } = useForm({
    mode: "all",
    reValidateMode: "onBlur",
  });
  const [planningStatusModel, setPlanningStatusModel] = useState([]);
  const [planningLevelModel, setPlanningLevelModel] = useState([]);
  const [planningTypeModel, setPlanningTypeModel] = useState([]);
  const [planningUnitModel, setPlanningUnitModel] = useState([]);
  const [investorModel, setInvestorModel] = useState([]);
  const [approvalAgencyModel, setApprovalAgencyModel] = useState([]);
  const [districtModel, setDistrictModel] = useState([]);

  var styles = {
    firstBtn: {
      margin: 0,
    },
  };
  const onSubmit = async (data) => {
    const planningUnit = planningUnitSelected?.id;
    const approvalAgency = approvalAgencySelected?.id;
    const investor = investorSelected?.id;
    const type = typeSelected?.id;
    const level = levelSelected?.id;
    const statusId = statusIdSelected?.id;
    const districtId = districtSelected?.id;
    await onGetListPlanning(
      1,
      pageSize,
      Configs.DefaultSortExpression,
      title,
      type,
      level,
      statusId,
      planningUnit,
      investor,
      approvalAgency,
      districtId
    );
  };

  const onChangeTitle = (e) => {
    setTitle(e.target.value);
  };
  const refreshSearch = () => {
    setTitle("");
    setLevelSelected(null);
    setTypeSelected(null);
    setStatusIdSelected(null);
    setInvestorSelected(null);
    setPlanningUnitSelected(null);
    setApprovalAgencySelected(null);
    setStatusIdSelected(null);
    if (!isQHHTKT || !isOtherPlanning) {
      setTypeSelected(null);
    }
    setDistrictSelected(null);
    refresh();
  };
  useEffect(() => {
    onGetData();
  }, []);
  const onGetData = () => {
    //showLoading(true);
    Promise.all([
      onGetLookUpPlanningStatus(),
      onGetLookUpPlanningLevel(),
      onGetLookUpPlanningType(),
      onGetLookUpPlanningUnit(),
      onGetLookUpApprovalAgency(),
      onGetLookUpInvestor(),
      onGetLookUpPlanningDistrict(),
    ])
      .then((res) => {
        //showLoading(false);
      })
      .catch((err) => {
        //showLoading(false);
      });
  };
  const onGetLookUpPlanningStatus = () => {
    return new Promise((resolve, reject) => {
      planningAction.GetLookUpPlanningStatus().then(
        (res) => {
          setPlanningStatusModel(res && res.content);
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
  const onGetLookUpPlanningDistrict = () => {
    return new Promise((resolve, reject) => {
      planningAction.GetLookupDistrict().then(
        (res) => {
          setDistrictModel(res && res.content);
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
  const onGetLookUpPlanningLevel = () => {
    return new Promise((resolve, reject) => {
      planningAction.GetLookUpPlanningLevel().then(
        (res) => {
          setPlanningLevelModel(isQHCC ? res && res.content.filter((item) => {
            if(item.id === 1 || item.id === 3)
            return item
          }): res && res.content);
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
  const onGetLookUpPlanningType = () => {
    return new Promise((resolve, reject) => {
      planningAction.GetLookUpPlanningType().then(
        (res) => {
          setPlanningTypeModel(res && res.content);
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
  const onGetLookUpApprovalAgency = () => {
    return new Promise((resolve, reject) => {
      approvalAgencyAction.GetLookUpApprovalAgencyLv().then(
        (res) => {
          setApprovalAgencyModel(res && res.content);
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
  const onGetLookUpInvestor = () => {
    return new Promise((resolve, reject) => {
      investorAction.GetLookUpInvestor().then(
        (res) => {
          setInvestorModel(res && res.content);
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
  const onGetLookUpPlanningUnit = () => {
    return new Promise((resolve, reject) => {
      planningUnitAction.GetLookUpPlanningUnit().then(
        (res) => {
          setPlanningUnitModel(res && res.content);
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

  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });
  const isBigScreen = useMediaQuery({ query: "(min-width: 1824px)" });
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });
  const isRetina = useMediaQuery({ query: "(min-resolution: 2dppx)" });

  const [isOpenMobileSearch, setIsOpenMobileSearch] = useState(false);

  return (
    <div class="wrap__content-page qlhs-form">
      {
        isTabletOrMobile &&
        <div class={`form-group col-12 col-lg-6 ${isTabletOrMobile ? 'd-flex flex-column' : ''} `}>
          {
            !isOpenMobileSearch ?
            (<button class="btn btn-ct btn-primary-ct btn-inline" type="button"
              onClick={()=>{setIsOpenMobileSearch(!isOpenMobileSearch);}}
            >
              Tìm kiếm
            </button>) :
            (<button class="btn btn-ct btn-danger-ct btn-inline" type="button"
              onClick={()=>{setIsOpenMobileSearch(!isOpenMobileSearch);}}
            >
              Đóng
            </button>)
          }
        </div>
      }

      {
        (isDesktopOrLaptop || (isOpenMobileSearch && isTabletOrMobile)) &&
        <form onSubmit={handleSubmit(onSubmit)}>
          <div class="form-row">
            {!isOtherPlanning &&
              <>
                <div class="form-group col-12 col-lg-2">
                  <Autocomplete
                    options={planningUnitModel}
                    getOptionLabel={(option) =>
                      typeof option === "string" ? option : option.name
                    }
                    value={planningUnitSelected}
                    onChange={(event, newValue) => {
                      setPlanningUnitSelected(newValue);
                    }}
                    disableClearable={true}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Đơn vị quy hoạch"
                        variant="outlined"
                        size="small"
                      />
                    )}
                  />
                </div>
                <div class={`form-group col-12 col-lg-2`}>
                  <Autocomplete
                    options={approvalAgencyModel}
                    getOptionLabel={(option) =>
                      typeof option === "string" ? option : option.name
                    }
                    value={approvalAgencySelected}
                    onChange={(event, newValue) => {
                      setApprovalAgencySelected(newValue);
                    }}
                    disableClearable={true}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Đơn vị phê duyệt"
                        variant="outlined"
                        size="small"
                      />
                    )}
                  />
                </div>
                <div class={`form-group col-12 col-lg-2`}>
                  <Autocomplete
                    options={investorModel}
                    getOptionLabel={(option) =>
                      typeof option === "string" ? option : option.name
                    }
                    value={investorSelected}
                    onChange={(event, newValue) => {
                      setInvestorSelected(newValue);
                    }}
                    disableClearable={true}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Chủ đầu tư"
                        variant="outlined"
                        size="small"
                      />
                    )}
                  />
                </div>
                {!isQHHTKT && (
                  <div class={`form-group col-12 col-lg-2`}>
                    <Autocomplete
                      options={planningTypeModel?.filter((item) => item?.id !== 5)}
                      getOptionLabel={(option) =>
                        typeof option === "string" ? option : option.name
                      }
                      value={typeSelected}
                      onChange={(event, newValue) => {
                        setTypeSelected(newValue);
                      }}
                      disableClearable={true}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Loại quy hoạch"
                          variant="outlined"
                          size="small"
                        />
                      )}
                    />
                  </div>
                )}
                {(isQHCC || isQHHTKT) && (
                  <div class="form-group col-12 col-lg-2">
                  <Autocomplete
                    options={planningLevelModel}
                    getOptionLabel={(option) =>
                      typeof option === "string" ? option : option.name
                    }
                    value={levelSelected}
                    onChange={(event, newValue) => {
                      setLevelSelected(newValue);
                    }}
                    disableClearable={true}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Cấp quy hoạch"
                        variant="outlined"
                        size="small"
                      />
                    )}
                  />
                </div>
                )}
                <div class={`form-group col-12 col-lg-2`}>
                  <Autocomplete
                    options={planningStatusModel}
                    getOptionLabel={(option) =>
                      typeof option === "string" ? option : option.name
                    }
                    value={statusIdSelected}
                    onChange={(event, newValue) => {
                      setStatusIdSelected(newValue);
                    }}
                    disableClearable={true}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Trạng thái quy hoạch"
                        variant="outlined"
                        size="small"
                      />
                    )}
                  />
                </div>
                
                  <div class={`form-group col-12 col-lg-2`}>
                  <Autocomplete
                    options={districtModel}
                    getOptionLabel={(option) =>
                      typeof option === "string" ? option : option.name
                    }
                    value={districtSelected}
                    onChange={(event, newValue) => {
                      setDistrictSelected(newValue);
                    }}
                    disableClearable={true}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Huyện / Thành phố"
                        variant="outlined"
                        size="small"
                      />
                    )}
                  />
                </div>
                
              </>
            }
            <div class={`form-group col-12 col-lg-${!isQHCC ? '6' : '4'}`}>
              <TextField
                fullWidth
                type="text"
                name="planningName"
                variant="outlined"
                size="small"
                value={title}
                onChange={onChangeTitle}
                inputProps={{ maxLength: 300 }}
                placeholder={isOtherPlanning ? "Tên quy hoạch" : "Tên đồ án quy hoạch"}
              />
            </div>
            <div class={`form-group col-12 col-lg-6 ${isTabletOrMobile ? 'd-flex flex-column' : ''} `}>
              <button
                type="reset"
                class="btn btn-ct btn-default-ct btn-inline"
                style={styles.firstBtn}
                onClick={refreshSearch}
              >
                Xóa
              </button>
              <button class="btn btn-ct btn-primary-ct btn-inline" type="submit">
                Tìm kiếm
              </button>
            </div>
          </div>
        </form>
      }
      
    </div>
  );
}

export default SearchRecordManagement;
