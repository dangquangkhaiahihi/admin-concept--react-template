import axios from 'axios';
import * as apiConfig from './api-config';
import * as configuration from '../utils/configuration';
import * as Page500ErrorTypes from '../common/error-types-500';

configuration.setConfiguration(
  configuration.ApiServerKey.APP_API_ROOT,
  apiConfig.paht_api
);
const apiRoot = configuration.getConfiguration(
  configuration.ApiServerKey.APP_API_ROOT
);
const isHandlerEnabled = true;

const requestHandler = (request) => {
  if (isHandlerEnabled) {
    // request.headers.common["Accept"] = "application/json";
    request.headers.common['Content-Type'] = 'application/json; charset=utf-8';
    request.headers.common['Accept'] =
      'application/json, text/javascript, */*; q=0.01';
    request.headers.common['Access-Control-Allow-Origin'] = '*';
  }

  let userInfo = configuration.getCookies(configuration.TokenKey.token);
  console.log('userInfo',userInfo)
if (userInfo) {
    request.headers.common[
      'Authorization'
    ] = `${configuration.TokenPrefix} ${userInfo}`;
  }

  return request;
};

const successHandler = (response, isHandlerEnabled) => {
  if (isHandlerEnabled) {
    //TODO: Do Success Handler
  }

  return response;
};

const errorHandler = async (error, isHandlerEnabled) => {
  if (isHandlerEnabled) {
    //TODO: Do Error Handler
  }

  if (
    error.request.responseType === 'blob' &&
    error.response.data instanceof Blob &&
    error.response.data.type &&
    error.response.data.type.toLowerCase().indexOf('json') != -1
  ) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = () => {
        error.response.data = JSON.parse(reader.result);
        resolve(Promise.reject(error.response.data));
      };

      reader.onerror = () => {
        reject(error);
      };
      reader.readAsText(error.response.data);
    });
  }

  return Promise.reject({
    ...(error.response
      ? error.response.data
      : {
          errorType: Page500ErrorTypes.UnhandleException,
          errorMessage: 'UnhandleException',
        }),
  });
};

export default class Service {
  constructor(namespace) {
    this.namespace = namespace;
    this.axios = axios.create({
      baseURL: apiRoot,
      responseType: 'json',
    });

    //Enable request interceptor
    this.axios.interceptors.request.use(
      (request) => requestHandler(request, isHandlerEnabled),
      (error) => errorHandler(error, isHandlerEnabled)
    );

    //Response and Error handler
    this.axios.interceptors.response.use(
      (response) => successHandler(response, isHandlerEnabled),
      (error) => errorHandler(error, isHandlerEnabled)
    );
  }

  /**
   * Get Http Request
   * @param {any} action
   */
  get(action, params) {
    return new Promise((resolve, reject) => {
      this.axios
        .request(params ? action + '?' + params : action, {
          method: 'GET',
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
            console.error('REST request error!', error.response.data.error);
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
      this.axios
        .request(params ? action + '?' + params : action, {
          method: 'GET',
          responseType: 'blob',
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
            console.error('REST request error!', error.response.data.error);
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
  post(action, params, config = {}) {
    return new Promise((resolve, reject) => {
      this.axios
        .post(action, params, config)
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
            console.error('REST request error!', error.response.data.error);
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
  put(action, params, config = {}) {
    return new Promise((resolve, reject) => {
      this.axios
        .put(action, params, config)
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
            console.error('REST request error!', error.response.data.error);
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
      this.axios
        .request(action + '?' + params, {
          method: 'POST',
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
            console.error('REST request error!', error.response.data.error);
            reject(error.response.data.error);
          } else reject(error);
        });
    });
  }

  /**
   * Delete Http Request
   * @param {any} action
   * @param {any} params
   */
  delete(action, params) {
    return new Promise((resolve, reject) => {
      this.axios
        .request(action + '?' + params, {
          method: 'DELETE',
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
            console.error('REST request error!', error.response.data.error);
            reject(error.response.data.error);
          } else reject(error);
        });
    });
  }
}
