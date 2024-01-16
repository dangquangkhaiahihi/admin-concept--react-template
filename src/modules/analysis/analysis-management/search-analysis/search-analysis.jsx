import React,{ useEffect, useState } from 'react';
import 'date-fns';
import { useForm } from 'react-hook-form';
import { Configs } from '../../../../common/config';
import { useMediaQuery } from "react-responsive";

function SearchAnalysis(props) {
  const { onGetList, pageSize, refresh } = props;
  const { handleSubmit } = useForm({
    mode: 'all',
    reValidateMode: 'onBlur',
  });
  const [title, setTitle] = useState('');
  var styles = {
    firstBtn: {
      margin: 0
    },
  }
  const onSubmit = async () => {
    await onGetList(1, pageSize, Configs.DefaultSortExpression, title);
  };

  const onChangeTitle = (e) => {
    setTitle(e.target.value);
  };

  const refreshSearch = () => {
    setTitle('');
    refresh();
  };

  const [isOpenMobileSearch, setIsOpenMobileSearch] = useState(false);

  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });
  const isBigScreen = useMediaQuery({ query: "(min-width: 1824px)" });
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });
  const isRetina = useMediaQuery({ query: "(min-resolution: 2dppx)" });

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
            <div class='form-group col-12 col-lg-6'>
              <input
                id='input-search'
                type='text'
                value={title}
                onChange={onChangeTitle}
                class='form-control'
                placeholder='Tên phân tích'
              />
            </div>
            <div class={`form-group col-12 col-lg-3 ${isTabletOrMobile ? 'd-flex flex-column' : ''}`} style={{ display : "flex"}}>
              <button class='btn btn-ct btn-default-ct btn-inline' style={styles.firstBtn} onClick={refreshSearch}>
                Xóa
              </button>
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

export default SearchAnalysis;
