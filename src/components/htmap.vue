<template>
  <l-map ref="lmap" class="lmap" :crs="crs" :center="center" :zoom="zoom" :maxZoom="maxzoom" :minZoom="minzoom" :bounds="bounds" :maxBounds="maxbounds" :options="options">
    <l-control-layers></l-control-layers>
    <template v-for="(m) in mapconfig.baselayers">
        <l-layer-group layerType="base" v-if="m.type==='group'" :name="m.name" :initHidden="m.inithidden">
            <l-tile-layer v-for="(item,index) in m.items" :key="index" :tileLayerClass="getgisclass(item)" :url="geturl(item)" :options="getlayeroptioins(item)" :isArcgis="item.type==='arcgis'"></l-tile-layer>
        </l-layer-group>
        <l-tile-layer layerType="base" v-else :url="geturl(m)" :tileLayerClass="getgisclass(m)" :name="m.name" :initHidden="m.inithidden" :options="getlayeroptioins(m)" :isArcgis="m.type==='arcgis'"></l-tile-layer>
    </template>
    <slot></slot>
  </l-map>
</template>

<script>
import L from "leaflet";
import CONFIG from "../../static/config"
import { tiledMapLayer as esriMap } from "esrilib"
import { tiledMapLayer as superMap } from 'supermaplib'
import {
  LMap,
  LTileLayer,
  LMarker,
  LControlLayers,
  LLayerGroup
} from "@/components/vue2leaflet";

var thirdmap = {
    "tianditu.normal.map":"http://t{s}.tianditu.cn/DataServer?T=vec_w&X={x}&Y={y}&L={z}",
    "tianditu.normal.annotion":"http://t{s}.tianditu.cn/DataServer?T=cva_w&X={x}&Y={y}&L={z}",
    "tianditu.satellite.map":"http://t{s}.tianditu.cn/DataServer?T=img_w&X={x}&Y={y}&L={z}",
    "tianditu.satellite.annotion":"http://t{s}.tianditu.cn/DataServer?T=cia_w&X={x}&Y={y}&L={z}",
    "tianditu.terrain.map":"http://t{s}.tianditu.cn/DataServer?T=ter_w&X={x}&Y={y}&L={z}",
    "tianditu.terrain.annotion":"http://t{s}.tianditu.cn/DataServer?T=cta_w&X={x}&Y={y}&L={z}",
    "gaode.normal.map":"http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
    "gaode.satellite.map":"http://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
    "gaode.satellite.annotion":"http://webst0{s}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}",
    "google.normal.map":"http://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}",
    "google.normal.satellite":"http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}"
};
var subdomains = {
    "tianditu":['0', '1', '2', '3', '4', '5', '6', '7'],
    "gaode":["1", "2", "3", "4"]
};

export default {
  name: "example",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LControlLayers,
    LLayerGroup
  },
  data() {
    return {
      mapconfig:CONFIG.map,
      crs:eval(CONFIG.map.crs),
      center:[CONFIG.map.center.lat,CONFIG.map.center.lng],
      zoom:CONFIG.map.zoom,
      maxzoom:CONFIG.map.maxzoom,
      minzoom:CONFIG.map.minzoom,
      bounds:CONFIG.map.bounds,
      maxbounds:CONFIG.map.maxbounds,
      options: CONFIG.map.orther_options,
      map: null,
      $lmap: null
    };
  },
  computed:{
  },
  mounted() {
    this.$nextTick(() => {
        this.$lmap = this.$refs.lmap;
        this.map = this.$lmap.mapObject;
    });
  },
  methods:{
      geturl(m){
          m=(typeof m)==="string"?{type:"third",name:'',url:m}:m;
          if(m.type === "third"){
              return thirdmap[m.url]
          }else{
              return m.url;
          }
      },
      getlayeroptioins(m){
          m=(typeof m)==="string"?{type:"third",name:'',url:m}:m;
          var sd = subdomains[m.url.split('.')[0]];
          return {
              subdomains:sd || []
          };
      },
      getgisclass(m){
          m=(typeof m)==="string"?{type:"third",name:'',url:m}:m;
          if(m.type==="arcgis"){
              return esriMap;
          }else if(m.type === "supermap"){
              return superMap;
          }else{
              return L.tileLayer;
          }
      }
  }
};
</script>
<style scoped>
.lmap{width:100%;height:100%;z-index:0;}
</style>
