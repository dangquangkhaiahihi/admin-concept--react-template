import React,{ useEffect, useState } from 'react';
import 'date-fns';
import { useForm } from 'react-hook-form';
import { Configs } from '../../../../common/config';
import { useMediaQuery } from "react-responsive";
import * as planningAction from "../../../../redux/store/planning/planning.store";
import * as objectGeogisesAction from "../../../../redux/store/object-geogises/object-geogises.store";
import Autocomplete from "@material-ui/lab/Autocomplete";
import ShowNotification from "../../../../components/react-notifications/react-notifications";
import { NotificationMessageType } from "../../../../utils/configuration";
import { TextField } from "@material-ui/core";
import * as viVN from "../../../../language/vi-VN.json";

function SearchObjectsGeogies(props) {
  const {
    onGetList, pageSize, refresh,
    typeSelected, setTypeSelected,
    objectTypeSelected, setObjectTypeSelected,
    districtSelected, setDistrictSelected,
    yearSelected, setYearSelected,
    objectKindSelected, setObjectKindSelected
  } = props;
  const { handleSubmit, errors, register, reset } = useForm({
    mode: 'all',
    reValidateMode: 'onBlur',
  });
  
  const [planningTypeModel, setPlanningTypeModel] = useState([]);
  const [districtModel, setDistrictModel] = useState([]);
  const [objectTypeModel, setObjectTypeModel] = useState([
    {
      id: 'dat',
      name: 'Quy hoạch đất'
    },
    {
      id: 'dien',
      name: 'Quy hoạch cấp điện'
    },
    {
      id: 'nuoc',
      name: 'Quy hoạch cấp nước'
    },
    {
      id: 'giao_thong',
      name: 'Quy hoạch giao thông'
    },
  ]);
  const [objectKindModel, setObjectKindModel] = useState([]);
  const [yearStatementModel, setYearStatementModel] = useState([]);

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

  const onGetYearStatement = () => {
    return new Promise((resolve, reject) => {
      objectGeogisesAction.GetYearStatement().then(
        (res) => {
          if(res && res.content) {
            const temp = [];
            res.content.map((item) => {
              temp.push({
                id: item.toString(),
                name: item.toString(),
              })
            })
            setYearStatementModel(temp);
          }
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

  const onGetLookUpObjectKind = () => {
    return new Promise((resolve, reject) => {
      objectGeogisesAction.GetLookUpObjectKind().then(
        (res) => {
          setObjectKindModel(res && res.content);
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


  const onGetData = () => {
    //showLoading(true);
    Promise.all([
      onGetLookUpPlanningType(),
      onGetLookUpPlanningDistrict(),
      onGetYearStatement(),
      onGetLookUpObjectKind(),
    ])
      .then((res) => {
        //showLoading(false);
      })
      .catch((err) => {
        //showLoading(false);
      });
  };

  useEffect(() => {
    setObjectTypeSelected(objectTypeModel[0])
    onGetData();
  }, []);

  useEffect(() => {
    setObjectKindSelected(null);
  }, [objectTypeSelected])

  var styles = {
    firstBtn: {
      margin: 0
    },
  }
  const onSubmit = async (data) => {
    const type = typeSelected?.id;
    const objectType = objectTypeSelected?.id;
    const objectKind = objectKindSelected?.code;
    const district = districtSelected?.id;
    
    const year = yearSelected?.id;
    
    await onGetList(
      1,
      pageSize,
      Configs.DefaultSortExpression,
      year,
      type,
      objectType,
      objectKind,
      district
    );
  };

  const refreshSearch = () => {
    setTypeSelected(null);
    setObjectTypeSelected(objectTypeModel[0])
    setDistrictSelected(null);
    setYearSelected(null);
    setObjectKindSelected(null);
    // refresh();
  };

  const [isOpenMobileSearch, setIsOpenMobileSearch] = useState(false);

  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });
  const isBigScreen = useMediaQuery({ query: "(min-width: 1824px)" });
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });
  const isRetina = useMediaQuery({ query: "(min-resolution: 2dppx)" });

  const isNumber = (value) => {
    if(!value) return true;
    return !isNaN(value) && !isNaN(parseFloat(value));
  };

  return (
    <div class='wrap__content-page qlhs-form'>
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
          <div class='form-row'>
            <div class={`form-group col-12 col-lg-4`}>
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
            <div class={`form-group col-12 col-lg-4`}>
              <Autocomplete
                options={objectTypeModel?.filter((item) => item?.id !== 5)}
                getOptionLabel={(option) =>
                  typeof option === "string" ? option : option.name
                }
                value={objectTypeSelected}
                onChange={(event, newValue) => {
                  setObjectTypeSelected(newValue);
                }}
                disableClearable={true}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Kiểu đối tượng"
                    variant="outlined"
                    size="small"
                  />
                )}
              />
            </div>
            <div class={`form-group col-12 col-lg-4`}>
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
            <div class={`form-group col-12 col-lg-4`}>
              <Autocomplete
                options={yearStatementModel}
                getOptionLabel={(option) =>
                  option.name
                }
                value={yearSelected}
                onChange={(event, newValue) => {
                  setYearSelected(newValue);
                }}
                disableClearable={true}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Năm"
                    variant="outlined"
                    size="small"
                  />
                )}
              />
            </div>
            <div class={`form-group col-12 col-lg-4`}>
              <Autocomplete
                options={objectKindModel}
                getOptionLabel={(option) =>
                  option.name
                }
                value={objectKindSelected}
                onChange={(event, newValue) => {
                  setObjectKindSelected(newValue);
                }}
                disableClearable={true}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label='Loại đối tượng'
                    variant="outlined"
                    size="small"
                  />
                )}
                disabled={objectTypeSelected?.id != 'dat'}
              />
            </div>
            <div class={`form-group col-12 col-lg-3 ${isTabletOrMobile ? 'd-flex flex-column' : ''}`} style={{ display : "flex"}}>
              <div class='btn btn-ct btn-default-ct btn-inline' style={styles.firstBtn} onClick={refreshSearch}>
                Xóa
              </div>
              <button class='btn btn-ct btn-primary-ct btn-inline'  type='submit'>
                Tìm kiếm
              </button>
            </div>
          </div>
        </form>
      }
    </div>
  );
}

export default SearchObjectsGeogies;
