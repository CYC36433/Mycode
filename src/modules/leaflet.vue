<template>
  <htmap>
    <l-tile-layer :url="url" layerType="overlay" name="叠加"></l-tile-layer>
    <l-marker :lat-lng="marker"></l-marker>
  </htmap>
</template>

<script>
import htmap from "@/components/htmap";
import { LTileLayer, LMarker } from '@/components/vue2leaflet';
export default {
    name: 'leaflettest',
    components:{
      htmap,LMarker,LTileLayer
    },
    data () {
        return {
          url:'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
          marker: L.latLng(29.866033,121.619373),
        }
    },
    methods: {
    }
}
</script>

<style>
</style>
