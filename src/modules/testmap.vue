<template>
  <mappanel>
    数据区域ddd
    <template slot="map">
      <l-marker :lat-lng="marker"></l-marker>
    </template>
  </mappanel>
</template>

<script>
import mappanel from "@/components/mappanel";
import { LMarker } from '@/components/vue2leaflet';
export default {
    name: 'testmap',
    components:{
      mappanel,LMarker
    },
    data () {
        return {
          marker: L.latLng(29.866033,121.619373),
        }
    },
    methods: {
    }
}
</script>

<style>
</style>
