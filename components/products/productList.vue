<template>
  <div class="table-responsive">
    <table class="table table-striped table-sm">
      <thead>
        <tr>
          <th class="name-column" scope="col">Name</th>
          <th class="info-column2" scope="col">Price</th>
          <th class="info-column" scope="col">Category</th>
          <th class="info-column" scope="col">Subcategory</th>
          <th class="info-column" scope="col">Brand</th>
          <th class="info-column2" scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          @click="goToProductDashboard(product)"
          v-for="(product, index) of products"
          :key="index"
        >
          <td class="name-column">{{ product.name }}</td>
          <td class="info-column2">R{{ product.price }}</td>
          <td v-if="type === 'scraped'" class="info-column">{{ product.categoryName }}</td>
          <td v-if="type === 'staged'" class="info-column"><span  v-if="allCategories.find(x => x.id === product.categoryId) != undefined">{{ allCategories.find(x => x.id === product.categoryId).name }}</span></td>
          <td v-if="type === 'scraped'" class="info-column">{{ product.subCategoryName }}</td>
          <td v-if="type === 'staged'" class="info-column"><span  v-if="allCategories.find(x => x.id === product.subCategoryId) != undefined">{{ allCategories.find(x => x.id === product.subCategoryId).name }}</span></td>
          <td v-if="type === 'scraped'" class="info-column">{{ product.brand}}</td>
          <td v-if="type === 'staged'" class="info-column"><span  v-if="allBrands.find(x => x.id === product.brandId) != undefined">{{ allBrands.find(x => x.id === product.brandId).name }}</span></td>
          <td class="info-column2">
            <div>
                <i class="fa fas fa-pencil" style="margin-right:15px" ></i>
                <i v-if="canDelete" class="fa fas fa-trash" style="margin-right:15px" ></i>
            </div>
        </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import allCategoriesVue from '../categories/allCategories.vue';
export default {
  props: {
    type: "",
    products: [],
    canDelete: false,
    allCategories: [],
    allBrands: []
  },
  data() {
    return {
      
    };
  },
  mounted() {},
  methods: {
    goToProductDashboard(product) {
      const params = {id: product.id};
      // Go to different dashboards based on type
      if (this.type === "scraped") {
        this.$router.push({
          name: "products-scraped-dashboard-id",
          params,
        });
      } else if (this.type === "staged") {
        this.$router.push({
          name: "products-staged-dashboard-id",
          params,
        });
      } else if (this.type === "published") {
        this.$router.push({
          name: "categories-dashboard-id",
          params,
        });
      }
    },
  },
};
</script>

<style scoped>

.info-column{
  width: 15%;
}
.info-column2{
  width: 7%;
}

.name-column{
  width: 28%;
}

</style>
