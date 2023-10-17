<script setup lang="ts">
import CmButton from '@/components/common/CmButton.vue'

const sheet = ref(false)
const layoutMobile = ref(false)
function handleResize() {
  // Kiểm tra kích thước màn hình và cập nhật giá trị visibleItems
  if (window.innerWidth >= 769)
    layoutMobile.value = false // Giá trị cho màn hình md trở lên
  else
    layoutMobile.value = true // Giá trị cho màn hình mobile
}
window.addEventListener('resize', handleResize)
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
function openNav() {
  document.getElementById('mySidebar').style.height = '250px'
  document.getElementById('main').style.marginLeft = '250px'
}

function closeNav() {
  document.getElementById('mySidebar').style.width = '0'
  document.getElementById('main').style.marginLeft = '0'
}
</script>

<template>
  <div>
    <div
      id="mySidebar"
      class="sbr"
    >
      <CmButton
        v-if="layoutMobile"
        icon="tabler:arrow-badge-up"
        is-rounded
        :size="30"
        :size-icon="30"
        variant="tonal"
        color="primary"
        class="controlQuestionNumberMb"
        @click="openNav"
      />
    </div>

    <div

      class="sidebar"
    >
      <a
        href="javascript:void(0)"
        class="closebtn"
        @click="closeNav"
      >×</a>
      <a href="#">About</a>
      <a href="#">Services</a>
      <a href="#">Clients</a>
      <a href="#">Contact</a>
    </div>

    <div id="sidebar-content">
      <h2>Collapsed Sidebar</h2>
      <p>Click on the hamburger menu/bar icon to open the sidebar, and push this content to the right.</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sbr{
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 20px;
  background-color: rgb(var(--v-theme-surface));
  overflow: hidden;
  transition: 0.5s;
  box-shadow: 0px 2px 4px 2px rgba(16, 24, 40, 0.06), 0px 4px 8px -2px rgba(16, 24, 40, 0.10);
  display: flex;
  justify-content: center;
}
.sidebar {
  height: 100%;
  width: 0;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  background-color: #111;
  overflow-x: hidden;
  transition: 0.5s;
  padding-top: 60px;
}

.sidebar a {
  padding: 8px 8px 8px 32px;
  text-decoration: none;
  font-size: 25px;
  color: #818181;
  display: block;
  transition: 0.3s;
}

.sidebar a:hover {
  color: #f1f1f1;
}

.sidebar .closebtn {
  position: absolute;
  top: 0;
  right: 25px;
  font-size: 36px;
  margin-left: 50px;
}

.openbtn {
  font-size: 20px;
  cursor: pointer;
  background-color: #111;
  color: white;
  padding: 10px 15px;
  border: none;
}

.openbtn:hover {
  background-color: #444;
}
</style>
