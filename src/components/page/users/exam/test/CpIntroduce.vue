<script setup lang="ts">
import CmChip from '@/components/common/CmChip.vue'
import CmAudio from '@/components/common/CmAudio.vue'
import CmButton from '@/components/common/CmButton.vue'
import CmVideoUpload from '@/components/common/CmVideoUpload.vue'

const emit = defineEmits<Emit>()

/** ** Interface */
interface Emit {
  (e: 'startExam'): void
}

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const router = useRouter()
const route = useRoute()
const SERVERFILE = process.env.VUE_APP_BASE_SERVER_FILE

const urlFile = ref('')

function startExam() {
  emit('startExam')
}
</script>

<template>
  <div class="my-intro">
    <div class="my-title">
      <div class="flex-center">
        <CmChip
          color="success"
          class="mb-2"
        >
          <div class="text-medium-md color-success">
            00:00:35
          </div>
        </CmChip>
      </div>
      <div class="flex-center text-bold-lg">
        Chuyên đề thi chuyên đề thi chuyên đề thi chuyên đề thi chuyên đề thi
      </div>
      <div class="flex-center text-semibold-md">
        Tên kỳ thi kỳ thi kỳ thi kỳ thi kỳ thi kỳ thi kỳ thi
      </div>
    </div>
    <div class="mi">
      <div class="mi-item">
        <div class="mi-item-label text-medium-sm mb-2">
          Tổng số câu hỏi
        </div>
        <div class="mi-item-content text-semibold-xl color-primary">
          10 câu hỏi
        </div>
      </div>
      <div class="mi-item">
        <div class="mi-item-label text-medium-sm mb-2">
          Thời gian làm bài
        </div>
        <div class="mi-item-content text-semibold-xl color-primary">
          100 phút
        </div>
      </div>
      <div class="mi-item">
        <div class="mi-item-label text-medium-sm mb-2">
          Thời gian bắt đầu
        </div>
        <div class="mi-item-content text-semibold-xl color-primary">
          14:08 22-12-2022
        </div>
      </div>
      <div class="mi-item">
        <div class="mi-item-label text-medium-sm mb-2">
          Thời gian kết thúc
        </div>
        <div class="mi-item-content text-semibold-xl color-primary">
          12:00 31-12/2022
        </div>
      </div>
      <div class="mi-item">
        <div class="mi-item-label text-medium-sm mb-2">
          Số lần thi lại
        </div>
        <div class="mi-item-content text-semibold-xl color-primary">
          100 lần
        </div>
      </div>
    </div>
    <div class="desc mt-8">
      <VRow>
        <VCol
          cols="12"
          sm="6"
        >
          <div class="text-semibold-lg color-text-900">
            Quy định kỳ thi
          </div>
          <div class="mt-4 desc-text">
            Khóa học tìm hiểu về hệ thống đào tạo CLS với thời lượng 5 phút: Nội dung gồm bài học video dạng Animation thời lượng 3 phút,
            và bài khảo sát với thời lượng 2 phút. Giảng viên cho khóa học là nhân vật Animation " Leo " do CLS dựng nên đại diện cho
          </div>
        </VCol>
        <VCol
          cols="12"
          sm="6"
        >
          <div class="text-semibold-lg color-text-900">
            Kiểm tra âm thanh
          </div>
          <div class="mt-4">
            <CmAudio
              width="70%"
            />
          </div>
        </VCol>
      </VRow>
    </div>
    <div class="desc mt-8">
      <VRow>
        <VCol
          cols="12"
          md="6"
        >
          <div class="text-semibold-lg color-text-900">
            Kiểm tra video
          </div>
          <div class="mt-4 screen-16-9">
            <CmVideoUpload
              v-model="urlFile"
              :disabled="true"
              is-size-full
              :is-rounded="true"
            />
          </div>
          <div class="mt-4">
            <CmButton
              title="Cấp quyền chia sẻ màn hình"
              variant="tonal"
              color="primary"
              is-load
            />
            <CmButton
              title="Đã chia sẻ màn hình"
              variant="tonal"
              icon="prime-check-circle"
              color="success-700"
              :size-icon="20"
              is-load
            />
            <CmButton
              title="Không chia sẻ màn hình"
              variant="tonal"
              icon="tabler:circle-x"
              color="error"
              :size-icon="20"
              is-load
            />
          </div>
        </VCol>
        <VCol
          cols="12"
          md="6"
        >
          <div class="text-semibold-lg color-text-900">
            Kiểm tra camera
          </div>
          <div class="mt-4 screen-16-9">
            <CmVideoUpload
              v-model="urlFile"
              :disabled="true"
              is-size-full
              :is-rounded="true"
            />
          </div>
          <div class="mt-4">
            <CmButton
              title="Cấp quyền chia sẻ camera"
              variant="tonal"
              color="primary"
              is-load
            />
            <CmButton
              title="Đã chia sẻ camera"
              variant="tonal"
              icon="prime-check-circle"
              color="success-700"
              :size-icon="20"
              is-load
            />
            <CmButton
              title="Không chia sẻ camera"
              variant="tonal"
              icon="tabler:circle-x"
              color="error"
              :size-icon="20"
              is-load
            />
          </div>
        </VCol>
      </VRow>
    </div>
    <div class="flex-center mt-8">
      <CmButton
        title="Bắt đầu làm bài"
        color="primary"
        is-load
        @click="startExam"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.my-intro{
  .mi{
    display: flex;
    flex-wrap: wrap;
    margin-top: 1.5rem;
    .mi-item{
      width: 100%;
      padding: 1.5rem;
      background-color:  rgb(var(--v-primary-50));
      border-radius: 8px;
      margin-bottom: 1rem;
    }
    .mi-item:not(:last-child){
      margin-right: unset;
    }
  }
  .desc{
    .desc-text{
      text-align: justify;
    }
    .screen-16-9{
      width: 100%;
      max-width: 30rem;
      height: 16rem;
    }
  }
}
@media (min-width: 376px) {
  .my-intro{
    .mi{
      .mi-item{
        width: calc(( 100% - 1.5rem * 1 ) / 2 );
      }
      .mi-item:not(:last-child):nth-of-type(odd){
        margin-right: 1.5rem;
      }
    }
  }
}
@media (min-width: 576px) {
  .my-intro{
    .desc{
      .screen-16-9{
        width: 80%;
        max-width: 30rem;
        height: 16rem;
      }
    }
  }
}
@media (min-width: 767px) {
  .my-intro{
    .mi{
      .mi-item{
        width: calc(( 100% - 1.5rem * 4 ) / 5 );
      }
      .mi-item:not(:last-child){
        margin-right: 1.5rem;
      }
      .mi-item:not(:last-child):nth-of-type(even){
        margin-right: 1.5rem;
      }
    }
  }
}
</style>
