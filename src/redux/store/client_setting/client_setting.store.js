import Service from "../../../api/api-service";
import * as Config from "../../../utils/configuration";
import { ApiUrl } from "../../../api/api-url";

const service = new Service();

const CLIENTSETTING = "CLIENT/CLIENTSETTING";

const saveClientSetting = (data) => ({
	type: CLIENTSETTING,
	data:data,
})

const initClientSetting = {
	clientSetting: undefined,
}

export const getSettings = () =>
(dispatch)=>{
	let settings = Config.getCookies("ClientSettings");
	if (settings)
		dispatch(saveClientSetting(settings))
	else {
		service.get(ApiUrl.GetClientSetting).then(res => {
			let clientSettings = res.content;
			Config.setCookies("ClientSettings", clientSettings);
			dispatch(saveClientSetting(clientSettings));
		}).catch(err => {

		});
	}
}

export default function ClientSettingReducer(state = initClientSetting, action)
{
	switch (action.type) {
		case CLIENTSETTING:
			return { ...state, clientSetting: action.data };
		default:
			return state;
	}
}