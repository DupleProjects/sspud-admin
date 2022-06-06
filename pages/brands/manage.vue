<template>
  <div>
    <!--Header-->
    <div
      class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom"
    >
      <h1 class="h2">Manage Brands</h1>
      <div class="btn-toolbar mb-2 mb-md-0">
        <div class="btn-group me-2">
          <div class="btn-group me-2">
            <brands-create-brand-dialog
              :brandCreateCallBack="brandCreateCallBack"
              :brands="brands"
            />
          </div>
        </div>
      </div>
    </div>
    <!--Table-->
    <div class="table-responsive">
      <table class="table table-striped table-sm">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Published</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(brand, index) of brands" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ brand.name }}</td>
            <td>
              <v-icon
                color="primary"
                class="icon-style hide-on-desktop"
                dark
                v-if="brand.publish == 1"
              >
                mdi-publish
              </v-icon>
              <v-icon
                color="blue"
                class="icon-style hide-on-desktop"
                dark
                v-if="brand.publish == 0"
              >
                mdi-publish-off
              </v-icon>
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
export default {
  mixins: [baseMixin],
  data() {
    return {
      loading: false,
      page: 1,
      numberPerPage: 20,
      brandCount: 0,
      brands: [],
      filteredBrands: [],
      displayedBrands: [],
    };
  },
  watch: {
    page(val) {},
    search(val) {},
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
        console.log("brandsResponse.data", brandsResponse.data);
        this.brands = brandsResponse.data;
        this.filteredBrands = this.brands;
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

<style scoped></style>
