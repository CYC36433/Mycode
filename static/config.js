const _system_config = {
    title: '弘泰全栈框架',
    wxQR: true, //是否启用微信二维码登陆
    host: 'http://localhost:3000',
    map: {
        crs: 'L.CRS.EPSG4490',
        center: {
            lng: 121.619373,
            lat: 29.866033
        },
        zoom: 12,
        maxzoom: undefined,
        minzoom: undefined,
        bounds: undefined, //初始范围
        maxbounds: undefined, //界限范围,拖越范围会回弹 [[40.70081290280357, -74.26963806152345], [40.82991732677597, -74.08716201782228]]
        orther_options: { attributionControl: false }, //其他配置项，参考leaflet的map对象的配置
        baselayers: [
            { name: "道路图", type: "group", inithidden: false, items: ["tianditu.normal.map", "tianditu.normal.annotion"] },
            // { name: "影像图", type: "group", inithidden: true, items: ["tianditu.satellite.map", "tianditu.satellite.annotion"] },
            // { name: "地形图", type: "group", inithidden: true, items: ["tianditu.terrain.map", "tianditu.terrain.annotion"] },
            // { name: "一张图矢量图", type: "arcgis", inithidden: false, url: "http://114.215.249.116:6080/arcgis/rest/services/zjslmap/zjslvectormap/MapServer" },
            // { name: "一张图影像图", type: "arcgis", inithidden: true, url: "http://114.215.249.116:6080/arcgis/rest/services/zjslmap/zjslRasternew/MapServer" }
        ]
    },
    logo: 'logo.png',
    logoWidth: 230,
    panelWidth: 400,

    apiurl: function(method) {
        return SYSCONFIG.apihost + method + "?token=" + SYSCONFIG.token;
    },
    menu: {
        //菜单相关配置
        menuMode: "top", //默认: default 上左右, top 上方顶栏菜单, vertical 左右方式,
        menuLeft: "", // only when menuMode == top
        menuRight: "100px", // only when menuMode == top
        backgroundColor: "#20a0ff",
        textColor: "#fff",
        activeTextColor: "#ffd04b",
    }
}
window.document.title = _system_config.title;
if (typeof module !== 'undefined' && typeof exports === 'object') {
    module.exports = _system_config;
}