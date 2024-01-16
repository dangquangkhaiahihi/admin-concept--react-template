import React, { useState } from "react";
import "date-fns";
import { useForm } from "react-hook-form";
import { useMediaQuery } from "react-responsive";

const SearchNews = (props) => {
  const {
    status,
    keyword,
    setKeyword,
    setStatus,
    refresh,
    onSubmit,
    isSuccess,
    setIsSuccess
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
                value={keyword}
                name="keyword"
                onChange={(e) =>
                  setKeyword( e.target.value)
              }
                class="form-control"
                placeholder="Tên quy hoạch"
                inputRef={register}
              />
            </div>
            <div class="form-group col-12 col-lg-3">
              <select
                name="status"
                value={status}
                onChange={(e) =>
                  setStatus( e.target.value)
              }
                class="custom-select"
                inputRef={register}
                placeholder="Trạng thái gửi"
              >
                <option value={null}>--Chọn trạng thái gửi--</option>
                <option value={true}>Đã đồng bộ</option>
                <option value={false}>Chưa đồng bộ</option>
              </select>
            </div>
            <div class="form-group col-12 col-lg-3">
              <select
                name="isSuccess"
                value={isSuccess}
                onChange={(e) =>
                  setIsSuccess( e.target.value)
              }
                class="custom-select"
                inputRef={register}
                placeholder="Trạng thái đồng bộ"
              >
                <option value={null}>--Trạng thái đồng bộ--</option>
                <option value={true}>Thành công</option>
                <option value={false}>Chưa thành công</option>
              </select>
            </div>
            <div class={`form-group col-12 col-lg-5 ${isTabletOrMobile ? 'd-flex flex-column' : ''}`} style={{ display : "flex"}}>
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
