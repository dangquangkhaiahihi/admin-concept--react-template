import logoTTQH from "../assets/icon/logoTTQH.png";
import logoPAHT from "../assets/icon/logoPAHT.png";
import logoPTQD from "../assets/icon/logoPTQĐ.png";
import logoAdmin from "../assets/icon/logoAdmin.png";
import { UrlCollection } from "./url-collection";

export const modules = [
  {
    title: "Thông tin quy hoạch",
    url: UrlCollection.QHDT,
    logo: logoTTQH,
    isHomeView: true,
    code: "PLANNING_INFO",
  },
  {
    title: "Phản ánh hiện trường",
    url: UrlCollection.PAHT,
    logo: logoPAHT,
    isHomeView: true,
    code: "REFLECTION",
  },
  {
    title: "Phân tích - quyết định",
    url: UrlCollection.Analysis,
    logo: logoPTQD,
    isHomeView: true,
    code: 'ANALYSIS',
  },
  {
    title: "Quản trị hệ thống",
    url: UrlCollection.EmailTemplate,
    logo: logoAdmin,
    isHomeView: true,
    code: "SYSTEM_MANAGEMENT",
  },
];