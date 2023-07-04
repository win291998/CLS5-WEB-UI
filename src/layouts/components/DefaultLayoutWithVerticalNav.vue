<script lang="ts" setup>
// Composable
import { useSkins } from '@core/composable/useSkins'
import { useThemeConfig } from '@core/composable/useThemeConfig'

// Components
import Footer from '@/layouts/components/Footer.vue'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import UserProfile from '@/layouts/components/UserProfile.vue'
import CmBreadcrumb from '@/components/common/CmBreadcrumb.vue'
import { useStoreMenu } from '@/stores/menu'

// @layouts plugin
import { VerticalNavLayout } from '@layouts'

const { appRouteTransition, isLessThanOverlayNavBreakpoint } = useThemeConfig()
const { width: windowWidth } = useWindowSize()

// `layoutAttrs` provides skin classes and vertical nav props for semi-dark styling
const { layoutAttrs, injectSkinClasses } = useSkins()

// ℹ️ This will inject classes in body tag for accurate styling
injectSkinClasses()
const menuStore = useStoreMenu()

// const { navItems } = storeToRefs(menuStore)
const { getDataMenu, role } = menuStore
const { navItems, userData } = storeToRefs(menuStore)

const items = ref<any>([])
watch(navItems, val => {
  if (val.length)
    items.value = navItems.value
})
async function getMenu() {
  if (localStorage.getItem('menuItem')) {
    items.value = JSON.parse(localStorage.getItem('menuItem') || '')
    return
  }

  items.value = await getDataMenu(userData.value.roles[0].id)
  if (items.value.length)
    localStorage.setItem('menuItem', JSON.stringify(items.value))
}
const route = useRoute()

onMounted(async () => {
  getMenu()
})
</script>

<template>
  <VerticalNavLayout
    :nav-items="items"
    v-bind="layoutAttrs"
  >
    <!-- 👉 navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center">
        <VBtn
          v-if="isLessThanOverlayNavBreakpoint(windowWidth)"
          icon
          variant="text"
          color="default"
          class="ms-n3"
          size="small"
          @click="toggleVerticalOverlayNavActive(true)"
        >
          <VIcon
            icon="tabler-menu-2"
            size="24"
          />
        </VBtn>

        <NavbarThemeSwitcher />

        <VSpacer />

        <UserProfile />
      </div>
    </template>

    <!-- 👉 Pages -->
    <RouterView v-slot="{ Component }">
      <Transition
        :name="appRouteTransition"
        mode="out-in"
      >
        <div>
          <CmBreadcrumb />
          <Component :is="Component" />
        </div>
      </Transition>
    </RouterView>

    <!-- 👉 Footer -->
    <template #footer>
      <Footer />
    </template>

    <!-- 👉 Customizer -->
    <!-- <TheCustomizer /> -->
  </VerticalNavLayout>
</template>
