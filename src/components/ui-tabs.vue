<template>
  <div class="ui-tabs">
    <div class="ui-tabs__header">
      <div
        v-for="item in options"
        :key="item.name"
        class="ui-tabs__header-item"
        :class="{
          'ui-tabs__header-item--active': activeTab.name === item.name,
        }"
        @click="selectTab(item)"
      >
        <span class="ui-tabs__header-item-text">
          {{ item.label }}
        </span>
      </div>
    </div>
    <slot v-bind="{ activeTab }" />
  </div>
</template>

<script lang="ts">
import {
  defineComponent, PropType, ref, Ref, computed, watch,
} from 'vue';

export interface Tab {
  name: string;
  label: string;
}

export enum Events {
  change = 'change',
}

export enum CSSJustifyContentValues {
  spaceBetween = 'space-between',
  spaceAround = 'space-around',
  center = 'center',
  flexStart = 'flex-start',
}

export default defineComponent({
  name: 'ui-tabs',
  props: {
    options: {
      type: Array as PropType<Tab[]>,
      default: (): Tab[] => [{
        name: 'tab',
        label: 'Tab',
      }],
    },
    tabsAlignment: {
      type: String as PropType<CSSJustifyContentValues>,
      default: CSSJustifyContentValues.spaceBetween,
    },
    initialTab: {
      type: Object as PropType<Tab>,
      default: undefined,
    },
  },
  emits: Object.values(Events),
  setup(props, { emit }) {
    const initialTab = props.initialTab ?? props.options[0];
    const activeTab: Ref<Tab> = ref(initialTab);

    const optionsAmount = computed(() => (props.options as Tab[]).length);

    watch(
      () => props.initialTab,
      (value: Tab) => {
        activeTab.value = value;
      },
    );

    const selectTab = (item) => {
      activeTab.value = item;
      emit(Events.change, item);
    };

    return {
      activeTab,
      optionsAmount,
      selectTab,
    };
  },
});
</script>

<style lang="scss">
.ui-tabs__header {
  display: flex;
  justify-content: v-bind(tabsAlignment);
  align-items: center;
  gap: 24px;
  height: 50px;
}

.ui-tabs__header-item {
  font-size: 14px;
  line-height: 1.21;
  cursor: pointer;
  color: var(--app-on-surface-color);
}

.ui-tabs__header-item--active {
  color: var(--primary-500);
}
</style>
