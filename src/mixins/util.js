import dayjs from 'dayjs'

export default {
  methods: {
    formatDate(date) {
      if (!date) return ''
      return dayjs(date).format('DD.MM.YYYY')
    },
    formatDateWithTime(date) {
      if (!date) return 'Не указан'
      return dayjs(date).format('DD.MM.YYYY HH:mm')
    }
  }
}