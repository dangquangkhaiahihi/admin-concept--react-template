import React from 'react';
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
import { useMediaQuery } from 'react-responsive';
import { useForm } from 'react-hook-form';

function SearchMapFields(props) {
    const {
        rowsPerPage,
        onGetObjectGeogisOnMap,
        typeSelected,
        setTypeSelected,
        objectTypeSelected,
        setObjectTypeSelected,
        currentObjectType,
        setCurrentObjectType,
        objectKindSelected,
        setObjectKindSelected,
        districtSelected,
        setDistrictSelected,
        yearSelected,
        setYearSelected,
        planningTypeModel,
        districtModel,
        objectTypeModel,
        objectKindModel,
        yearStatementModel,
    } = {...props};

    //media query
    const isDesktopOrLaptop = useMediaQuery({
        query: "(min-width: 1224px)",
    });
    const isBigScreen = useMediaQuery({ query: "(min-width: 1824px)" });
    const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
    const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });
    const isRetina = useMediaQuery({ query: "(min-resolution: 2dppx)" });

    const { handleSubmit } = useForm({
        mode: 'all',
        reValidateMode: 'onBlur',
    });

    const onSubmit = async (data) => {
        const type = typeSelected?.id;
        const objectType = objectTypeSelected?.id;
        const objectKind = objectKindSelected?.code;
        const district = districtSelected?.id;
        const year = yearSelected?.id;
        
        await onGetObjectGeogisOnMap(
            1,
            rowsPerPage,
            year,
            type,
            objectType,
            objectKind,
            district
        );
    };
    
    const refreshSearch = () => {
        setTypeSelected(planningTypeModel.filter(item => item.id == 2)[0]);
        setObjectTypeSelected(objectTypeModel[0]);
        setDistrictSelected(null);
        setYearSelected(null);
        setObjectKindSelected(null);
    };
    
    return (
        <span>
            <div className="h-100 left-search-container-container p-2" style={{ overflowX: "hidden", backgroundColor: '#fff' }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div class='row'>
                        <div class={`form-group col-12`}>
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
                        <div class={`form-group col-12`}>
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
                        <div class={`form-group col-12`}>
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
                        <div class={`form-group col-12`}>
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
                        <div class={`form-group col-12`}>
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
                        <div class={`col-12 ${isTabletOrMobile ? 'd-flex flex-column' : ''}`} style={{ display : "flex", gap: '10px', justifyContent: 'space-around'}}>
                            <div class='btn btn-ct btn-default-ct btn-inline m-0' style={{margin: 0}} onClick={refreshSearch}>
                                Đặt lại
                            </div>
                            <button class='btn btn-ct btn-primary-ct btn-inline m-0' type='submit'>
                                Tìm kiếm
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </span>
    )
}

export default SearchMapFields;
