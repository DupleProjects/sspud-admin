<template>
  <div>
    <!--Header-->
    <div
        class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <h1 class="h2">Manage Users</h1>
      <v-text-field
          v-model="search"
          label="Search"
          class="mb-4"
      ></v-text-field>
      <div class="btn-toolbar mb-2 mb-md-0">
        <div class="btn-group me-2">
          <create-user-dialog
              :categories="users" :saveCallBack="saveCallBack"/>
        </div>
      </div>
    </div>
    <!--Table-->
    <users-list
        :users="users"/>
    <!--Pagination-->
    <template>
      <div class="text-end">
        <v-pagination
            color="primary"
            v-model="page"
            :length="Math.ceil(this.userCount / this.numberPerPage)"
            :total-visible="7"
        ></v-pagination>
      </div>
    </template>
  </div>
</template>

<script>
import baseMixin from '@/mixins/baseMixin.js'
import usersList from '../../components/users/usersList.vue';
import CreateUserDialog from '../../components/users/createUserDialog.vue';

export default {
  components: { usersList, CreateUserDialog },
  mixins: [baseMixin],
  data() {
    return {
      loading: false,
      page: 1,
      search: '',
      numberPerPage: 20,
      userCount: 0,
      users: [],
      filteredusers: [],
      displayedCategories: [],
      subCategories: [],
    }
  },
  watch: {
    page(val) {
      this.setPage();
    },

    search(val) {
      this.filteredusers = this.users.filter((category) => {
        return (
            category.name.toLowerCase().includes(val.toLowerCase())
        )
      })
      this.setPage()
    },
  },
  beforeMount() {
    this.$nextTick(async function () {
      // var loggedInUser = this.$store.state.auth.user
      // Load the products
      const usersResponse = await this.$store.dispatch('dataGate', {
        tableName: 'users',
        operation: 'read'
      });

      if (usersResponse.count) {
        this.userCount = usersResponse.count;
      }

      if (usersResponse.data) {
        console.log('usersResponse.data', usersResponse.data)
        this.users = usersResponse.data;
        console.log('this.users', this.users)
        this.filteredusers = this.users;
        this.setPage();
      }
      this.loading = false
    })
  },
  unmounted() {
    this.$nextTick(async function () {

    })
  },
  methods: {
    async loadUsers() {
      const usersResponse = await this.$store.dispatch('dataGate', {
        tableName: 'users',
        operation: 'read',
      });
      this.filteredusers = usersResponse.data;
      this.setPage();
    },
    async saveCallBack(user) {
      await this.loadUsers()
    },
    goToCategoryDashboard(category) {
      this.$router.push(
          {
            name: 'users-dashboard-id',
            params: {id: category.id}
          }
      )
    },
    // Pagination
    setPage() {
      this.displayedCategories = []

      function numPages(total, numPerPage) {
        return Math.ceil(total / numPerPage)
      }

      // Validate page
      if (this.page < 1) this.page = 1
      if (this.page > numPages(this.filteredusers.length, this.numberPerPage))
        this.page = numPages(this.filteredusers.length, this.numberPerPage)
      for (
          let i = (this.page - 1) * this.numberPerPage;
          i < this.page * this.numberPerPage && i < this.filteredusers.length;
          i++
      ) {
        if (this.filteredusers[i]) {
          this.displayedCategories.push(this.filteredusers[i])
        }
      }
    },
  },
}
</script>

<style scoped>

</style>
