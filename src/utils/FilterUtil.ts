import moment from 'moment'

export const formatDateYears = (value: any) => {
  if (value)
    return moment(String(value)).format('YYYY')

  return '-'
}
