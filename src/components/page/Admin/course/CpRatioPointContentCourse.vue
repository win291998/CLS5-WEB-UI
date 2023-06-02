<script setup lang="ts">
import { courseApproveManagerStore } from '@/stores/admin/course/approve'
import { validatorStore } from '@/stores/validatator'

const CmTable = defineAsyncComponent(() => import('@/components/common/CmTable.vue'))
const CmTextField = defineAsyncComponent(() => import('@/components/common/CmTextField.vue'))

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
/** store */
const storeCourseApproveManager = courseApproveManagerStore()
const { rowsScore, myFormScore } = storeToRefs(storeCourseApproveManager)
const { valueChange } = storeCourseApproveManager
const storeValidate = validatorStore()
const { schemaOption, Field, Form, FieldArray, useForm, yup } = storeValidate
const { submitForm } = useForm()
const schema = yup.object({
  content: yup.array().of(
    yup.object().shape({
      point: schemaOption.defaultNumberRatio,
    }),
  ),
})

/** data */
const headersScore = reactive([
  { text: '', value: 'checkbox', width: 50 },
  { text: t('name-content'), value: 'name' },
  { text: t('factor'), value: 'point', type: 'custom' },
  { text: '', value: 'actions', width: 150 },
])
</script>

<template>
  <div>
    <Form
      ref="myFormScore"
      :validation-schema="schema"
      @submit.prevent="submitForm"
    >
      <FieldArray
        name="content"
      >
        <CmTable
          :headers="headersScore"
          :items="rowsScore"
          disiable-pagination
          return-object
          custom-id="courseContentId"
        >
          <template #rowItem="{ col, context }">
            <div v-if="col === 'point'">
              <Field
                v-slot="{ field, errors }"
                v-model="context.point"
                :value="1"
                :name="`content[${context.originIndex}].point`"
              >
                <CmTextField
                  :field="field"
                  :errors="errors"
                  type="number"
                  @update:model-value="valueChange(Number($event), context)"
                />
              </Field>
            </div>
          </template>
        </CmTable>
      </FieldArray>
    </Form>
  </div>
</template>
