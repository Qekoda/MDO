<template>
  <div class="bg-image">
    <form class="form form--center" @submit.prevent="onSubmit">
      <div class="form__inner">
        <div class="form__title form__title--secondary">
          Авторизация
        </div>
        <v-text-field
          v-model="username"
          prepend-inner-icon="mdi-phone"
          label="Логин или телефон"
          return-masked-value
          v-mask="'+# (###) ###-####'"
        />
        <v-text-field 
          v-model="password"
          :append-icon="isShowPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="isShowPassword ? 'text' : 'password'"
          label="Пароль"
          prepend-inner-icon="mdi-lock"
          :error-messages="errors?.password"
          @click:append="changeVisiblePassword"
        />
        <v-row 
          justify="center"
          class="mt-3 mb-1"
        >
          <v-btn 
            color="primary"
            type="submit"
          >
            Войти
          </v-btn>
        </v-row>
      </div>
    </form>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  data: () => {
    return {
      username: '79122333444',
      password: '123456',
      isShowPassword: false
    }
  },
  computed: {
    ...mapState('errors', ['errors']),
    hasPasswordErrors() {
      return this.errors?.password?.length; // Безопасная проверка
    }
  },
  methods: {
    ...mapActions('config', ['authorize']),
    ...mapMutations('errors', ['SET_ERROR']),
    onSubmit() {
      let params = {
        username: this.username.replace(/\D/g, ''),
        password: this.password
      }
      this.authorize(params)
        .then(() => {
          this.$router.push('/')
        })
        .catch(err => alert('Произошла ошибка при авторизации'))
    },
    authorize(params) {
      return new Promise((resolve, reject) => {
        this.$http.post('/api/auth/login/', params)
          .then((response) => {
            if (response.status == 200) {
              const key = response.data.key
              window.localStorage.setItem('authenticityToken', key)
              resolve(response)
            }
          })
          .catch((error) => {
            this.SET_ERROR(error.response.data.data)
            reject(error)
          })
      })
    },
    changeVisiblePassword() {
      this.isShowPassword = !this.isShowPassword
    }
  }
}
</script>