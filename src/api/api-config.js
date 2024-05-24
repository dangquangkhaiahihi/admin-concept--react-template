const env = process.env.NODE_ENV || "development";

const apiEnvironment = {
  development: {
    api: "https://api.phanmemcskh.vn",
    paht_api: "https://api.phanmemcskh.vn",
    media_url: "https://api.phanmemcskh.vn",
    domainAdminSide: "http://localhost:3000",
    domainUserSide: "http://localhost:3000",
    domainName: "",
    workSpace: "sonla",
    wmsBaseLink: "https://geosonla.cgis.asia/geoserver/sonla/wms/",
    paht_url: 'https://paht-admin.tracuuquyhoachsonla.vn',
  },
  production: {
    api: "https://api.phanmemcskh.vn",
    paht_api: "https://api.phanmemcskh.vn",
    media_url: "https://api.phanmemcskh.vn",
    domainAdminSide: "https://admin.phanmemcskh.vn",
    domainUserSide: "https://phanmemcskh.vn",
    domainName: "phanmemcskh.vn",
    workSpace: "sonla",
    wmsBaseLink: "https://geo.tracuuquyhoachsonla.vn/geoserver/sonla/wms/",
     paht_url: 'https://paht-admin.tracuuquyhoachsonla.vn',
  },
};

module.exports = apiEnvironment[env];
