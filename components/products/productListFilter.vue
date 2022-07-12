<template>
  <div class="px-3 pt-3">
    <div class="d-flex" v-if="filter">
      <h4 class="mb-0">{{heading}}</h4>
      <v-text-field
          v-model="search"
          label="Search"
          class="px-3 pt-0 mt-0"
      ></v-text-field>
    </div>
    <div class="d-flex" v-if="filter">
      <!--Review Required-->
      <v-select
          v-if="type === 'staged'"
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
      <v-autocomplete
          v-if="type === 'scraped'"
          v-model="filter.categoryName"
          v-on:change="onCategoryChange(false)"
          :items="categories"
          :item-value="['id','name']"
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
          label="Subcategory"
          :hide-details="true"
          class="px-3"
          clearable
          dense
          solo-inverted
          :disabled="!filter.categoryId"
      ></v-autocomplete>
      <v-autocomplete
          v-if="type === 'scraped'"
          v-model="filter.scrapedSubCategoryId"
          v-on:change="onCategoryChange(true)"
          :items="subCategories"
          :item-value="'name'"
          :item-text="'name'"
          label="Subcategory"
          :hide-details="true"
          class="px-3"
          clearable
          dense
          solo-inverted
          :disabled="!filter.categoryName"
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
      <v-autocomplete
          v-if="type === 'scraped'"
          v-model="filter.brandName"
          :items="brands"
          v-on:change="onBrandChange"
          :item-value="'name'"
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
    filterChangeCallBack: null,
    heading: ''
  },
  data() {
    return {
      loading: false,
      search: '',
      publish: null,
      reviewRequired: null,
      brands: [],
      categories: [],
      subCategories: [],
      scrapedCategories: []
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
        const categories = await this.$store.dispatch("dataGate", {
          tableName: "scrapedCategories",
          operation: "read",
        });
        this.scrapedCategories = categories.data;
        categories.data.forEach((category) => {
          if (!category.parentId) {
            this.categories.push(category);
          }
          if (this.filter.categoryName) {
            this.subCategories = baseMixin.methods.getObjectsWhereKeysHaveValues(
                this.scrapedCategories, {parentId: this.filter.categoryName}, false
            );
          }
        });

        const brandsResponse = await this.$store.dispatch("dataGate", {
          tableName: "scrapedBrands",
          operation: "read",
        });
        if (brandsResponse.hasOwnProperty('data')) {
          // this.brands = brandsResponse.data;
          brandsResponse.data.forEach(brand => {
            this.brands.push(brand)
          })
        }

      } else if (this.type === 'staged') {
        const categories = await this.$store.dispatch("dataGate", {
          tableName: "mappedCategories",
          operation: "read",
        });
        if (categories && categories.success) {
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

        }
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
      if(this.type == 'staged'){
        if (!sub) {
          this.filter.subCategoryId = null;
          this.subCategories = baseMixin.methods.getObjectsWhereKeysHaveValues(this.allCategories, {parentId: this.filter.categoryId}, false);
        }
        await this.updateFilter()
      }
      if(this.type == "scraped"){
        if (!sub) {
          this.filter.subCategoryId = null;
          const mainCategory = baseMixin.methods.getObjectsWhereKeysHaveValues(this.scrapedCategories, {name: this.filter.categoryName}, false);

          if(this.mainCategory){
            console.log("👉",mainCategory[0].id);
            this.subCategories = baseMixin.methods.getObjectsWhereKeysHaveValues(this.scrapedCategories, {parentId: mainCategory[0].id}, false);
          }
          
        }
        await this.updateFilter()
        console.log("Scraped filter");
      }
      
    },
    async onBrandChange() {
      if(this.type == 'staged'){
        await this.updateFilter()
      }
      if(this.type == 'scraped'){
        await this.updateFilter()
      }
    },
    updateFilter() {
      if(this.type == 'staged'){
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
      if(this.type == 'scraped'){
        const criteria = {}
        if (this.filter.name) {
          criteria.name = { like: this.filter.name }
        }
        if (this.filter.categoryName !== null) {
          criteria.categoryName = this.filter.categoryName;
        }
        if (this.filter.scrapedSubCategoryId !== null) {
          criteria.subCategoryName = this.filter.scrapedSubCategoryId;
        }
        if (this.filter.brandName !== null) {
          criteria.brand = this.filter.brandName;
        }
        this.filterChangeCallBack(criteria);
      }
      
    }
  }
}
</script>

<style scoped>

</style>
