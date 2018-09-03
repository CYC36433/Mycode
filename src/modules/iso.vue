<template>
  <mappanel :datawidth="388" ref="mappanel">
    <el-tabs tab-position="left">
      <el-tab-pane>
        <span slot="label">
          <i class="el-icon-location-outline"></i>
        </span>
        <div style="padding:10px;line-height:40px;">
          <el-input placeholder="行政区" v-model="keyword"></el-input>
          <el-button type="primary" size="small" @click="getLines">获取边界</el-button><br> 边界
          <el-switch v-model="vcityline"></el-switch>
          边框
          <el-switch v-model="vrectangle"></el-switch>
          间距
          <el-input-number v-model="offset" :precision="2" :step="0.05" :max="1" size="mini"></el-input-number>
          <div>
            width:{{info.width}}<br> height:{{info.height}}
            <br> xmin:{{info.xmin}}
            <br> xmax:{{info.xmax}}
            <br> ymin:{{info.ymin}}
            <br> ymax:{{info.ymax}}
            <br>
          </div>
          <el-input v-model="chouxi" style="width:60px;"></el-input>
          <el-button @click='downbln'>导出bln文件</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label">
          <i class="el-icon-edit"></i>
        </span>
        <el-form label-position="top">
          <el-form-item>
            <span style="text-align:center;display:inline-block; margin-top:20px; width:80%">等值线绘制</span>
            <el-button type="primary" icon="el-icon-arrow-left" size="mini"></el-button>
          </el-form-item>
          <el-form-item label="时间选择" class="timeselect">
            <div style="width:95%;">
              <el-button-group style='width:100%'>
                <el-button type="primary" size="medium" plain style='width:25%;'>1H</el-button>
                <el-button type="primary" size="medium" plain style='width:25%;'>3H</el-button>
                <el-button type="primary" size="medium" plain style='width:25%;'>6H</el-button>
                <el-button type="primary" size="medium" plain style='width:25%;'> 12H</el-button>
              </el-button-group>
              <el-button-group style='margin-top:5px;width:100%'>
                <el-button type="primary" size="medium" plain style='width:25%;'>1D</el-button>
                <el-button type="primary" size="medium" plain style='width:25%;'>2D</el-button>
                <el-button type="primary" size="medium" plain style='width:25%;'>3D</el-button>
                <el-button type="primary" size="medium" plain style='width:25%;'>自定义</el-button>
              </el-button-group>
            </div>
          </el-form-item>
          <el-form-item label="雨量间隔(mm)">
            <div style='text-align:center;'>
              <el-input-number v-model="interval" :step="5" :max="100" size="mini"></el-input-number>
            </div>
          </el-form-item>
          <el-form-item label="级别区分(mm)" class="level">
            <div style="width=90%">
              <el-checkbox-group v-model="level">
                <el-checkbox label="1">
                  <el-input v-model="level1" size='mini' style='width:100px'></el-input>
                </el-checkbox>
                <el-checkbox label="2">
                  <el-input v-model="level2" size='mini' style='width:100px'></el-input>
                </el-checkbox>
                <br>
                <el-checkbox label="3">
                  <el-input v-model="level3" size='mini' style='width:100px'></el-input>
                </el-checkbox>
                <el-checkbox label="4">
                  <el-input v-model="level4" size='mini' style='width:100px'></el-input>
                </el-checkbox>
                <br>
                <el-checkbox label="5">
                  <el-input v-model="level5" size='mini' style='width:100px'></el-input>
                </el-checkbox>
                <el-checkbox label="6">
                  <el-input v-model="level6" size='mini' style='width:100px'></el-input>
                </el-checkbox>
                <!-- <el-radio :label="15" border>15</el-radio>
                <el-radio :label="30" border>30</el-radio>
                <el-radio :label="45" border>45</el-radio>
                <el-radio :label="60" border>60</el-radio>
                <el-radio :label="75" border>75</el-radio>
                <el-radio :label="90" border>90</el-radio> -->
              </el-checkbox-group>
            </div>
            <el-button type="primary" size="medium" style='width:42%'>等值线</el-button>
            <el-button type="primary" size="medium" style='width:42%'>等值面</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label">
          <i class="el-icon-setting"></i>
        </span>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label">
          <i class="el-icon-picture-outline"></i>
        </span>
      </el-tab-pane>
    </el-tabs>
  </mappanel>
</template>

<script>
import mappanel from "@/components/mappanel";
import request from "@/util/request";
export default {
  name: "isovue",
  components: {
    mappanel: mappanel
  },
  data() {
    return {
      keyword: "浙江",
      map: null,
      cityline: null,
      rectangle: null,
      offset: 0.5,
      interval: 15,
      level: ['1','2','3','4','5','6'],
      level1:15,
      level2:30,
      level3:45,
      level4:60,
      level5:75,
      level6:90,
      vrectangle: true,
      vcityline: true,
      info: {
        width: 0,
        heiht: 0,
        xmin: 0,
        xmax: 0,
        ymin: 0,
        ymax: 0
      },
      blndata: null,
      chouxi: 0
    };
  },
  computed: {},
  watch: {
    cityline() {
      this.setRectangle();
      this.cityline.addTo(this.map);
    },
    vcityline() {
      if (this.cityline) {
        if (this.vcityline) {
          this.cityline.addTo(this.map);
        } else {
          this.cityline.remove();
        }
      }
    },
    offset() {
      this.rectangle && this.rectangle.remove();
      this.setRectangle();
    },
    rectangle() {
      if (this.rectangle && this.vrectangle) {
        this.rectangle.addTo(this.map);
        this.setInfo();
      }
    },
    vrectangle() {
      if (this.rectangle) {
        if (this.vrectangle) {
          this.rectangle.addTo(this.map);
        } else {
          this.rectangle.remove();
        }
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.map = this.$refs.mappanel.map;
      var vm = this;
      this.map.on("moveend", e => {
        vm.setInfo();
      });
    });
  },
  methods: {
    getLines() {
      if (this.cityline) this.cityline.remove();
      if (this.rectangle) this.rectangle.remove();
      this.vrectangle = this.vcityline = true;
      let p = {
        key: "f15f6ad47fbda0087c7f06aaf4923753",
        keywords: this.keyword,
        subdistrict: 0,
        extensions: "all"
      };
      request.jsonp("http://restapi.amap.com/v3/config/district", p).then(r => {
        let city = r.districts[0];
        this.map.panTo(city.center.split(",").reverse());

        this.blndata = city.polyline;

        let polylineArray = city.polyline.split("|").map(line => {
          let latlngs = line.split(";").map(o => {
            return o.split(",").reverse();
          });
          return L.polyline(latlngs, { color: "red", weight: 2 });
        });

        if (this.cityline) this.cityline.clearLayers();
        this.cityline = L.featureGroup(polylineArray);
      });
    },
    setRectangle() {
      if (!this.cityline) return;
      let b = this.cityline.getBounds();
      let bounds = [
        [b.getNorth() + this.offset, b.getWest() - this.offset],
        [b.getSouth() - this.offset, b.getEast() + this.offset]
      ];
      this.rectangle = L.rectangle(bounds, {
        color: "blue",
        weight: 1,
        fill: false
      });
    },
    setInfo() {
      setTimeout(() => {
        var info = { width: 0, height: 0 };
        if (this.rectangle) {
          let svg = this.rectangle.getElement().getBBox();
          info.width = svg.width;
          info.height = svg.height;

          let b = this.rectangle.getBounds();
          info.xmin = b.getWest();
          info.xmax = b.getEast();
          info.ymin = b.getSouth();
          info.ymax = b.getNorth();
        }
        this.info = info;
      }, 200);
    },
    downbln() {
      if (!this.blndata) return;
      var arr = this.blndata.split("|").map(line => {
        return line.split(";").map(pstr => {
          let pointArray = pstr.split(",");
          let x = +pointArray[0],
            y = +pointArray[1];
          //归零
          x = x - this.info.xmin;
          y = y - this.info.ymin;
          //处理比例
          let xbili = this.info.width / (this.info.xmax - this.info.xmin);
          let ybili = this.info.height / (this.info.ymax - this.info.ymin);
          x = x * xbili;
          y = y * ybili;
          //相对X轴翻转
          y = this.info.height - y;
          return { X: x, Y: y };
        });
      });

      //抽稀
      if (this.chouxi > 0) {
        var dd = [];
        arr.forEach((a, i) => {
          let l = a.filter((o, j) => {
            return j % this.chouxi === 0;
          });
          dd.push(l);
        });
        arr = dd;
      }

      let a = document.createElement("a");
      a.setAttribute("href", "data:text/plain," + JSON.stringify(arr));
      a.setAttribute("download", "重命名bln文件.bln");
      a.setAttribute("target", "_blank");
      a.style.display = "none";
      this.$el.parentNode.appendChild(a);
      a.click();
    }
  }
};
</script>

<style scoped>
/* .timeselect .el-button{
  
} */
.level .el-radio{
  margin-left: 30px;
}
</style>
