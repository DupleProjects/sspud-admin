<template>
  <div>
    <div class="d-flex" v-if="filter">
      <v-text-field
          v-model="filter.name"
          label="Search"
          @change="onSearchChange"
          class="mb-n4"
      ></v-text-field>
      <v-autocomplete
          v-if="type === 'staged'"
          v-model="filter.categoryId"
          v-on:change="onCategoryChange()"
          :items="categories"
          :item-value="'id'"
          :item-text="'name'"
          label="Category"
          prepend-icon="mdi-shape"
      ></v-autocomplete>
      <v-autocomplete
          v-if="type === 'staged'"
          v-model="filter.subCategoryId"
          v-on:change="onCategoryChange(true)"
          :items="subCategories"
          :item-value="'id'"
          :item-text="'name'"
          label="Sub Category"
          prepend-icon="mdi-shape"
      ></v-autocomplete>
      <v-autocomplete
          v-if="type === 'staged'"
          v-model="filter.brandId"
          :items="brands"
          v-on:change="onBrandChange"
          :item-value="'id'"
          :item-text="'name'"
          label="Brand"
          prepend-icon="mdi-watermark"
      ></v-autocomplete>
    </div>
  </div>
</template>

<script>
import baseMixin from "@/mixins/baseMixin";

export default {
  props: {
    filter: null,
    type: '',
    filterChangeCallBack: null
  },
  data() {
    return {
      loading: false,
      brands: [],
      categories: [],
      subCategories: []
    }
  },
  mounted() {

  },
  beforeMount() {
    this.$nextTick(async function () {
      this.loading = true;
      if (this.type === 'scraped') {

      } else if (this.type === 'staged') {
        const categories = await this.$store.dispatch("dataGate", {
          tableName: "mappedCategories",
          operation: "read",
        });
        this.allCategories = categories.data;
        categories.data.forEach((category) => {
          if (!category.parentId) {
            this.categories.push(category);
          }
          if (this.filter.categoryId) {
            this.subCategories = baseMixin.methods.getObjectsWhereKeysHaveValues(
                this.allCategories, {parentId: this.filter.categoryId}, false
            );
          }
        });
        const brandsResponse = await this.$store.dispatch("dataGate", {
          tableName: "mappedBrands",
          operation: "read",
        });
        if (brandsResponse.hasOwnProperty('data')) {
          this.brands = brandsResponse.data;
        }
      }
      this.loading = false;
    });
  },
  methods: {
    async onCategoryChange(sub) {
      if (!sub) {
        this.filter.subCategoryId = null;
        this.subCategories = baseMixin.methods.getObjectsWhereKeysHaveValues(this.allCategories, {parentId: this.filter.categoryId}, false)
      }
      await this.filterChangeCallBack(this.filter);
    },
    async onSearchChange(val) {
      this.filter.name = val;
      await this.filterChangeCallBack(this.filter);
    },
    async onBrandChange() {
      await this.filterChangeCallBack(this.filter);
    }
  }
}
</script>

<style scoped>

</style>
