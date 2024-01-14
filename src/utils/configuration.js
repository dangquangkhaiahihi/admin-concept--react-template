import React from "react";
import { Map } from "immutable";
import { DecodeToken } from "./jwt-token-helper";
import Cookies from "universal-cookie";
import Slide from "@material-ui/core/Slide";
import * as ApiConfig from "../api/api-config";

let configuration = Map();

export const DomainAdminSide = ApiConfig.domainAdminSide;
const domainName = ApiConfig.domainName;

export const APIUrlDefault = ApiConfig.api;
export const WorkSpace = ApiConfig.workSpace;
export const WmsBaseLink = ApiConfig.wmsBaseLink;

export const WordspaceName = ApiConfig.workSpace;
export const DefaultCordinate = "DefaultCordinate";

export const ApiServerKey = {
  APP_API_ROOT: "API_ROOT",
};

export const TokenPrefix = "Bearer";

//--- Cookies
const cookies = new Cookies();
const dateExpires = new Date();
dateExpires.setTime(dateExpires.getTime() + 720 * 60 * 60 * 1000);

export const setCookiesUser = (res) => {
  console.log("!!!", res)
  const { token, refreshTokens, refreshToken } =
    res?.data?.content || res?.content;
  const expireTime = new Date();
  expireTime.setTime(expireTime.getTime() + 24 * 60 * 60 * 1000);
  const expiredTime = new Date();
  expiredTime.setTime(expiredTime.getTime() + 10 * 60 * 1000);

  const options = {
    path: "/",
    domain: domainName,
    expires: expireTime,
  };
  cookies.set("token", token, options);
  cookies.set("refreshToken", refreshTokens ?? refreshToken, options);
  // cookies.set("expiredTime", expiredTime);
};

export const setIsShowDialogConfirmRefresh = (
  isShow,
  options = { path: "/", domain: domainName }
) => {
  cookies.set("isShowDialog", isShow, options);
};

export const setLockScreen = (
  isLockScreen,
  options = { path: "/", domain: domainName }
) => {
  cookies.set("isLockScreen", isLockScreen, options);
};

export function setCookies(
  name,
  value,
  options = { path: "/", domain: domainName, expires: dateExpires }
) {
  cookies.set(name, value, options);
}

export function getCookies(name) {
  return cookies.get(name);
}

export function removeCookies(
  name,
  options = { path: "/", domain: domainName }
) {
  cookies.remove(name, options);
}

export function removeListCookies(nameList) {
  if (nameList instanceof Array) {
    nameList.map((name) => {
      cookies.remove(name, { path: "/", domain: domainName });
      cookies.remove(name, { path: "/", domain: window.location.host });
    });
  }
}

export function setConfiguration(name, value) {
  configuration = configuration.set(name, value);
}

export function getConfiguration(key) {
  if (!configuration.has(key)) {
    throw new Error("Undefined configuration key: " + key);
  }

  return configuration.get(key);
}

export function onRemoveTokens(tokens) {
  return Promise.resolve(onRemoveTokenKeys(tokens));
}

function onRemoveTokenKeys(tokens) {
  if (tokens && tokens.length > 0) {
    tokens.map((t) => localStorage.removeItem(t));
  }
}

export function getUserInfo() {
  let userInfoToken = getCookies(TokenKey.token);
  let userInfo = DecodeToken(userInfoToken);
  if (userInfo) {
    return userInfo;
  }

  return null;
}

export const NotificationMessageType = {
  Success: "success",
  Warning: "warning",
  Error: "error",
};

export const TokenKey = {
  token: "token",
  returnUrl: "returnUrl",
  refreshToken: "refreshToken",
};

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export function changeAlias(alias) {
  var str = alias;
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(
    /~|`|!|@|#|\$|%|\^|&|\*|\(|\)|\+|=|{|\[|}|]|\\|\||:|;|'|"|,|<|>|\.|\?|\/|\\/g,
    ""
  );
  str = str.replace(/__|\\/g, "_");
  str = str.replace(/--|\\/g, "-");
  str = str.replace(/ + /g, "");
  str = str.trim();
  str = str.toUpperCase();
  return str;
}

export function compareValues(key, order = "asc") {
  return function innerSort(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      return 0;
    }

    const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
    const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return order === "desc" ? comparison * -1 : comparison;
  };
}

export function consoleLogTimeNow(message = "") {
  message && console.log(message);
  const dateTimeNow = new Date();
  console.log(
    dateTimeNow.getHours() * 60 * 60 +
      dateTimeNow.getMinutes() * 60 +
      dateTimeNow.getSeconds()
  );
}

export const MaxSizeImageUpload = "1048576";
