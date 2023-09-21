<script lang="ts" setup>
import CmCollapse from './CmCollapse.vue'

interface Props {
  items: Item[]
}

interface Item {
  id: any
  code: string
  name: string
  icon: string
  isShow: boolean
  items: Item[]
}
interface Emit {
  (e: 'change', val: Item): void
}
const props = withDefaults(defineProps<Props>(), {})
const emit = defineEmits<Emit>()
const { t } = window.i18n()
const isShow = ref(false)
const rail = ref(false)
const drawer = ref(true)
const idxbf = ref<any>(-1)
function handleActiveNavItem(idx: number, item: Item, idxParent: number) {
  const position = `${idxParent}${idx}`
  if (idxbf.value === idx)
    return
  const element = document.getElementById(`nav-item${position}`)
  if (idxbf.value !== -1) {
    const el = document.getElementById(`nav-item${idxbf.value}`)
    el?.classList.remove('nav-item-active')
  }
  element?.classList.add('nav-item-active')
  emit('change', item)
  idxbf.value = position
}

function showChildren(idx: number, val: boolean) {
  // eslint-disable-next-line vue/no-mutating-props
  props.items[idx].isShow = !val
}
</script>

<template>
  <div class="cm-menu">
    <VLayout style="width: 100%; height: 100%;">
      <VNavigationDrawer
        v-model="drawer"
        :rail="rail"
        permanent
      >
        <div>
          <slot name="header" />
        </div>

        <VList
          class="list-item"
          density="compact"
          nav
        >
          <div
            v-for="(item, idx) in items"
            :id="`${item.code}${item.id}`"
            :key="item.id"
          >
            <VListItem
              value="home"
              color="gray"
              :rounded="false"
              class="d-flex align-center h-100"
              tag="div"
              @click="showChildren(idx, item.isShow)"
            >
              <div class="text-medium-md">
                <VIcon
                  :icon="item.icon"
                  :size="20"
                />
                <span class="ml-2 text-medium-md">{{ t(item.code) }}</span>
              </div>
            </VListItem>
            <CmCollapse
              :key="idx"
              :is-show="item.isShow"
            >
              <ul
                class="nav-group-children"
              >
                <li
                  v-for="(i, index) in items[0].items"
                  :id="`nav-item${idx}${index}`"
                  :key="i.id"
                  @click="handleActiveNavItem(index, i, idx)"
                >
                  {{ t(i.code) }}
                </li>
              </ul>
            </CmCollapse>
          </div>
        </VList>
      </VNavigationDrawer>
      <VMain style="height: 100% !important; width: 100%;">
        <slot name="content" />
      </VMain>
    </VLayout>
  </div>
</template>

<style lang="scss">
@use '@/styles/style-global.scss' as *;
.cm-menu {
  height: inherit;
  width: inherit;
  .v-navigation-drawer {
    background: transparent !important;
    .v-navigation-drawer__content {
      .v-list {
        background: $color-white !important;
        border: 1px solid $color-gray-200;
        border-radius: $border-radius-xs;
        margin-top: 24px;
        padding: 0 !important;
        .v-list-item {
          padding: 16px;
          margin-bottom: 0 !important;
          border-bottom-left-radius: unset;
          border-bottom-right-radius: unset;
        }
        .v-list-item--active {
          background-color: $color-gray-100 !important;
            box-shadow: unset !important;
            border: unset;
          .v-list-item__overlay {
            background-color: transparent;
            box-shadow: unset !important;
            border: unset;
          }
          .v-list-item__underlay {
            display: none;
          }
        }
        .nav-group-children {
          [id*=nav-item] {
            cursor: pointer;
            padding: 12px 16px;
          }
          .nav-item-active {
            background-color: $color-primary-50;
            border-left: 4px solid $color-primary-600;
          }

        }
      }
    }
  }
}
@keyframes fadeIn{
  0%{
    transform: translateY(-100%);
  }
  100%{
    transform: translateY(0);
  }
}
@keyframes fadeOut{
  0%{
    transform: translateY(100%);
  }
  100%{
    transform: translateY(0);
  }
}
</style>
