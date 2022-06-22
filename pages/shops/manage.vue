<template>
  <div>
    <!--Header-->
    <div
        class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <h1 class="h2">Manage Shops</h1>
      <v-text-field
          v-model="search"
          label="Search"
          class="px-5"
      ></v-text-field>
      <div class="btn-toolbar mb-2 mb-md-0">
      </div>
    </div>
    <!--Table-->
    <shops-list
        :shops="displayedShops" :saveCallBack="saveCallBack" :sortCallback="sortCallback"/>
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
import shopsList from '../../components/shops/shopsList.vue';
import breadcrumbMixin from "@/mixins/breadcrumbMixin.js";

export default {
  components: { shopsList },
  mixins: [baseMixin,breadcrumbMixin],
  data() {
    return {
      loading: false,
      page: 1,
      search: '',
      numberPerPage: 20,
      userCount: 0,
      shops: [],
      filteredShops: [],
      displayedShops: [],
      subCategories: [],
    }
  },
  watch: {
    page(val) {
      this.setPage();
    },

    search(val) {
      this.filteredShops = this.shops.filter((category) => {
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
      const shopsResponse = await this.$store.dispatch('dataGate', {
        tableName: 'shops',
        operation: 'read'
      });

      if (shopsResponse.count) {
        this.userCount = shopsResponse.count;
      }

      if (shopsResponse.data) {
        this.shops = shopsResponse.data;
        this.filteredShops = this.shops;
        const pageInfo = breadcrumbMixin.methods.getPage('shopsPage')
        this.page = pageInfo.page
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
    async loadShops() {
      const shopsResponse = await this.$store.dispatch('dataGate', {
        tableName: 'shops',
        operation: 'read',
      });
      this.filteredShops = shopsResponse.data;
      this.setPage();
    },
    async saveCallBack() {
      await this.loadShops()
    },
    // Pagination
    setPage() {
      this.displayedShops = []

      function numPages(total, numPerPage) {
        return Math.ceil(total / numPerPage)
      }

      // Validate page
      if (this.page < 1) this.page = 1
      breadcrumbMixin.methods.savePage('shopsPage', this.page)
      if (this.page > numPages(this.filteredShops.length, this.numberPerPage))
        this.page = numPages(this.filteredShops.length, this.numberPerPage)
      for (
          let i = (this.page - 1) * this.numberPerPage;
          i < this.page * this.numberPerPage && i < this.filteredShops.length;
          i++
      ) {
        if (this.filteredShops[i]) {
          this.displayedShops.push(this.filteredShops[i])
        }
      }
    },
    async sortCallback(crit) {
      console.log("CRITERIA",crit);
      const usersResponse = await this.$store.dispatch('dataGate', {
        tableName: 'shops',
        operation: 'read',
        sortCriteria: crit
      });
      // this.shopsList = usersResponse.data
      this.filteredShops = usersResponse.data;
      this.setPage();
    },
  },
}
</script>

<style scoped>

</style>
