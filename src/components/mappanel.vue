<template>
    <div class='mappanel'>
        <resize ref='datapanel' class='datapanel' :class='{"hide":!datashow}' :handles="['mr']" axis="x" :draggable="false" :active="true" :w="datawidth">
            <slot>数据区域</slot>
            <div class="side-panel-toggle" title="收起/展开" @click='toggle'>
                <i class="el-icon-caret-left"></i>
            </div>
        </resize>
        <htmap class='divmap' ref="htmap">
            <slot name="map"></slot>
        </htmap>
    </div>
</template>

<script>
    import htmap from "@/components/htmap"
    import SYSCONFIG from "../../static/config"
    import resize from 'vue-draggable-resizable'
    export default {
        name: "mappanel",
        data() {
            return {
                datashow: true,
                map:null,
                $lmap:null
            };
        },
        props: [
            'datawidth'
        ],
        components: {
            htmap,
            resize
        },
        mounted: function() {
            this.$nextTick(() => {
                this.map = this.$refs.htmap.map;
                this.$lmap = this.$refs.htmap.$lmap;
            });
        },
        methods: {
            toggle() {
                this.datashow = !this.datashow
            },
            centerAt: function(lng, lat, marker, animation, zoom) {
                this.map.flyTo([lat, lng], zoom);
                marker && marker.openPopup();
                // 自定义动画
                if (typeof animation == "undefined" || animation) {
                    this._animation(lng, lat);
                }
            },
            _animation: function(lng, lat) {
                var tmp = `<div id="flash-container">
                                                    <div class="el flash-tl"></div>
                                                    <div class="el flash-bl"></div>
                                                    <div class="el flash-tr"></div>
                                                    <div class="el flash-br"></div>
                                                </div>`;
                var myIcon = L.divIcon({
                    html: tmp,
                    className: "map-div-icon",
                    iconSize: [14, 14],
                    iconAnchor: [0, 0]
                });
                var marker = L.marker([lat, lng], {
                    icon: myIcon,
                    zIndexOffset: -10
                }).addTo(this.map);
                setTimeout(function() {
                    marker.remove();
                }, 2000);
            }
        }
    };
</script>

<style scoped>
    .mappanel {
        width: 100%;
        height: 100%;
        position: relative !important;
        background: white;
        overflow: hidden;
    }
    .datapanel {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 1 !important;
        bottom: 0;
        background: white;
        border-right: 1px solid silver;
        height: auto !important;
        transition:transform 0.3s;
    }
    .datapanel .handle {
        z-index: 0;
        border:none;
        height:100%;
        top:0;
        background: rgba(255,255,255,0);
    }
    .datapanel.hide {
        transform: translateX(-100%);
    }
    .datapanel.hide .handle{
        display:none !important;
    }
    
    .datapanel .side-panel-toggle {
        position: absolute;
        display: table;
        top: 50%;
        right: -19px;
        width: 20px;
        height: 60px;
        margin-top: -30px;
        background-color: #ffffff;
        border-top: 1px solid #b7bdc5;
        border-bottom: 1px solid #b7bdc5;
        border-right: 1px solid #b7bdc5;
        border-bottom-right-radius: 3px;
        border-top-right-radius: 3px;
        cursor: pointer;
    }
    .datapanel .side-panel-toggle i {
        display: table-cell;
        vertical-align: middle;
        color: #b7bdc5;
    }
    .datapanel .side-panel-toggle:hover>i {
        color: #3399ff;
    }
    .datapanel.hide .side-panel-toggle i {
        transform: rotateZ(180deg);
    }
    .mappanel .divmap {
        width: 100%;
        height: 100%;
    }
</style>
