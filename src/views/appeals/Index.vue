<template>
  <div class="container">
    <div>
      <header class="mt-10">
        <v-row 
          class="pa-2"
          justify="space-between"
        >
          <h1 class="page-header__title">Список заявок</h1>
          <div>
            <v-btn 
              color="primary"
              @click="showFormCreate"
            >
              Создать
            </v-btn>
            <v-dialog
              v-if="isShowFormCreate"
              v-model="isShowFormCreate"
              width="60%"
              @click:outside="closeForm(true)"
            >
              <appeals-form @update="closeForm" />
            </v-dialog>
          </div>
        </v-row>
      </header>
      <v-data-table
        :headers="headers"
        :items-per-page="searchParams.page_size"
        :items="appeals"
        :loading="isLoadingTable"
        fixed-header
        hide-default-footer
        item-value="id"
      >
        <template v-slot:top>
          <v-row>
            <v-col>
              <v-text-field
                v-model="searchParams.search"
                label="Поиск (№ заявки, название)"
                append-icon="mdi-magnify"
              />
            </v-col>
            <v-col>
              <v-autocomplete
                v-model="searchParams.premise_id"
                :items="userPremises"
                :search-input.sync="searchPremise"
                clear-icon="mdi-close-circle"
                clearable
                item-text="full_address"
                item-value="id"
                label="Дом"
              />
            </v-col>
          </v-row>
        </template>
        <template v-slot:item.number="{ item }">
          <v-chip 
            color="primary"
            @click="showFormEdit(item.id)"
          >
            {{ item.number }}
          </v-chip>
          <v-dialog
            v-if="isShowFormEdit === item.id"
            width="60%"
            :value="isShowFormEdit === item.id"
            @click:outside="closeForm(true)"
          >
            <appeals-form
              :appeal="item"
              @update="closeForm"
            />
          </v-dialog>
        </template>
        <template v-slot:item.created_at="{ item }">
          <div>
            {{ formatDate(item.created_at) }}
          </div>
        </template>
        <template v-slot:item.premise="{ item }">
          <div>
            {{ formatAddress(item) }}
          </div>
        </template>
        <template v-slot:item.due_date="{ item }">
          <div>
            {{ formatDateWithTime(item.due_date) }}
          </div>
        </template>
        <template v-slot:item.applicant="{ item }">
          <div>
            {{ shortName(item.applicant) }}
          </div>
        </template>
      </v-data-table>
      <v-row justify="space-between" class="mt-5">
        <app-page-size
          v-model="searchParams.page_size"
          :total-pages="pageInfo.pages"
          :current-page="pageInfo.currentPage"
        />
        <app-pagination
          class="pagination"
          v-model="searchParams.page"
          :length="pageInfo.pages"
          :visible="7"
          big-step
        />
      </v-row>
    </div>
  </div>
</template>

<script>
import debounce from 'debounce'
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'

import AppPagination from '@/components/AppPagination.vue'
import AppPageSize from '@/components/AppPageSize.vue'
import AppealsForm from './AppealForm.vue'

export default {
  components: {
    AppPagination,
    AppPageSize,
    AppealsForm
  },
  data() {
    return {
      searchPremise: '',
      isShowFormCreate: false,
      isShowFormEdit: -1,
      isLoadingTable: true,
      searchParams: {
        search: '',
        premise_id: '',
        page: 1,
        page_size: 15
      },
      headers: [
        { text: '№', value: 'number', width: '10%' },
        { text: 'Создана', value: 'created_at' },
        { text: 'Адрес', value: 'premise', sortable: false },
        { text: 'Заявитель', value: 'applicant', sortable: false },
        { text: 'Описание', value: 'description', sortable: false },
        { text: 'Срок', value: 'due_date', sortable: false },
        { text: 'Статус', value: 'status[name]' },
      ]
    }
  },
  computed: {
    ...mapState('appeals', ['appeals', 'pageInfo']),
    ...mapState('premises', ['userPremises']),
    ...mapGetters('appeals', ['shortName','formatAddress']),
  },
  watch: {
    'searchParams.search'() {
      this.searchParams.page = 1
    },
    'searchParams.premise_id'() {
      this.searchParams.page = 1
    },
    searchPremise: {
      immediate: true,
      handler: debounce(function() { this.getUserPremises({ search: this.searchPremise}) }, 300),
    },
    searchParams: {
      deep: true,
      immediate: true,
      handler: debounce(function() { this.getAppealsLink() }, 300),
    }
  },
  methods: {
    ...mapActions('appeals', ['getAppeals', 'getUserPremises']),
    ...mapActions('premises', ['getUserPremises']),
    getAppealsLink() {
      this.isLoadingTable = true
      this.getAppeals(this.searchParams)
        .finally(() => {
          this.isLoadingTable = false
        })
        .catch(() => alert('Произошла ошибка при обновлении списка'))
    },
    showFormEdit(id) {
      this.isShowFormEdit = id
    },
    showFormCreate() {
      this.isShowFormCreate = true
    },
    closeForm(hasClickOutside = false) {
      if (!hasClickOutside) this.getAppealsLink()
      this.isShowFormCreate = false
      this.isShowFormEdit = -1
    },
  }
}
</script>