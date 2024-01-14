import React from 'react';
import 'date-fns';

//--- Validation
import { useForm } from "react-hook-form";

//--- Material Control
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import Popover from '@material-ui/core/Popover';

//--- Material Icon
import CloseIcon from '@material-ui/icons/Close';
import FilterListIcon from '@material-ui/icons/FilterList';
import SearchIcon from '@material-ui/icons/Search';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import RefreshIcon from '@material-ui/icons/Refresh';

function SearchEmailTemplate(props) {
  const { getListEmailModels, setTitle, setCode, rowsPerPageCommon, code, title, setOrder, setOrderBy, orderBy, order } = props;

  const { register, handleSubmit } = useForm({ mode: "all", reValidateMode: "onBlur" });

  //--- Filter
  const [filterSection, setFilterSection] = React.useState(null);

  const handleClickFilter = (event) => {
    setFilterSection(event.currentTarget);
  };

  const handleCloseFilter = () => {
    setFilterSection(null);
  };

  const onSubmit = async (data) => {
    setTitle(data.title);
    setCode(data.code);
    await getListEmailModels(1, rowsPerPageCommon, orderBy + " " + order, data.code, data.title);
    handleCloseFilter();
  }

  const refresh = async () => {
    let sortExpression = "modifiedDate desc"
    setCode("");
    setTitle("");
    setOrderBy("modifiedDate")
    setOrder("desc");
    await getListEmailModels(1, rowsPerPageCommon, sortExpression, "", "");
  }

  const handleClearAllField = () => {
    setCode("");
    setTitle("");
  }

  const openFilter = Boolean(filterSection);
  const idFilter = openFilter ? 'popoverSlider' : undefined;

  return (
    <div className="position-relative">
      <span className="h3 mb-0 text-gray-800">
        <Tooltip title="Tìm kiếm">
          <Fab color="primary" aria-label="filter" size="small" onClick={handleClickFilter} className="ml-2">
            <FilterListIcon />
          </Fab>
        </Tooltip>
        <Tooltip title="Refresh">
          <Fab color="primary" aria-label="filter" size="small" onClick={refresh} className="ml-2">
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
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <div className="p-3 mt-2 popover-admin-search">
            <div className="text-right border-bottom mb-3 pb-2">
              <IconButton aria-label="close" size="small" onClick={handleCloseFilter}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </div>
            <form id="formSearch" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group">
                <label className="text-dark">Code</label>
                <TextField className="w-100" name="code" value={code} onChange={(e) => { setCode(e.target.value) }} inputRef={register} />
              </div>
              <div className="form-group">
                <label className="text-dark">Tiêu đề</label>
                <TextField className="w-100" name="title" value={title} onChange={(e) => { setTitle(e.target.value) }} inputRef={register} />
              </div>
              <div className="border-top">
                <div className="row">
                  <div className="col-12 text-right mt-3">
                    <Button variant="contained" color="primary" type="submit">
                      <SearchIcon fontSize="small" /> Tìm kiếm
                    </Button>
                    <Button variant="contained" className="ml-2" onClick={handleClearAllField}>
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
  )
}

export default SearchEmailTemplate