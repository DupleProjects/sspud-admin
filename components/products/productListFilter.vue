<template>
  <div class="px-3">
    <div class="d-flex" v-if="filter">
      <v-text-field
          v-model="search"
          label="Search"
          @change="onSearchChange"
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
          v-on:change="onCategoryChange()"
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
      this.filter.name = {
        like: val
      };
      this.filterChangeCallBack(this.filter);
    },
    reviewRequired(val) {
      if (val !== null) {
        console.log('val', val)
        this.filter.reviewRequired = val;
        console.log('this.filter', this.filter)
        this.filterChangeCallBack(this.filter);
      } else {
        delete this.filter.reviewRequired;
        this.filterChangeCallBack(this.filter);
      }
    },
    publish(val) {
      if (val !== null) {
        console.log('val', val)
        this.filter.publish = val;
        console.log('this.filter', this.filter)
        this.filterChangeCallBack(this.filter);
      } else {
        delete this.filter.publish;
        this.filterChangeCallBack(this.filter);
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
