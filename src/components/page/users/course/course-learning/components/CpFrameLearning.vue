<script setup lang="ts">
import CmButton from '@/components/common/CmButton.vue'
import CmSheet from '@/components/common/CmSheet.vue'

const emit = defineEmits<Emit>()
const sheet = ref(false)

interface Emit {
  (e: 'goHome'): void
  (e: 'goBack'): void
}
</script>

<template>
  <div class="course-learning">
    <div class="content">
      <div class="content-course">
        <div class="header-action">
          <div class="action-content">
            <CmButton
              class="d-flex mr-2 button-learning"
              size="36"
              @click="emit('goHome')"
            >
              <VIcon
                icon="ic:outline-home"
                size="20"
              />
            </CmButton>
            <CmButton
              variant="outlined"
              color="secondary"
              class="d-flex mr-2 button-learning"
              size="36"
              icon="material-symbols:arrow-back-rounded"
              :size-icon="20"
              @click="emit('goBack')"
            />
          </div>
          <div class="header-content">
            <div
              class="text-bold-lg text-truncate"
              title="Tên khóa học khóa học khóa học khóa học khóa học khóa học khóa học Tên khóa học khóa học khóa học khóa học khóa học khóa học khóa họcTên khóa học khóa học khóa học khóa học khóa học khóa học khóa họcTên khóa học khóa học khóa học khóa học khóa học khóa học khóa học"
            >
              Tên khóa học khóa học khóa học khóa học khóa học khóa học khóa học Tên khóa học khóa học khóa học khóa học khóa học khóa học khóa họcTên khóa học khóa học khóa học khóa học khóa học khóa học khóa họcTên khóa học khóa học khóa học khóa học khóa học khóa học khóa học
            </div>
            <div
              class="d-flex align-start"
              style="width: 50%"
            >
              <VProgressLinear
                rounded-bar
                :model-value="80"
                color="success"
                class="mt-6"
                rounded
                height="8"
              />
            </div>
          </div>
        </div>
        <div class="content-learning">
          <slot
            name="content"
          />
        </div>
      </div>
      <div class="sidebar">
        <slot name="sidebar" />
      </div>
    </div>
    <CmSheet
      v-model="sheet"
      inset
      size="30vh"
      origin="bottom"
      class="sidebar-mobile"
    >
      <div>
        <slot name="sidebar" />
      </div>
    </CmSheet>
  </div>
</template>

<style lang="scss">
@use "@/styles/style-global" as *;

.course-learning {
  width: calc(100% - 64px);
  max-width: var(--v-max-width-page);
  height: calc(100vh - 64px) ;
  padding: 32px;
  border-radius: 8px;
  margin: 32px;
  background: rba(--v-them-surface);
  box-shadow: 0 2px 4px -2px rgba(16, 24, 40, 6%), 0 4px 8px -2px rgba(16, 24, 40, 10%);

  .button-learning {
    height: 36px !important;
    min-height: unset !important;
  }

  .content {
    display: flex;
    width: 100%;
    height: 100%;

    .content-course {
      display: flex;
      width: 75%;
      height: 100%;
      flex-direction: column;
      padding-right: 32px;

      .header-action {
        display: flex;
        width: 100%;
        margin-bottom: 32px;

        .action-content {
          display: flex;
          margin-right: 24px;
        }

        .header-content {
          width: calc(100% - 112px);

          .v-progress-linear {
            margin-top: 8px !important;
          }
        }
      }

      .content-learning {
        display: flex;
        height: 100%;
        max-height: calc(100% - 64px);
        align-items: center;
        justify-content: center;
        border: 1px solid $color-gray-300;
        border-radius: var(--v-border-radius-xs);
        background-color: $color-gray-200;
        padding: 1rem;
      }
    }

    .sidebar {
      width: 25%;
      height: 100%;
    }
  }

  .sidebar-mobile {
    display: none;
  }

  @media only screen and (width <= 1000px) {
    .header-action {
      margin-bottom: 32px;
      background-color: greenyellow;
    }

    .content {
      .content-course {
        width: 100%;
        padding-right: unset;
      }

      .sidebar {
        display: none;
      }

      .sidebar-mobile {
        display: block;
      }
    }
  }
}
</style>
