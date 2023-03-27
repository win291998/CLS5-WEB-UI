<script>
import moment from 'moment'

// import { formatDateToDDMM } from '@core/utils/filter'

// import DateTimePicker from '@/components/dateTimePicker/DateTimePicker.vue'

export default {
  components: {
    // DateTimePicker,
  },
  data() {
    return {
      isShowDatePicker: false,
      date: '',
      section: '',

      // section: this.$t('dashboards.ever'),
      active: null,
    }
  },
  methods: {
    // DateTimeChange(selectedDay) {
    //   let startDate = ''
    //   let endDate = ''

    //   if (selectedDay[0])
    //     startDate = moment(selectedDay[0]).startOf('hour').add(moment.duration(7, 'hours')).toISOString()

    //   if (selectedDay[1])
    //     endDate = moment(selectedDay[1]).endOf('day').add(moment.duration(7, 'hours')).toISOString()

    //   if (selectedDay[1]) {
    //     const section = `${this.$t('dashboards.from')} ${formatDateToDDMM(selectedDay[0])} ${this.$t('dashboards.to')} ${formatDateToDDMM(selectedDay[1])}`

    //     this.$emit('change', startDate, endDate, section)
    //   }
    // },
    changeDate(type) {
      this.isShowDatePicker = false
      if (this.active === type) {
        this.active = null
        this.$emit('change', null, null, this.$t('dashboards.ever'))

        return
      }
      this.active = type
      switch (type) {
        case 'W':
          this.section = this.$t('dashboards.in-week')
          this.date = moment().subtract(7, 'days').add(moment.duration(7, 'hours')).toISOString()
          break
        case 'M':
          this.section = this.$t('dashboards.in-month')
          this.date = moment().subtract(1, 'months').add(moment.duration(7, 'hours')).toISOString()
          break
        case 'S':
          this.section = this.$t('dashboards.in-season')
          this.date = moment().subtract(3, 'months').add(moment.duration(7, 'hours')).toISOString()
          break
        case 'Y':
          this.section = this.$t('dashboards.in-year')
          this.date = moment().subtract(1, 'years').add(moment.duration(7, 'hours')).toISOString()
          break
        default:
          this.section = this.$t('dashboards.in-year')
          this.date = moment().subtract(1, 'years').add(moment.duration(7, 'hours')).toISOString()
      }

      // this.$emit('change', this.date, null, this.section)
    },

    swapToPickTime() {
      this.active = 'P'
      this.isShowDatePicker = true
    },
  },
}
</script>

<template>
  <div class="pick-date-type">
    <div class="d-flex justify-content-center flex-shrink-0">
      <div class="pick-date-type-wrapper">
        <div class="first-section">
          <span
            class="item"
            :class="{ 'active-pick-date': active === 'W' }"
            @click="changeDate('W')"
          >
            {{ $t('Tuần') }}
          </span>
          <span
            class="item"
            :class="{ 'active-pick-date': active === 'M' }"
            @click="changeDate('M')"
          >
            {{ $t('Tháng') }}
          </span>
          <span
            class="item"
            :class="{ 'active-pick-date': active === 'S' }"
            @click="changeDate('S')"
          >
            {{ $t('Quý') }}
          </span>
        </div>
        <div class="second-section">
          <span
            class="item"
            :class="{ 'active-pick-date': active === 'Y' }"
            @click="changeDate('Y')"
          >
            {{ $t('Năm') }}
          </span>
          <span
            class="item"
            :class="{ 'active-pick-date': active === 'P' }"
            @click="swapToPickTime"
          >
            {{ $t('Giai đoạn') }}
          </span>
        </div>
      </div>
    </div>
    <!--
      <div class="d-flex align-items-center justify-content-center date-time-container">
      <date-time-picker
      v-if="isShowDatePicker"
      formControl=""
      :enableTime="false"
      class="bg-transparent border-0 shadow-none p-0 text-primary ml-1 pick-date-input"
      mode="range"
      placeholder="YYYY-MM-DD"
      @onClose="DateTimeChange"
      />
      </div>
    -->
  </div>
</template>

<style lang="scss">
@use "/src/styles/style-global" as *;

.pick-date-type {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: flex-end;
  user-select: none;

  .date-time-container {
    .pick-date-input {
      inline-size: 200px;
      outline: none;

      &::placeholder {
        color: $color-gray-300;
        text-align: center;
      }
    }
  }

  .pick-date-type-wrapper {
    display: flex;
    color: $color-gray-300;
    font-family: Montserrat;
    font-size: 14px;
    font-weight: 500;
    margin-inline-end: 2px;

    .first-section {
      .item {
        &:first-of-type {
          border: 1px solid  $color-gray-300;
          border-end-start-radius: 6px;
          border-start-start-radius: 6px;
        }

        &:not(:first-of-type) {
          border-block-end: 1px solid  $color-gray-300;
          border-block-start: 1px solid  $color-gray-300;
          border-inline-end: 1px solid  $color-gray-300;
        }
      }
    }

    .second-section {
      .item {
        border-block-end: 1px solid  $color-gray-300;
        border-block-start: 1px solid  $color-gray-300;
        border-inline-end: 1px solid  $color-gray-300;

        &:last-of-type {
          border-end-end-radius: 6px;
          border-start-end-radius: 6px;
        }
      }
    }

    .item {
      display: inline-block;
      cursor: pointer;
      padding-block: 8px;
      padding-inline: 20px;
      transition: 0.1s;
    }
  }

  .active-pick-date {
    background-color: $color-gray-50;
    color: $color-gray-700;
  }
}

@media all and (max-width: 692px) {
  .pick-date-type {
    display: block;

    .date-time-container {
      .pick-date-input {
        margin-block-start: 12px;
      }
    }
  }
}

@media all and (max-width: 460px) {
  .pick-date-type {
    .pick-date-type-wrapper {
      display: block;

      .first-section {
        margin-block-end: 10px;

        .item {
          &:last-of-type {
            border-end-end-radius: 6px;
            border-start-end-radius: 6px;
          }
        }
      }

      .second-section {
        display: flex;
        justify-content: center;

        .item {
          &:first-of-type {
            border-end-start-radius: 6px;
            border-inline-start: 1px solid  $color-gray-300;
            border-start-start-radius: 6px;
          }
        }
      }
    }
  }
}
</style>
