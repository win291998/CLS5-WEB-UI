<script lang="ts" setup>
import StringUtil from '@/utils/StringUtil'
import CmAvatar from '@/components/common/CmAvatar.vue'

interface Props {
  context: any
  isShowEmail?: boolean
  isShowCode?: boolean
  isShowAvatar?: boolean
  labelFirst: string
  labelLast: string
  isFullName: boolean
  labelCode: string
}

const props = withDefaults(defineProps<Props>(), ({
  isShowEmail: true,
  isShowCode: true,
  isShowAvatar: true,
  labelFirst: 'firstName',
  labelLast: 'lastName',
  isFullName: true,
  labelCode: 'userCode',
}))

const linkAvatar = computed(() => {
  if ((props.context && props.context.avatar))
    return props.context.avatar
  if ((props.context && props.context.avatar))
    return props.context.thumbnail

  return ''
})
</script>

<template>
  <div class="d-flex align-center">
    <CmAvatar
      v-if="isShowAvatar"
      :src="linkAvatar"
      class="mr-2"
      :data="context"
    >
      {{ StringUtil.formatFullName(context[labelFirst], context[labelLast]) }}
    </CmAvatar>
    <div class="d-flex flex-column">
      <div>
        <span
          v-if="isShowCode"
          class="text-primary"
        >{{ context[labelCode] }}</span>
        <span v-if="isFullName">{{ StringUtil.formatFullName(context[labelFirst], context[labelLast]) }}</span>
        <span v-else>{{ context.name }}</span>
      </div>
      <small
        v-if="isShowEmail"
        class="whitespace-no-wrap text-medium-emphasis"
      >{{ context.email }}</small>
    </div>
  </div>
</template>

