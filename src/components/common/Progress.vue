<template>
  <div class="progress">
    <span :style="{ width: `${currentWidth}%` }" />
  </div>
</template>

<script>
export default {
  props: {
    progress: { type: [String, Number], required: true },
    maxProgress: { type: [String, Number], default: 100 },
  },
  computed: {
    currentWidth() {
      return (Number(this.maxProgress) / 100) * Number(this.progress);
    },
  },
  watch: {
    progress(value) {
      this.validateProgressValue(value);
    },
  },
  mounted() {
    this.validateProgressValue(this.progress);
  },
  methods: {
    validateProgressValue(value) {
      if (value > this.maxProgress) {
        // eslint-disable-next-line no-console
        console.error(
          `["Progress" component]: current progress value is ${value}, but maximum allowed is ${this.maxProgress}. Override default "maxProgress" value using props to have right visualization!`,
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$height: 14px;

.progress {
  width: 100%;
  height: $height;
  border-radius: 7px;
  background-color: #c4c8cd;

  span {
    transition: width 0.3s ease-out;
    display: block;
    height: 100%;
    background-color: blue;
    border-radius: 7px;
    background-image: linear-gradient(
      -45deg,
      rgba(255, 255, 255, 0.2) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0.2) 75%,
      transparent 75%,
      transparent
    );
    background-size: $height * 2 $height * 2;
  }
}
</style>
