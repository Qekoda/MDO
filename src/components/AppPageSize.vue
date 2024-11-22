<template>
  <div class="page-size__content">
    <p><strong>{{ start }}–{{ end }}</strong> из <strong>{{ totalItems }}</strong> записей</p>
    <v-select
      class="page-size__select"
      :value="value"
      :items="items"
      @input="onInput"
    />
  </div>
</template>

<script>

export default {
  props: {
    totalPages: {
      type: Number,
      required: true
    },
    items: {
      type: Array,
      default: () => [10, 15, 25, 50]
    },
    value: {
      type: Number,
      required: true
    },
    currentPage: {
      type: Number,
      required: true
    }
  },
  computed: {
    start() {
      return (this.currentPage -1) * this.value + 1
    },
    end() {
      const calculatedEnd = this.currentPage * this.value
      return calculatedEnd > this.totalItems ? this.totalItems : calculatedEnd
    },
    totalItems() {
      return this.value * this.totalPages
    }
  },
  methods: {
    onInput(value) {
      this.$emit('input', value)
    }
  }
}
</script>