<template>
  <div
    class="burger"
    :class="{ 'burger--opened': isActive }"
    :style="burgerStyles"
    @click="onClick"
  >
    <i :style="linesStyles" />
    <i :style="linesStyles" />
    <i :style="linesStyles" />
  </div>
</template>

<script>
/**
  Example of usage:

  1. Firstly, import Burger to your component.
  ```
  import Burger from '@/components/common/Burger';
  ```
  2. Then define Burger in the "components" property.
  3. Add Burger to the template.
  ```
    <Burger
      :is-active="isBurgerActive"
      @clicked="toggleBurger"
    />
  ```
  4. Define Burger's active state in the "data' property.
  ```
  export default {
    data: () => ({
      isBurgerActive: false,
    }),
  }
  ```
  5. Define Burger's status change handler in the "methods" property.

 */

export default {
  props: {
    isActive: { type: Boolean, required: true },
    linesStyles: { type: Object, required: false, default: () => ({}) },
    burgerStyles: { type: Object, required: false, default: () => ({}) },
  },
  methods: {
    onClick() {
      this.$emit('clicked');
    },
  },
};
</script>

<style lang="scss" scoped>
.burger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  position: relative;
  cursor: pointer;

  i {
    position: absolute;
    left: 0;
    top: 50%;
    width: 100%;
    height: 2px;
    overflow: hidden;
    background-color: #ffffff;
    border-radius: 1px;
    transition: transform ease 0.25s, opacity ease 0.25s, visibility ease 0.25s;
    opacity: 1;
    visibility: visible;

    &:first-child { margin-top: -6px; }
    &:last-child { margin-top: 6px; }
  }
}

.burger--opened i:nth-child(2) {
  opacity: 0;
  visibility: hidden;
}

.burger--opened i:first-child {
  margin-top: 0;
  transform: rotate(45deg);
}

.burger--opened i:last-child {
  margin-top: 0;
  transform: rotate(135deg);
}
</style>
