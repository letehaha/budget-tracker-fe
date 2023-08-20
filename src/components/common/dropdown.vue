<template>
  <div
    v-if="isVisible"
    :class="`ui-dropdown--${position}`"
    class="ui-dropdown"
  >
    <slot name="header" />

    <div
      class="ui-dropdown__values"
      role="listbox"
    >
      <template
        v-for="(item, index) in values"
        :key="item"
      >
        <button
          type="button"
          role="option"
          class="ui-dropdown__item"
          :aria-selected="isItemHighlighted(item)"
          :class="{
            'ui-dropdown__item--highlighed': isItemHighlighted(item),
          }"
          @click="emit('select', { item, index })"
        >
          {{ getLabelFromValue(item) }}
        </button>
      </template>
    </div>

    <slot name="footer" />
  </div>
</template>

<script lang="ts" setup>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ValueEntity = any;

const emit = defineEmits<{
  select: [item: { item: ValueEntity, index: number }]
}>();

const props = withDefaults(defineProps<{
  isVisible?: boolean;
  values: ValueEntity[];
  selectedValue: ValueEntity | null;
  labelKey?: string |((value: ValueEntity) => string);
  position?: 'top' | 'bottom';
}>(), {
  isVisible: false,
  position: 'bottom',
  labelKey: 'label',
});

const getLabelFromValue = (value: ValueEntity) => {
  const { labelKey } = props;

  if (typeof labelKey === 'function') return labelKey(value);

  return value[labelKey];
};

const isItemHighlighted = (item: typeof props['selectedValue']) => (
  getLabelFromValue(item) === getLabelFromValue(props.selectedValue)
);
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
