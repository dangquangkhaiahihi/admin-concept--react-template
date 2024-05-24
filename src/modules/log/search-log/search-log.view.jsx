import React, { useState } from "react";
import "date-fns";

//--- Validation
import { useForm } from "react-hook-form";

//--- Material Control
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Fab from "@material-ui/core/Fab";
import Popover from "@material-ui/core/Popover";
import ButtonGroup from "@material-ui/core/ButtonGroup";
//--- Material Icon
import CloseIcon from "@material-ui/icons/Close";
import FilterListIcon from "@material-ui/icons/FilterList";
import SearchIcon from "@material-ui/icons/Search";
import ClearAllIcon from "@material-ui/icons/ClearAll";
import RefreshIcon from "@material-ui/icons/Refresh";
//--- Material Icon
import DeleteCircle from "@material-ui/icons/DeleteForever";
import { Select, MenuItem } from "@material-ui/core";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import viLocale from "date-fns/locale/vi";
import dateformat from "dateformat";
function SearchLog(props) {
  const {
    getListLogModels,
    rowsPerPageCommon,
    handleDelete,
    dataSearch,
    setDataSearch,
    onChangeFormSearch,
    handleOpenDeleteDialog
  } = props;
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const { register, handleSubmit } = useForm({
    mode: "all",
    reValidateMode: "onBlur",
  });
  //--- Filter
  const [filterSection, setFilterSection] = React.useState(null);

  const handleClickFilter = (event) => {
    setFilterSection(event.currentTarget);
  };

  const handleCloseFilter = () => {
    setFilterSection(null);
  };

  const onSubmit = async (data) => {
    await getListLogModels(
      1,
      rowsPerPageCommon,
      '',
      dataSearch.level,
      dataSearch.startDate,
      dataSearch.endDate,
      dataSearch.message
    );

    handleCloseFilter();
  };

  const refresh = async () => {
    setDataSearch({
      level: "",
      startDate: "",
      endDate: ""
    })
    await getListLogModels(
      1,
      rowsPerPageCommon,
      '',
      "",
      "",
      "",
      ""
    );
  };

  const handleClearAllField = async () => {
    setDataSearch({
      level: "",
      startDate: "",
      endDate: ""
    })
    await getListLogModels(
      1,
      rowsPerPageCommon,
      '',
      "",
      "",
      "",
      ""
    );
    handleCloseFilter();
    
  };

  const handleDateChange = (date, id) => {
    if(id == "startDate") 
    {
      dataSearch.startDate = dateformat(date, "yyyy-mm-dd")
      setStartDate(dateformat(date, "yyyy-mm-dd"))
    }
    else
    {
      dataSearch.endDate = dateformat(date, "yyyy-mm-dd")
      setEndDate(dateformat(date, "yyyy-mm-dd"))
    }  
  }
  const openFilter = Boolean(filterSection);
  const idFilter = openFilter ? "popoverSlider" : undefined;

  return (
    <div className="d-flex align-items-center justify-content-between mb-3">
      <div className="position-relative">
        <span className="h3 mb-0 text-gray-800">
          <Tooltip title="Tìm kiếm">
            <Fab
              color="primary"
              aria-label="filter"
              size="small"
              onClick={handleClickFilter}
              className="ml-2"
            >
              <FilterListIcon />
            </Fab>
          </Tooltip>
          <Tooltip title="Refresh">
            <Fab
              color="primary"
              aria-label="filter"
              size="small"
              onClick={refresh}
              className="ml-2"
            >
              <RefreshIcon />
            </Fab>
          </Tooltip>
          
          <Popover
            id={idFilter}
            open={openFilter}
            anchorEl={filterSection}
            onClose={handleCloseFilter}
            style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <div className="p-3 mt-2 popover-admin-search">
              <div className="text-right border-bottom mb-3 pb-2">
                <IconButton
                  aria-label="close"
                  size="small"
                  onClick={handleCloseFilter}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </div>
              <form id="formSearch" onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                  <label className="text-dark">Nội dung</label>
                  <TextField
                    className="w-100"
                    name="message"
                    value={dataSearch.message}
                    onChange={(e) => {
                      onChangeFormSearch(e);
                    }}
                    inputRef={register}
                  />
                </div>
                <div className="form-group">
                  <label className="text-dark">Level</label>
                  <Select
                    name="level"
                    className="w-100 ml-2"
                    placeholder="Level"
                    value={dataSearch.level}
                    inputRef={register}
                    onChange={(e) => {
                      onChangeFormSearch(e);
                    }}
                  >
                    <MenuItem value="">---Tất cả---</MenuItem>
                    <MenuItem value="Information">Information </MenuItem>
                    <MenuItem value="Warning">Warning</MenuItem>
                    <MenuItem value="Error">Error</MenuItem>
                  </Select>
                </div>
                <div className="form-group">
                  <label className="text-dark">Từ ngày</label>
                  <MuiPickersUtilsProvider
                    utils={DateFnsUtils}
                    locale={viLocale}
                  >
                    <DatePicker
                      id="startDate"
                      name="startDate"
                      onChange={(date) => date && handleDateChange(date,"startDate")}
                      value={startDate}
                      format="dd/MM/yyyy"
                      inputRef={register}
                      fullWidth
                      showTodayButton={true}
                    />
                  </MuiPickersUtilsProvider>
                </div>
                <div className="form-group">
                  <label className="text-dark">Đến ngày</label>
                  <MuiPickersUtilsProvider
                    //
                    utils={DateFnsUtils}
                    locale={viLocale}
                  >
                    <DatePicker
                      id="endDate"
                      name="endDate"
                      value={endDate}
                      onChange={(date) => date && handleDateChange(date,"endDate")}
                      format="dd/MM/yyyy"
                      inputRef={register}
                      fullWidth
                      showTodayButton={true}
                    />
                  </MuiPickersUtilsProvider>
                </div>
                <div className="border-top">
                  <div className="row">
                    <div className="col-12 text-right mt-3">
                      <Button variant="contained" color="primary" type="submit">
                        <SearchIcon fontSize="small" /> Tìm kiếm
                      </Button>
                      <Button
                        variant="contained"
                        className="ml-2"
                        onClick={handleClearAllField}
                      >
                        <ClearAllIcon fontSize="small" /> Bỏ lọc
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </Popover>
        </span>
      </div>
     <div className="d-flex align-items-center">
     <ButtonGroup
        variant="contained"
        color="primary"
        className="mr-1"
        aria-label="contained primary button group"
      >
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleOpenDeleteDialog()}
          startIcon={<DeleteCircle />}
        >
          Xóa log
        </Button>
      </ButtonGroup>
     
     </div>
    </div>
  );
}

export default SearchLog;
