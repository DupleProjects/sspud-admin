<template>
  <v-main>
    <client-only>
      <v-overlay
          style="height: 80vh; margin-top: -60px"
          :value="loading"
          color="transparent"
          z-index="5"
          absolute
          opacity="1"
      >
        <div class="text-center">
          <v-img
              class="loading-image"
              height="150"
              width="150"
              src="/Loading.gif"
          >
          </v-img>
          <h1>Loading Assets</h1>
        </div>
      </v-overlay>
    </client-only>
    <div v-if="!loading">
      <!--Table-->
      <h2>Scraped Products</h2>
      <product-list :products="products"></product-list>

      <!--Pagination-->
      <template>
        <div class="text-end">
          <v-pagination
              color="primary"
              v-model="page"
              :length="Math.ceil(this.productCount / this.numberPerPage)"
              :total-visible="7"
          ></v-pagination>
        </div>
      </template>
    </div>
  </v-main>
</template>

<script>
import baseMixin from '@/mixins/baseMixin.js'
export default {
  mixins: [baseMixin],
  data() {
    return {
      loading: false,
      page: 1,
      numberPerPage: 20,
      productCount: 0,
      products: [],
    }
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
  },
  watch: {
    page(val) {
      this.setPage()
    },
    search(val) {
      this.filteredAssets = this.allAssets.filter((value) => {
        return (
            value.Asset_Name.toLowerCase().includes(val.toLowerCase()) ||
            value.Asset_status.toLowerCase().includes(val.toLowerCase()) ||
            value.Vehicle_description.toLowerCase().includes(val.toLowerCase()) ||
            (value.License_required &&
                this.getLicenseName(value)
                    .toLowerCase()
                    .includes(val.toLowerCase())) ||
            (value.Checklist_template_id &&
                this.getChecklistName(value)
                    .toLowerCase()
                    .includes(val.toLowerCase()))
        )
      })
      this.setPage()
    },
  },
  beforeMount() {
    this.$nextTick(async function () {
      // var loggedInUser = this.$store.state.auth.user
      // Fist we want to check how many products there are
      // const numberOfProducts = await this.$store.dispatch('callMiddlewareRoute', {
      //   tableName: 'scrapedProducts',
      //   route: 'read',
      // })
      // Load the No go zones
      const scrapedProducts = await this.$store.dispatch('dataGate', {
        tableName: 'scrapedProducts',
        operation: 'read',
        page: 1,
        numberPerPage: this.numberPerPage
      })
      console.log('scrapedProducts', scrapedProducts)
      if (scrapedProducts.count) {
        this.productCount = scrapedProducts.count;
      }
      if (scrapedProducts.data) {
        this.products = scrapedProducts.data;
      }
      this.loading = false
    })
  },
  unmounted() {
    this.$nextTick(async function () {
    })
  },
  methods: {
    // Pagination
    setPage() {
      this.displayedAssets = []
      function numPages(total, numPerPage) {
        return Math.ceil(total / numPerPage)
      }
      // Validate page
      if (this.page < 1) this.page = 1
      if (this.page > numPages(this.filteredAssets.length, this.numPerPage))
        this.page = numPages(this.filteredAssets.length, this.numPerPage)
      for (
          let i = (this.page - 1) * this.numPerPage;
          i < this.page * this.numPerPage && i < this.filteredAssets.length;
          i++
      ) {
        if (this.filteredAssets[i]) {
          this.displayedAssets.push(this.filteredAssets[i])
        }
      }
    },
  },
}
</script>

<style scoped>
@media screen and (max-width: 600px) {
  .hide-on-mobile {
    display: none !important;
  }
  .mobile-actions {
    width: 100%;
    text-align: end;
  }
}

@media screen and (min-width: 600px) {
  .hide-on-desktop {
    display: none !important;
  }
}

.header {
  flex-flow: row wrap;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
}
.flex-table {
  margin-top: -60px;
  /*padding: 0 55px;*/
  /*width: 60%;*/
  /*background-color: white;*/
}
.table-hr {
  width: 100%;
  border: 0.5px solid lightgrey;
  margin-bottom: 5px;
  margin-top: 5px;
}
.title-hr {
  width: 100%;
  border: 1px solid #ffc60b !important;
  margin-bottom: 13px;
  margin-top: 13px;
}
.title-and-image {
  flex: 1;
  display: flex;
  justify-content: flex-start;
  min-width: 250px;
}
.information {
  flex: 1;
  color: grey;
  /*margin-left: 110px;*/
  justify-content: start;
  min-width: 240px;
}
.information2 {
  flex: 1;
  color: grey;
  /*margin-left: 110px;*/
  justify-content: start;
  min-width: 200px;
}
.actions {
  /*justify-content: flex-end;*/
}
.top-bar-title {
  /*flex: 1*/
}
.property-value {
  font-size: 12px;
  color: grey;
}
.top-bar {
  align-items: flex-end;
  display: flex;
  justify-content: space-between;
}
</style>
