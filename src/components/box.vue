<template>
  <div class="box">
    <slot />
  </div>
</template>

<style lang="scss">
.box {
  @include ui-box();
}
</style>
