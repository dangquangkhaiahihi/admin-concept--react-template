import React, { useState } from "react";
import "date-fns";
import { useForm } from "react-hook-form";
import { useMediaQuery } from "react-responsive";

const SearchNews = (props) => {
  const {
    searchData: { title, status },
    onChangeTitle,
    onChangeStatus,
    refresh,
    onSubmit,
  } = props;

  const { register, handleSubmit } = useForm({
    mode: "all",
    reValidateMode: "onBlur",
  });

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
            <div class="form-group col-12 col-lg-4">
              <input
                id="input-search"
                type="text"
                value={title}
                name="title"
                onChange={onChangeTitle}
                class="form-control"
                placeholder="Tiêu đề"
                inputRef={register}
              />
            </div>
            <div class="form-group col-12 col-lg-3">
              <select
                name="status"
                value={status}
                class="custom-select"
                onChange={onChangeStatus}
                inputRef={register}
                placeholder="Trạng thái"
              >
                <option value={2}>----------------</option>
                <option value={1}>Kích hoạt</option>
                <option value={0}>Không kích hoạt</option>
              </select>
            </div>
            <div class={`form-group col-12 col-lg-3 ${isTabletOrMobile ? 'd-flex flex-column' : ''}`} style={{ display : "flex"}}>
              <button class="btn btn-ct btn-default-ct" onClick={refresh}>
                Xóa
              </button>
              <button class="btn btn-ct btn-primary-ct" type="submit">
                Tìm kiếm
              </button>
            </div>
          </div>
        </form>
      }
      
    </div>
  );
};

export default SearchNews;
