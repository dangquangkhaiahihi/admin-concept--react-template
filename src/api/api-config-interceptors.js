import axios from "axios";
import * as apiConfig from "./api-config";
import * as configuration from "../utils/configuration";
import * as Page500ErrorTypes from "../common/error-types-500";
import {GenerateDeviceId} from  "../common/tools";
const {
  TokenKey,
  TokenPrefix,
  getCookies,
  removeCookies,
  DomainAdminSide,
  setCookiesUser,
} = configuration;

configuration.setConfiguration(
  configuration.ApiServerKey.APP_API_ROOT,
  apiConfig.api
);
const apiRoot = configuration.getConfiguration(
  configuration.ApiServerKey.APP_API_ROOT
);

const isHandlerEnabled = true;

const requestHandler = (request) => {
  if (isHandlerEnabled) {
    // request.headers.common["Accept"] = "application/json";
    request.headers.common["Content-Type"] = "application/json; charset=utf-8";
    request.headers.common["Accept"] =
      "application/json, text/javascript, */*; q=0.01";
    request.headers.common["Access-Control-Allow-Origin"] = "*";
  }

  let userInfo = getCookies(TokenKey.token);
  if (userInfo) {
    request.headers.common["Authorization"] = `${TokenPrefix} ${userInfo}`;
  }

  return request;
};

const successHandler = (response, isHandlerEnabled) => {
  if (isHandlerEnabled) {
    //TODO: Do Success Handler
  }

  return response;
};

const errorHandler = (error, isHandlerEnabled) => {
  if (isHandlerEnabled) {
    //TODO: Do Error Handler
  }
  if (error.response.status === 401) {
    return Promise.reject(error);
  }

  return Promise.reject({
    ...(error.response
      ? error.response.data
      : {
          errorType: Page500ErrorTypes.UnhandleException,
          errorMessage: "UnhandleException",
        }),
  });
};

const axios_instance = axios.create({
  baseURL: apiRoot,
  responseType: "json",
});

axios_instance.interceptors.request.use(
  (request) => requestHandler(request, isHandlerEnabled),
  (error) => errorHandler(error, isHandlerEnabled)
);

export async function refreshToken() {
  try {
    let DeviceId = GenerateDeviceId();
    const response = await axios
      .create({
        baseURL: apiRoot,
      })
      .post("/api/Account/RefreshToken", {
        refreshToken: getCookies(TokenKey.refreshToken),
        accessToken: getCookies(TokenKey.token),
        returnUrl: DomainAdminSide,
        DeviceId: DeviceId
      });
    removeCookies("isShowDialog");
    setCookiesUser(response);
  } catch (error) {
    // console.log("!!!!", error);
    removeCookies("isShowDialog");
    removeCookies("isLockScreen");
    removeCookies(TokenKey.token);
    removeCookies(TokenKey.refreshToken);
    removeCookies(TokenKey.returnUrl);
    window.location.replace(DomainAdminSide + "/dang-nhap");
  }
}

let refreshing_token = null;

axios_instance.interceptors.response.use(
  (response) => successHandler(response, isHandlerEnabled),
  async (error) => {
    const config = error.config;
    if (error.response && error.response.status === 401 && !config._retry) {
      config._retry = true;
      try {
        refreshing_token = refreshing_token ? refreshing_token : refreshToken();
        await refreshing_token;
        refreshing_token = null;
        config.headers["Authorization"] =
          "Bearer " + getCookies(TokenKey.token);
        return axios_instance(config);
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return Promise.reject({
      ...(error.response
        ? error.response.data
        : {
            errorType: Page500ErrorTypes.UnhandleException,
            errorMessage: "UnhandleException",
          }),
    });
  }
);

export default axios_instance;
