<script lang="ts" setup>
import StringUtil from '@/utils/StringUtil'
import CmAvatar from '@/components/common/CmAvatar.vue'

interface Props {
  context: any
  isShowEmail?: boolean
  isShowCode?: boolean
}

const props = withDefaults(defineProps<Props>(), ({
  isShowEmail: true,
  isShowCode: true,
}))
</script>

<template>
  <div class="d-flex align-center">
    <CmAvatar
      :src="context.avatar"
      class="mr-2"
      :data="context"
    >
      {{ StringUtil.formatFullName(context.firstName, context.lastName) }}
    </CmAvatar>
    <div class="d-flex flex-column">
      <div>
        <span
          v-if="isShowCode"
          class="text-primary"
        >{{ context.userCode }}</span>
        <span>{{ StringUtil.formatFullName(context.firstName, context.lastName) }}</span>
      </div>
      <small
        v-if="isShowEmail"
        class="whitespace-no-wrap text-medium-emphasis"
      >{{ context.email }}</small>
    </div>
  </div>
</template>

