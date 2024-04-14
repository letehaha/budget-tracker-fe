<template>
  <div v-if="isVisible" :class="`ui-dropdown--${position}`" class="ui-dropdown">
    <slot name="header" />

    <div class="ui-dropdown__values" role="listbox">
      <template v-if="virtualScroll">
        <RecycleScroller
          v-slot="{ item, index }: { item: T; index: number }"
          :items="values"
          :item-size="itemSize"
          :style="{ height: virtualScrollHeight }"
          :key-field="keyField"
        >
          <template v-if="$slots.item">
            <slot name="item" v-bind="{ item }" />
          </template>
          <template v-else>
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
        </RecycleScroller>
      </template>
      <template v-else>
        <template v-for="(item, index) in values" :key="item">
          <template v-if="$slots.item">
            <slot name="item" v-bind="{ item, index }" />
          </template>
          <template v-else>
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
        </template>
      </template>
    </div>

    <slot name="footer" />
  </div>
</template>

<script lang="ts" setup generic="T extends Record<string, any>">
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import { RecycleScroller } from "vue-virtual-scroller";
import { computed } from "vue";

const emit = defineEmits<{
  select: [item: { item: T; index: number }];
}>();

type BaseProps = {
  isVisible?: boolean;
  values: T[];
  selectedValue?: T | null;
  labelKey?: keyof T | ((value: T) => string) | "label";
  position?: "top" | "bottom";
};
type VirtualScrollProps = BaseProps & {
  virtualScroll: true;
  itemSize: number;
  maxHeight: number | string;
  keyField?: string;
};

type NonVirtualScrollProps = BaseProps & {
  virtualScroll?: false;
  itemSize?: never;
  maxHeight?: never;
  keyField?: never;
};

type ComponentProps = VirtualScrollProps | NonVirtualScrollProps;

const props = withDefaults(defineProps<ComponentProps>(), {
  isVisible: false,
  selectedValue: null,
  labelKey: "label",
  position: "bottom",

  maxHeight: 250,
  itemSize: 50,
  keyField: "id",
});

const virtualScrollHeight = computed(() => {
  const { maxHeight } = props;
  return typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight;
});

const getLabelFromValue = (value: T) => {
  const { labelKey } = props;

  if (!value) return null;
  if (typeof labelKey === "function") return labelKey(value);

  return value[labelKey];
};

const isItemHighlighted = (item: T) =>
  getLabelFromValue(item) === getLabelFromValue(props.selectedValue);
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
