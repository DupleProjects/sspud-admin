<template>
  <div class="px-3">
    <div class="d-flex" v-if="filter">
      <v-text-field
          v-model="search"
          label="Search"
          dense
          solo-inverted
          class="px-3"
      ></v-text-field>
    </div>
    <div class="d-flex" v-if="filter">
      <!--Review Required-->
      <v-select
          v-model="reviewRequired"
          :items="[{name: 'Required', val: 1}, {name: 'Not Required', val: 0}]"
          label="Review Required"
          :item-value="'val'"
          :item-text="'name'"
          :hide-details="true"
          class="px-3"
          clearable
          dense
          solo-inverted
      ></v-select>
      <!--Category-->
      <v-autocomplete
          v-if="type === 'staged'"
          v-model="filter.categoryId"
          v-on:change="onCategoryChange(false)"
          :items="categories"
          :item-value="'id'"
          :item-text="'name'"
          :hide-details="true"
          label="Category"
          class="px-3"
          clearable
          dense
          solo-inverted
      ></v-autocomplete>
      <!--Sub Category-->
      <v-autocomplete
          v-if="type === 'staged'"
          v-model="filter.subCategoryId"
          v-on:change="onCategoryChange(true)"
          :items="subCategories"
          :item-value="'id'"
          :item-text="'name'"
          label="Sub Category"
          :hide-details="true"
          class="px-3"
          clearable
          dense
          solo-inverted
          :disabled="!filter.categoryId"
      ></v-autocomplete>
      <!--Brand-->
      <v-autocomplete
          v-if="type === 'staged'"
          v-model="filter.brandId"
          :items="brands"
          v-on:change="onBrandChange"
          :item-value="'id'"
          :item-text="'name'"
          :hide-details="true"
          class="px-3"
          label="Brand"
          clearable
          dense
          solo-inverted
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
      search: '',
      publish: null,
      reviewRequired: null,
      brands: [],
      categories: [],
      subCategories: []
    }
  },
  watch: {
    search(val) {
      this.filter.name = val;
      this.updateFilter()
    },
    reviewRequired(val) {
      if (val !== null) {
        this.filter.reviewRequired = val;
        this.updateFilter()
      } else {
        delete this.filter.reviewRequired;
        this.updateFilter()
      }
    },
    publish(val) {
      if (val !== null) {
        this.filter.publish = val;
        this.updateFilter()
      } else {
        delete this.filter.publish;
        this.updateFilter()
      }
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
        this.subCategories = baseMixin.methods.getObjectsWhereKeysHaveValues(this.allCategories, {parentId: this.filter.categoryId}, false);
      }
      await this.updateFilter()
    },
    async onBrandChange() {
      await this.updateFilter()
    },
    updateFilter() {
      const criteria = {
        deleted: 0, publish: 0
      }
      if (this.filter.name) {
        criteria.name = { like: this.filter.name }
      }
      if (this.filter.categoryId !== null) {
        criteria.categoryId = this.filter.categoryId;
      }
      if (this.filter.subCategoryId !== null) {
        criteria.subCategoryId = this.filter.subCategoryId;
      }
      if (this.filter.brandId !== null) {
        criteria.brandId = this.filter.brandId;
      }
      if (this.filter.reviewRequired) {
        criteria.reviewRequired = this.filter.reviewRequired;
      }
      this.filterChangeCallBack(criteria);
    }
  }
}
</script>

<style scoped>

</style>
