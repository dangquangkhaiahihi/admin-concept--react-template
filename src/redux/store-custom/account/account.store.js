import Service from "../../../api/api-service";
import { ApiUrl } from "../../../api/api-url";
import { ApiUrlCustom } from "../../../api/api-url-custom";

const service = new Service();

export const AccountApiService = {
  Login: async (data) => {
    return service
      .post(ApiUrlCustom.Login, data)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      })
  }
}

export const Register = (data) => {
  return service
    .post(ApiUrl.Register, data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const ForgotPassword = (data) => {
  return service
    .post(ApiUrl.ForgotPassword, data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const ResetPassword = (data) => {
  return service
    .post(ApiUrl.ResetPassword, data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const GetDetailAcc = () => {
  return service
    .get(ApiUrl.GetDetailAcc)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const GetScreenAllow = () => {
  return service
    .get(ApiUrl.GetScreenAllow)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
