<template>
  <div class="flex-grow-1">
    <div class="d-flex" v-if="filter">
      <v-text-field
          v-model="search"
          label="Search"
          hide-details
          class="px-3 pt-0 mt-0"
      ></v-text-field>
      <v-btn
          color="primary"
          dark
          @click.stop="drawer = !drawer">
        <v-icon dark>
          mdi-filter
        </v-icon>
      </v-btn>
    </div>
    <v-navigation-drawer
        v-if="filter"
        v-model="drawer"
        absolute
        right
        temporary>
      <v-list-item>
        <v-list-item-avatar>
          <v-icon
              color="primary"
              class="icon-style hide-on-desktop"
              dark>
            mdi-filter
          </v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>Advance Filter</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider class="mt-0"></v-divider>
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
          :disabled="!filter.categoryId || subCategories.length === 0"
      ></v-autocomplete>
      <v-autocomplete
          v-if="type === 'scraped'"
          v-model="filter.subCategoryName"
          v-on:change="onCategoryChange(true)"
          :items="subCategories"
          :item-value="'name'"
          :item-text="'name'"
          label="Subcategory"
          :hide-details="true"
          class="px-3"
          clearable
          :disabled="!filter.categoryName || subCategories.length === 0"
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
      ></v-autocomplete>
      <template v-slot:append>
        <div class="text-center py-2">
          <v-btn
              color="error"
              dark
              @click.stop="drawer = !drawer">
            <v-icon dark>
              mdi-close-circle-outline
            </v-icon>
            Close
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
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
      scrapedCategories: [],
      drawer: null,
      items: [
        { title: 'Home', icon: 'mdi-view-dashboard' },
        { title: 'About', icon: 'mdi-forum' },
      ],
    }
  },
  watch: {
    search(val) {
      this.filter.name = val;
      this.updateFilter();
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
  beforeMount() {
    this.$nextTick(async function () {
      this.loading = true;
      // Check if we have saved filter. If so then we should set the name
      if (this.filter) {
        if (this.filter.hasOwnProperty('name') && this.filter.name.hasOwnProperty('like')) {
          this.search = this.filter.name.like;
          this.filter.name = this.filter.name.like;
        }
      }
      await this.loadDate();
      // Update category
      this.onCategoryChange(false, true);
    });
  },
  methods: {
    async loadDate() {
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
            if (this.filter && this.filter.categoryId) {
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
    },
    async onCategoryChange(sub, initialise) {
      if (this.type === 'staged' && this.filter) {
        if (!sub) {
          if (!initialise) {
            this.filter.subCategoryId = null;
          }
          this.subCategories = baseMixin.methods.getObjectsWhereKeysHaveValues(this.allCategories, {parentId: this.filter.categoryId}, false);
        }
        if (!initialise) {
          await this.updateFilter()
        }
      }
      if (this.type === "scraped" && this.filter) {
        if (!sub) {
          if (!initialise) {
            this.filter.scrapedSubCategoryId = null;
          }
          const mainCategory = baseMixin.methods.getObjectsWhereKeysHaveValues(this.scrapedCategories, {name: this.filter.categoryName}, true);
          if (mainCategory) {
            this.subCategories = baseMixin.methods.getObjectsWhereKeysHaveValues(this.scrapedCategories, {parentId: mainCategory.id}, false);
          }
        }
        if (!initialise) {
          await this.updateFilter()
        }
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
      if (this.type === 'staged') {
        const criteria = {}
        if (this.filter.name) {
          criteria.name = { like: this.filter.name }
        }
        if (this.filter.categoryId) {
          criteria.categoryId = this.filter.categoryId;
        }
        if (this.filter.subCategoryId) {
          criteria.subCategoryId = this.filter.subCategoryId;
        }
        if (this.filter.brandId) {
          criteria.brandId = this.filter.brandId;
        }
        if (this.filter.reviewRequired) {
          criteria.reviewRequired = this.filter.reviewRequired;
        }
        this.filterChangeCallBack(criteria);

      }
      if (this.type === 'scraped') {
        const criteria = {}
        if (this.filter.name) {
          criteria.name = { like: this.filter.name }
        }
        if (this.filter.categoryName) {
          criteria.categoryName = this.filter.categoryName;
        }
        if (this.filter.subCategoryName) {
          criteria.subCategoryName = this.filter.subCategoryName;
        }
        if (this.filter.brandName) {
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
