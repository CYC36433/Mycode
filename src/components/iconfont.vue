<template>
  <svg class="icon" aria-hidden="true">
    <use ref="use" :xlink:href="'#'+name"></use>
  </svg>
</template>
<script>
export default {
  name: "iconfont",
  props: {
    name: {
      type: String,
      required: true
    }
  },
  mounted() {
  },
  methods: {
  }
};
</script>
<style scoped>
.icon {
  width: 16px;
  height: 16px;
  fill: currentColor;
  overflow: hidden;
  display: inline-block;
}
</style>
