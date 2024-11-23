<template>
  <v-card>
    <form @submit.prevent="onSubmitForm">
      <v-card-title>
        <div class="d-flex justify-space-between flex-fill">
          <p>{{ appeal? `Заявка № ${localAppeal.number} (от ${formatDate(localAppeal.created_at)})` : 'Создание заявки'}}</p>
          <p>{{ appeal? localAppeal.status.name : localAppeal.status}}</p>
        </div>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col>
            <v-autocomplete
              v-model="localAppeal.premise_id"
              label="Дом"
              :items="userPremises"
              item-text="full_address"
              item-value="id"
              @change="getApartsForAppeal"
              @update:search-input="getUserPremisesLink"
            />
          </v-col>
          <v-col>
            <v-autocomplete
              v-model="localAppeal.apartment_id"
              label="Квартира"
              :items="apartments"
              item-text="label"
              item-value="id"
              @update:search-input="getAparts"
            />
          </v-col>
          <v-col>
            <v-menu
              v-model="isShowDatepicker"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  :error-messages="errors?.due_date"
                  :value="formatDate(localAppeal.due_date)"
                  append-icon="mdi-calendar"
                  label="Срок"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                />
              </template>
              <v-date-picker
                v-model="localAppeal.due_date"
                no-title
                locale="ru-ru"
                @input="updateDueDate"
              />
            </v-menu>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              label="Фамилия"
              v-model="localAppeal.applicant.last_name"
            />
          </v-col>
          <v-col>
            <v-text-field
              label="Имя"
              v-model="localAppeal.applicant.first_name"
            />
          </v-col>
          <v-col>
            <v-text-field
              label="Отчество"
              v-model="localAppeal.applicant.patronymic_name"
            />
          </v-col>
          <v-col>
            <v-text-field
              label="Телефон"
              v-model="localAppeal.applicant.username"
              v-mask="'+# (###) ###-####'"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-textarea
              v-model="localAppeal.description"
              label="Описание"
              auto-grow
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="d-flex justify-end pa-5">
        <v-btn 
          type="submit"
          color="primary"
        >
          {{ appeal ? 'Обновить' : 'Создать' }}
        </v-btn>
      </v-card-actions>
    </form>
  </v-card>
</template>

<script>
import debounce from 'debounce'
import { mapActions, mapState, mapMutations } from 'vuex'

export default {
  props: {
    appeal: {
      type: Object,
      default: null
    }
  },
  emits: ['update'],
  data() {
    return {
      searchPremise: '',
      searchApartment: '',
      isShowDatepicker: false,
      localAppeal: this.setAppeal(this.appeal)
    }
  },
  computed: {
    ...mapState('premises', ['userPremises']),
    ...mapState('apartments', ['apartments']),
    ...mapState('errors', ['errors']),
  },
  methods: {
    ...mapActions('appeals', ['createAppeal', 'updateAppeal']),
    ...mapActions('premises', ['getUserPremises']),
    ...mapActions('apartments', ['getApartments']),
    ...mapMutations('apartments', ['CLEAR_APARTMENTS']),
    ...mapMutations('errors', ['SET_ERROR']),
    getUserPremisesLink: debounce(function(searchText = "") {
      this.getUserPremises({ search: searchText })
        .then(() => {
          if (!this.localAppeal.premise_id) {
            this.CLEAR_APARTMENTS()
            this.localAppeal.apartment_id = null
          }
        })
        .catch(() => alert('Произошла ошибка при получении списка помещений'))
    }, 300),
    getAparts: debounce(function(value) {
      if (!this.localAppeal.premise_id) return
      const params = { 
        premise_id: this.localAppeal.premise_id, 
        search: value
      }
      this.getApartments(params)
    }, 300),
    updateDueDate(date) {
      this.localAppeal.due_date = new Date(date).toISOString()
      this.isShowDatepicker = false;
    },
    getApartsForAppeal() {
      if (this.localAppeal.premise_id) {
        this.getApartments({ premise_id: this.localAppeal.premise_id })
      }
    },
    onSubmitForm() {
      this.appeal ? this.updateAppealLink() : this.createAppealLink()
    },
    updateAppealLink() {
      this.updateAppeal(this.localAppeal)
        .then(() => this.$emit('update'))
        .catch(() => alert('Произошла ошибка при обновлении заявки'))
    },
    createAppealLink() {
      this.createAppeal(this.localAppeal)
        .then(() => this.$emit('update'))
        .catch(() => alert('Произошла ошибка при создании заявки'))
    },
    setAppeal(appeal) {
      return {
        id: appeal?.id || null,
        created_at: appeal?.created_at || '',
        number: appeal?.number || '',
        premise_id: appeal?.premise?.id || null,
        apartment_id: appeal?.apartment?.id || null,
        applicant: {
          last_name: appeal?.applicant?.last_name || '',
          first_name: appeal?.applicant?.first_name || '',
          patronymic_name: appeal?.applicant?.patronymic_name || '',
          username: appeal?.applicant?.username || '',
        },
        description: appeal?.description || '',
        due_date: appeal?.due_date || '',
        status: appeal?.status?.name || 1
      }
    }
  }
}
</script>