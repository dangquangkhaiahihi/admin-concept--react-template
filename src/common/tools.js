import * as ApiConfig from "../api/api-config";
import Cookies from "universal-cookie";
export function ConvertStringToNumberArray(stringData) {
    const result = [];
    stringData.split(',').map((dataNumber) => result.push(Number(dataNumber)))
    return result
}
export function GenerateDeviceId() {
    const cookies = new Cookies();
    var uid = cookies.get("DeviceId");
    if(uid == null)
    {
        const expireTime = new Date();
        const domainName = ApiConfig.domainName;
        expireTime.setTime(expireTime.getTime() + 30 *24 * 60 * 60 * 1000);

        let options = { path: "/", domain: domainName, expires: expireTime };
        cookies.set("DeviceId", uniqueID(), options);
        //localStorage.setItem("DeviceId",uniqueID());
        return uniqueID();
    }
    else
    {
        return uid;
    }
    function uniqueID(){
        function chr4(){
          return Math.random().toString(16).slice(-4);
        }
        return chr4() + chr4() +
          '-' + chr4() +
          '-' + chr4() +
          '-' + chr4() +
          '-' + chr4() + chr4() + chr4();
      }
}
