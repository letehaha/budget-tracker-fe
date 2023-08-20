<template>
  <div
    v-if="isVisible"
    :class="`ui-dropdown--${position}`"
    class="ui-dropdown"
  >
    <slot name="header" />

    <div class="ui-dropdown__values">
      <template
        v-for="item in values"
        :key="item"
      >
        <button
          type="button"
          class="ui-dropdown__item"
          :class="{
            'ui-dropdown__item--highlighed': isItemHighlighted(item),
          }"
          @click="emit('select', item)"
        >
          {{ item }}
        </button>
      </template>
    </div>

    <slot name="footer" />
  </div>
</template>

<script lang="ts" setup>
interface ValueEntity {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  label: string;
}

const emit = defineEmits<{
  select: [item: string | ValueEntity]
}>();

const props = withDefaults(defineProps<{
  isVisible?: boolean;
  values: string[] | ValueEntity[];
  selectedValue: string | ValueEntity | null;
  position?: 'top' | 'bottom';
}>(), {
  isVisible: false,
  position: 'bottom',
});

const isItemHighlighted = (item: typeof props['selectedValue']) => {
  if (typeof item === 'string') return props.selectedValue === item;

  return item.value === (props.selectedValue as ValueEntity).value;
};
</script>

<style lang="scss">
.ui-dropdown {
  @include dropdown-shadow();

  position: absolute;
  top: 100%;
  width: 100%;
  left: 0;
  visibility: visible;
  opacity: 1;
  padding: 8px 0;
  transition: 0.2s ease-out;
  background-color: var(--app-surface-color);
  z-index: var(--z-select-field);
  border-radius: 4px;
}

.ui-dropdown__values {
  overflow: auto;
  max-height: 200px;
}

.ui-dropdown__item {
  display: flex;
  align-items: center;
  transition: background-color 0.3s ease-out;
  border: none;
  background-color: var(--app-surface-color);
  font-size: 14px;
  line-height: 1.2;
  color: var(--app-on-surface-color);
  padding: 16px;
  width: 100%;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;

  &--highlighed {
    background-color: var(--app-bg-color);
  }

  &:hover {
    background-color: var(--app-bg-color);
  }
}
</style>
