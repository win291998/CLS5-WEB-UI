<script setup lang="ts">
import type { typeTab } from '@/typescript/enums/enums'

const props = withDefaults(defineProps<Props>(), ({
  listTab: () => ([]),
  type: 'button',
  isSmall: false,
  label: 'tabActive',
}))

const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

interface tab {
  key: string
  title: string
  icon?: string
  component: any
  isRendered: boolean
}
interface Props {
  listTab: tab[]
  type?: typeof typeTab[any]
  isSmall?: boolean
  label?: string
}
const router = useRouter()
const route = useRoute()

const tabActive = ref({})

const getTabActive = () => {
  if (route.params.tabActive && !tabActive.value.tabActive)
    tabActive.value = props.listTab.find(e => e.key === route.params[props.label]) as object
}

getTabActive()

const activeTab = (value: any) => {
  router.push({ params: { [props.label]: value.key } })
  tabActive.value = value
}
</script>

<template>
  <div class="tabs">
    <div class="w-100">
      <VTabs
        v-model="tabActive"
        :class="`cm-tabs ${type}-tabs`"
        :hide-slider="type === 'button'"
        @update:modelValue="activeTab"
      >
        <VTab
          v-for="(item, index) in listTab"
          :key="index"
          :value="item"
          :class="`item-tab ${tabActive.key === item.key ? 'active' : ''} `"
        >
          <VIcon
            v-if="item.icon"
            :icon="item.icon"
            :size="18"
            class="mr-2"
          />
          <span>{{ t(item.title) }}</span>
        </VTab>
      </VTabs>
    </div>
    <div
      v-if="tabActive.component"
      class="content-tab"
    >
      <Component
        :is="tabActive.component"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "/src/styles/style-global" as *;
.cm-tabs {
  width: fit-content;
  text-transform: capitalize !important;
  // background-color: $color-white;
  color: $color-gray-500;
  .v-slide-group__content {
    border-bottom: 1px red solid;
  }
  .item-tab {
    text-transform: capitalize !important;
    border-radius: 6px !important;
  }
}

// kiểu button tab
.button-tabs {
  .active {
    color: $color-primary-700 !important;
    background-color: $color-primary-50 !important;
  }
}

// kiểu underline tab
.underline-tabs {
  border-bottom: 1px solid $color-gray-200;
  .active {
    color: $color-primary-700 !important;
  }
}
.content-tab {
  width: 100%;
  margin-top: 5px;
}
</style>
