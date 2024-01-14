import React from 'react';
import Pagination from '@material-ui/lab/Pagination';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import { useMediaQuery } from "react-responsive";

import './style.scss';

const FooterPagination = (props) => {
  const { handleChangeRowsPerPage, handleChangePage, totalPage, rowsPerPage, currentPage } =
    props;
  
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });
  const isBigScreen = useMediaQuery({ query: "(min-width: 1824px)" });
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });
  const isRetina = useMediaQuery({ query: "(min-resolution: 2dppx)" });
  
  return (
    <div className='div-pagination'>
      <div className={`row ${!isTabletOrMobile ? 'justify-content-end' : 'justify-content-center'}`}>
        <div className='select-page'>
          <div>Số bản ghi mỗi trang :</div>
          <div className='rowPerPage'>
            <Select value={rowsPerPage} onChange={handleChangeRowsPerPage}>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={30}>30</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </div>
        </div>

        <Pagination
          showFirstButton
          showLastButton
          page={currentPage}
          count={totalPage}
          siblingCount={1}
          boundaryCount={1}
          color='primary'
          onChange={handleChangePage}
          size={isTabletOrMobile ? 'small' : 'medium'}
        />
      </div>
    </div>
  );
};

export default FooterPagination;
