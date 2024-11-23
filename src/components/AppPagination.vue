<template>
  <div class="d-flex align-center">
    <div class="v-pagination__navigation">
      <button 
        class="v-icon custom-navigation notranslate mdi mdi-chevron-double-left theme--light"
        type="button"
        :class="{ 'v-pagination__navigation--disabled': value == 1 }"
        :disabled="value == 1"
        @click="bigStepBack"
      >
      </button>
    </div>
    <v-pagination
      :length="length"
      :total-visible="visible"
      :value="value"
      circle
      next-icon="mdi-chevron-right"
      prev-icon="mdi-chevron-left"
      @input="onInput"
    />
    <div class="v-pagination__navigation">
      <button 
        class="v-icon custom-navigation notranslate mdi mdi-chevron-double-right theme--light"
        type="button"
        :class="{ 'v-pagination__navigation--disabled': value == length }"
        :disabled="value == length"
        @click="bigStepForward"
      >
      </button>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    visible: {
      type: Number,
      default: 7
    },
    value: {
      type: Number,
      required: true
    },
    length: {
      type: Number,
      required: true
    },
    bigStep: {
      type: Boolean,
      default: false
    }
  },
  emits: ['input'],
  methods: {
    onInput(value) {
      this.$emit('input', value)
    },
    bigStepBack(){
      if (this.value >= 6) {
        this.$emit('input', this.value - 5)
      } else {
        this.$emit('input', 1)
      }
    },
    bigStepForward() {
      if ( this.value >= this.length - 5) {
        this.$emit('input', this.length)
      } else {
        this.$emit('input', this.value + 5)
      }
    }
  }

}
</script>