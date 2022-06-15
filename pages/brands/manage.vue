<template>
  <div class="pa-3">
    <!--Header-->
    <div
      class="
        d-flex
        justify-content-between
        flex-wrap flex-md-nowrap
        align-items-center
        pt-3
        pb-2
        mb-3
        border-bottom
      ">
      <h1 class="h2">Manage Brands</h1>
      <v-text-field
          v-model="search"
          label="Search"
          class="px-5"
      ></v-text-field>
      <div class="btn-toolbar mb-2 mb-md-0">
        <div class="btn-group me-2">
          <brands-create-brand-dialog
              :brandCreateCallBack="brandCreateCallBack"
              :brands="brands"
          />
          <export-modal :exportTableName="'mappedBrands'" :exportSheetName="'BambaZonke Categories'" :products="brands" />
        </div>
      </div>
    </div>
    <!--Table-->
    <div class="fancy-table">
      <table>
        <thead>
          <tr class="fancy-heading-row">
            <th>Name</th>
            <th>Published</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(brand, index) of displayedBrands" :key="index" class="fancy-row">
            <td>{{ brand.name }}</td>
            <td>
              <v-tooltip v-if="brand.publish" top>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon v-bind="attrs" v-on="on" color="green" medium
                    >mdi-check-circle</v-icon
                  >
                </template>
                <span>Published</span>
              </v-tooltip>
              <v-tooltip v-if="!brand.publish" top>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon v-bind="attrs" v-on="on" color="orange" medium
                    >mdi-close-circle</v-icon
                  >
                </template>
                <span>Published</span>
              </v-tooltip>
            </td>
            <td class="d-flex">
              <brands-edit-brand-dialog
                :brandCreateCallBackEdit="brandCreateCallBackEdit"
                :brand="brand"
              />
              <v-icon
                color="red"
                class="icon-style hide-on-desktop"
                dark
                @click="deleteBrand(brand)"
              >
                mdi-delete
              </v-icon>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!--Pagination-->
    <template>
      <div class="text-end">
        <v-pagination
          color="primary"
          v-model="page"
          :length="Math.ceil(this.brandCount / this.numberPerPage)"
          :total-visible="7"
        ></v-pagination>
      </div>
    </template>
  </div>
</template>

<script>
import baseMixin from "@/mixins/baseMixin.js";
import exportModal from '../../components/dialogs/exportModal.vue';
import breadcrumbMixin from "@/mixins/breadcrumbMixin.js";
export default {
  components: { exportModal },
  mixins: [baseMixin,breadcrumbMixin],
  data() {
    return {
      loading: false,
      search: '',
      page: 1,
      numberPerPage: 20,
      brandCount: 0,
      brands: [],
      filteredBrands: [],
      displayedBrands: [],
    };
  },
  watch: {
    page(val) {
      this.setPage();
    },
    search(val) {
      this.filteredBrands = this.brands.filter((brand) => {
        return (
            brand.name.toLowerCase().includes(val.toLowerCase())
        )
      })
      this.setPage()
    },
  },
  beforeMount() {
    this.$nextTick(async function () {
      // var loggedInUser = this.$store.state.auth.user
      // Load the products
      const brandsResponse = await this.$store.dispatch("dataGate", {
        tableName: "mappedBrands",
        operation: "read",
      });
      if (brandsResponse.count) {
        this.brandCount = brandsResponse.count;
      }
      if (brandsResponse.data) {
        this.brands = brandsResponse.data;
        this.filteredBrands = this.brands;
        const pageInfo = breadcrumbMixin.methods.getPage('mappedBrandsList')
      this.page = pageInfo.page
        this.setPage();
      }
      this.loading = false;
    });
  },
  unmounted() {
    this.$nextTick(async function () {});
  },
  methods: {
    brandCreateCallBack(newBrand) {
      console.log(newBrand);
      this.brands.push(newBrand);
    },
    async brandCreateCallBackEdit(newBrand) {
      this.loading = true;
      const brandsResponse = await this.$store.dispatch("dataGate", {
        tableName: "mappedBrands",
        operation: "read",
      });
      if (brandsResponse.count) {
        this.brandCount = brandsResponse.count;
      }
      if (brandsResponse.data) {
        console.log("brandsResponse.data", brandsResponse.data);
        this.brands = brandsResponse.data;
        this.filteredBrands = this.brands;
        this.setPage();
      }
      this.loading = false;
    },
    goToBrandDashboard(brand) {
      this.$router.push({
        name: "brands-dashboard-id",
        params: { id: brand.id },
      });
    },
    // Pagination
    setPage() {
      this.displayedBrands = [];
      function numPages(total, numPerPage) {
        return Math.ceil(total / numPerPage);
      }
      // Validate page
      if (this.page < 1) this.page = 1;
      breadcrumbMixin.methods.savePage('mappedBrandsList', this.page)
      if (this.page > numPages(this.filteredBrands.length, this.numberPerPage))
        this.page = numPages(this.filteredBrands.length, this.numberPerPage);
      for (
        let i = (this.page - 1) * this.numberPerPage;
        i < this.page * this.numberPerPage && i < this.filteredBrands.length;
        i++
      ) {
        if (this.filteredBrands[i]) {
          this.displayedBrands.push(this.filteredBrands[i]);
        }
      }
    },
    async deleteBrand(brand) {
      console.log(brand);

      //update product tables
      const responseProducts = await this.$store.dispatch(
        "callMiddlewareRoute",
        {
          brandId: brand.id,
          route: "brands/deleteBrand",
        }
      );

      console.log(responseProducts);

      const response = await this.$store.dispatch("dataGate", {
        primaryKey: "id",
        entity: brand,
        tableName: "mappedBrands",
        operation: "delete",
      });

      this.loading = true;

      const brandsResponse = await this.$store.dispatch("dataGate", {
        tableName: "mappedBrands",
        operation: "read",
      });
      if (brandsResponse.count) {
        this.brandCount = brandsResponse.count;
      }
      if (brandsResponse.data) {
        console.log("brandsResponse.data", brandsResponse.data);
        this.brands = brandsResponse.data;
        this.filteredBrands = this.brands;
        this.setPage();
      }
      this.loading = false;
    },
  },
};
</script>

<style scoped>
.fancy-table {
  font-size: small;
  display: flex;
  flex-direction: column;
  height: 78vh;
  border-radius: 10px !important;
  overflow: auto;
}

.fancy-heading-row {
  position: relative;
  background-color: #5268fa;
  border-radius: 0px;
  box-shadow: none;
  --show-action: 0;
  border-top: 1px solid rgb(223, 225, 230);
  border-right: 1px solid rgb(223, 225, 230);
  border-left: 1px solid rgb(223, 225, 230);
  color: white;
  border-image: initial;
  border-bottom: none;
  font-weight: normal !important;
}

.fancy-heading-row th {
  font-weight: normal;
  padding: 8px;
  padding-left: 15px;
}

.fancy-row {
  position: relative;
  background-color: white;
  border-radius: 0px;
  box-shadow: none;
  --show-action: 0;
  border-top: 1px solid rgb(223, 225, 230);
  border-right: 1px solid rgb(223, 225, 230);
  border-left: 1px solid rgb(223, 225, 230);
  border-image: initial;
  border-bottom: none;
  cursor: pointer;
}

.fancy-row:hover {
  background-color: #f5f6f8;
}
.fancy-row:hover .actions-column {
  display: flex;
}
.inner-fancy-heading-row {
  min-width: 0px;
  padding: 8px 16px;
  display: grid;
  grid-template-columns: 2fr 0.5fr 1fr 1fr 1fr 0.5fr;
  -webkit-box-align: center;
  align-items: center;
}
.inner-fancy-heading-row-staged {
  min-width: 0px;
  padding: 8px 16px;
  display: grid;
  grid-template-columns: 1.5fr 0.5fr 1fr 1fr 0.5fr 0.5fr 0.5fr;
  -webkit-box-align: center;
  align-items: center;
}
.inner-fancy-row {
  min-width: 0px;
  padding: 8px 16px;
  display: grid;
  grid-template-columns: 2fr 0.5fr 1fr 1fr 1fr 0.5fr;
  -webkit-box-align: center;
  align-items: center;
}
.inner-fancy-row-staged {
  min-width: 0px;
  padding: 8px 16px;
  display: grid;
  grid-template-columns: 1.5fr 0.5fr 1fr 1fr 0.5fr 0.5fr 0.5fr;
  -webkit-box-align: center;
  align-items: center;
}

.fancy-row td {
  padding: 8px;
  font-size: 15px;
  padding-left: 15px;
}

.product-list {
  min-height: 68vh;
  max-height: 68vh;
  overflow: auto;
}
</style>
