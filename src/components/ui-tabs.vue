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

<script setup lang="ts">
import { ref, watch, CSSProperties } from 'vue';

interface Tab {
  name: string;
  label: string;
}

const emit = defineEmits<{
  change: [value: Tab]
}>();

defineOptions({
  name: 'ui-labs',
});

const props = withDefaults(defineProps<{
  options: Tab[];
  initialTab?: Tab;
  tabsAlignment?: CSSProperties['justifyContent'];
}>(), {
  tabsAlignment: 'space-between',
  initialTab: undefined,
});

const initialTab = props.initialTab ?? props.options[0];
const activeTab = ref(initialTab);

watch(() => props.initialTab, value => {
  activeTab.value = value;
});

const selectTab = (item: Tab) => {
  activeTab.value = item;
  emit('change', item);
};
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
  color: var(--app-text-base);
}

.ui-tabs__header-item--active {
  color: var(--app-primary);
}
</style>
