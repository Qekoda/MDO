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
        <!-- Когда заходишь на страницу создания, должен происходить запрос за всеми premise с ?search='' -->
        <!-- Когда вводишь какие то данные в поле дом, должен происходить запрос за всеми premise с ?search=q -->
        <!-- Когда выбираешь какой то дом, должен происходить запрос за квартирами с ?premise_id=id&search='' -->
        <!-- Когда вводишь в поле квартиры что то должен происходить запрос за квартирами с ?premise_id=id&search=q -->
        <!-- когда дом удаляется apartments очищаются -->
        
        <!-- При редактировании формы должна открываться с заполненными полями -->
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
                  v-model="formattedDueDate"
                  label="Срок"
                  append-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  :error-messages="errors?.due_date"
                ></v-text-field>
              </template>
              <v-date-picker
                no-title
                locale="ru-ru"
                v-model="localAppeal.due_date"
                @input="updateDueDate"
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              label="Фамилия"
              v-model="localAppeal.applicant.last_name"
            >
            </v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              label="Имя"
              v-model="localAppeal.applicant.first_name"
            >
            </v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              label="Отчество"
              v-model="localAppeal.applicant.patronymic_name"
            >
            </v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              label="Телефон"
              v-mask="'+# (###) ###-####'"
              v-model="localAppeal.applicant.username"
            >
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-textarea
              v-model="localAppeal.description"
              label="Описание"
              auto-grow
            ></v-textarea>
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
import { mapActions, mapState, mapMutations } from 'vuex'
import debounce from 'debounce'
export default {
  props: {
    appeal: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      searchPremise: '',
      searchApartment: '',
      isShowDatepicker: false,
      localAppeal: this.appeal ? this.setAppealCopy() : this.setEmptyAppeal()
    }
  },
  computed: {
    ...mapState('premises', ['userPremises']),
    ...mapState('apartments', ['apartments']),
    ...mapState('errors', ['errors']),
    formattedDueDate() {
      return this.localAppeal.due_date
        ? this.$dayjs(this.localAppeal.due_date).format('DD-MM-YYYY')
        : ''
    },
  },
  methods: {
    ...mapActions('appeals', ['createAppeal', 'updateAppeal']),
    ...mapActions('premises', ['getUserPremises']),
    ...mapActions('apartments', ['getApartments']),
    ...mapMutations('apartments', ['CLEAR_APARTMENTS']),
    ...mapMutations('errors', ['SET_ERROR']),
    updateDueDate(date) {
      this.localAppeal.due_date = new Date(date).toISOString()
      this.isShowDatepicker = false;
    },
    getUserPremisesLink(searchText = "") {
      this.getUserPremises({ search: searchText })
        .then(() => {
          if (!this.localAppeal.premise_id) {
            this.CLEAR_APARTMENTS()
            this.localAppeal.apartment_id = null
          }
        })
        .catch(() => alert('Произошла ошибка при получении списка помещений'))
    },
    getAparts(value) {
      if (!this.localAppeal.premise_id) return
      const params = { 
        premise_id: this.localAppeal.premise_id, 
        search: value
      }
      this.getApartments(params)
    },
    getApartsForAppeal(value) {
      this.localAppeal.premise_id = value
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
    setEmptyAppeal() {
      return {
        premise_id: '',
        apartment_id: '',
        applicant: {
          last_name: '',
          first_name: '',
          patronymic_name: '',
          username: ''
        },
        description: '',
        due_date: '',
        status_id: 1,
      }
    },
    setAppealCopy() {
      return {
        id: this.appeal.id,
        created_at: this.appeal.created_at,
        number: this.appeal.number,
        premise_id: this.appeal.premise?.id || '',
        apartment_id: this.appeal.apartment?.id || null,
        applicant: {
          last_name: this.appeal.applicant?.last_name || '',
          first_name: this.appeal.applicant?.first_name || '',
          patronymic_name: this.appeal.applicant?.patronymic_name || '',
          username: this.appeal.applicant?.username || '',
        },
        description: this.appeal.description || '',
        due_date: this.appeal.due_date || '',
        status: this.appeal.status?.name || ''
      }
    }
  }
}
</script>