<template>
  <div
    v-click-outside="closeDropdown"
    :class="{
      'language-selector--active': isDropdownOpened,
      'language-selector--to-bottom': toBottom,
    }"
    class="language-selector"
    @click="toggleDropdown"
  >
    <div class="language-selector__icon">
      <img
        :src="selectedLang.imageSrc"
        :alt="`${selectedLang.name} flag`"
      >
    </div>
    <div
      :title="$t(selectedLang.name)"
      class="language-selector__selected"
    >
      {{ $t(selectedLang.name) }}
      <div class="language-selector__langs">
        <template v-for="lang in LANGUAGES" :key="lang.code">
          <div
            :class="{ 'language-selector__lang--selected': lang.code === selectedLang.code}"
            class="language-selector__lang"
            @click="selectLanguage(lang)"
          >
            <img
              :src="lang.imageSrc"
              :alt="`${lang.name} flag`"
            >
            <div
              :title="$t(lang.name)"
              class="language-selector__lang-name"
            >
              {{ $t(lang.name) }}
            </div>
          </div>
        </template>
      </div>
    </div>
    <div
      class="language-selector__arrow"
      :class="{'language-selector__arrow--opened': isDropdownOpened}"
    />
  </div>
</template>

<script>
import config from '@/config/index';

const LANGUAGES = config.SUPPORTED_LANGUAGES.map(lang => ({
  ...lang,
  imageSrc: require(`@/assets/icons/flags/${lang.code}.svg`),
}));

export default {
  props: {
    toBottom: { type: Boolean, default: false },
  },
  data: () => ({
    LANGUAGES,
    selectedLang: null,
    isDropdownOpened: false,
  }),
  created() {
    this.selectedLang = LANGUAGES.find(i => i.code === this.$i18n.locale);
  },
  methods: {
    selectLanguage(lang) {
      this.$i18n.setLocale(lang.code);
      this.selectedLang = lang;
    },
    closeDropdown() {
      this.isDropdownOpened = false;
    },
    toggleDropdown() {
      this.isDropdownOpened = !this.isDropdownOpened;
    },
  },
};
</script>

<style lang="scss" scoped>
.language-selector {
  padding: 14px 16px;
  border: 1px solid #000000;
  border-radius: 4px;
  position: relative;
  height: 48px;

  font-weight: 400;
  font-size: 16px;
  line-height: 1.2;
  color: #ffffff;
  background-color: #000000;
  cursor: pointer;
  transition: 0.3s ease-out;
  width: 182px;

  &:hover {
    background-color: #000000;
  }

  display: flex;
  align-items: center;
}

.language-selector--active {
  background-color: #000000;
}

.language-selector__selected {
  padding-right: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.language-selector__icon {
  height: 15px;
  margin-right: 8px;

  img {
    height: 100%;
  }
}

.language-selector__langs {
  position: absolute;
  bottom: calc(100% + 5px);
  padding: 8px;
  width: 100%;
  left: 0;
  visibility: hidden;
  opacity: 0;
  transition: 0.2s ease-out;
  background-color: #000000;

  .language-selector--to-bottom & {
    top: calc(100% + 5px);
    bottom: inherit;
  }

  .language-selector--active & {
    visibility: visible;
    opacity: 1;
  }
}

.language-selector__lang {
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: 0.3s ease-out;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  position: relative;

  &:hover {
    background-color: #000000;
  }

  img {
    height: 16px;
    margin-right: 10px;
    flex: none;
  }
}

.language-selector__lang--selected {
  background-color: #000000;

  &:after,
  &:before {
    content: '';
    background-color: #ffffff;
    border-radius: 2px;
    height: 2px;
    position: absolute;
    right: 14px;
  }

  &:after {
    width: 8px;
    right: 26px;
    top: 17px;
    transform: rotate(45deg);
  }

  &:before {
    width: 16px;
    transform: rotate(-45deg);
  }
}

.language-selector__lang-name {
  border: none;
  background-color: transparent;
  font-size: 14px;
  line-height: 1.2;
  color: #ffffff;
  width: 100%;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
}

.language-selector__arrow {
  position: absolute;
  width: 20px;
  height: 20px;
  top: calc(50% - 11px);
  right: 10px;

  &:after,
  &:before {
    content: '';
    position: absolute;
    width: 9px;
    height: 2px;
    background-color: #ffffff;
    border-radius: 2px;
    transition: 0.1s ease-out;
  }

  &:after {
    transform: rotate(-45deg);
    left: 9px;
    top: 9px;
  }

  &:before {
    transform: rotate(45deg);
    left: 3px;
    top: 9px;
  }

  &--opened {
    &:after {
      transform: rotate(45deg);
    }

    &:before {
      transform: rotate(-45deg);
    }
  }
}
</style>
