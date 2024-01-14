import axios from "axios";
import * as apiConfig from "./api-config";
import * as configuration from "../utils/configuration";
import Api from "./api-config-interceptors";

const { TokenKey, TokenPrefix, getCookies } = configuration;

configuration.setConfiguration(
  configuration.ApiServerKey.APP_API_ROOT,
  apiConfig.api
);
const apiRoot = configuration.getConfiguration(
  configuration.ApiServerKey.APP_API_ROOT
);

export default class Service {
  constructor(namespace) {
    this.namespace = namespace;
  }

  /**
   * Get Http Request
   * @param {any} action
   */
  get(action, params) {
    return new Promise((resolve, reject) => {
      Api.request(params ? action + "?" + params : action, {
        method: "GET",
      })
        .then((response) => {
          if (response.data) {
            resolve(response.data);
          } else {
            reject(response);
          }
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.error
          ) {
            console.error("REST request error!", error.response.data.error);
            reject(error.response.data.error);
          } else reject(error);
        });
    });
  }

  /**
   * Post Http Request
   * @param {any} action
   * @param {any} params
   */
  postParams(action, params, body) {
    return new Promise((resolve, reject) => {
      Api.request(params ? action + "?" + params : action, {
        method: "POST",
        data: body,
      })
        .then((response) => {
          if (response.data) {
            resolve(response.data);
          } else {
            reject(response);
          }
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.error
          ) {
            console.error("REST request error!", error.response.data.error);
            reject(error.response.data.error);
          } else reject(error);
        });
    });
  }

  /**
   * Get Http Request
   * @param {any} action
   */
  getBinary(action, params) {
    return new Promise((resolve, reject) => {
      Api.request(params ? action + "?" + params : action, {
        method: "GET",
        responseType: "blob",
      })
        .then((response) => {
          if (response.data) {
            resolve(response.data);
          } else {
            reject(response);
          }
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.error
          ) {
            console.error("REST request error!", error.response.data.error);
            reject(error.response.data.error);
          } else reject(error);
        });
    });
  }
  /**
   * Get Http Request
   * @param {any} action
   */
  postBinary(action, body, params, callback = () => {}) {
    callback(0);
    let userInfo = getCookies(TokenKey.token);
    let headers = {};
    if (userInfo) {
      headers = {
        Authorization: `${TokenPrefix} ${userInfo}`,
      };
    }
    return new Promise((resolve, reject) => {
      Api.request(params ? action + "?" + params : action, {
        data: body,
        method: "POST",
        responseType: "blob",
        onDownloadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          let percentCompleted = Math.floor((loaded * 100) / total);
          callback(percentCompleted);
        },
      })
        .then((response) => {
          if (response.data) {
            resolve(response.data);
          } else {
            reject(response);
          }
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.error
          ) {
            console.error("REST request error!", error.response.data.error);
            reject(error.response.data.error);
          } else reject(error);
        });
    });
  }

  /**
   * Post Http Request
   * @param {any} action
   * @param {any} params
   */
  post(action, params) {
    return new Promise((resolve, reject) => {
      Api.request(action, {
        method: "POST",
        data: params,
      })
        .then((response) => {
          if (response.data) {
            resolve(response.data);
          } else {
            reject(response);
          }
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.error
          ) {
            console.error("REST request error!", error.response.data.error);
            reject(error.response.data.error);
          } else reject(error);
        });
    });
  }

  /**
   * Put Http Request
   * @param {any} action
   * @param {any} params
   */
  put(action, requestBody, params = null) {
    return new Promise((resolve, reject) => {
      Api.request(params ? action + "?" + params : action, {
        method: "PUT",
        data: requestBody,
      })
        .then((response) => {
          if (response.data) {
            resolve(response.data);
          } else {
            reject(response);
          }
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.error
          ) {
            console.error("REST request error!", error.response.data.error);
            reject(error.response.data.error);
          } else reject(error);
        });
    });
  }
  /**
   *Delete Http Request
   * @param {any} action
   * @param {any} params
   */
  delete(action, params = null) {
    return new Promise((resolve, reject) => {
      Api.request(params ? action + "?" + params : action, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.data) {
            resolve(response.data);
          } else {
            reject(response);
          }
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.error
          ) {
            console.error("REST request error!", error.response.data.error);
            reject(error.response.data.error);
          } else reject(error);
        });
    });
  }
}
