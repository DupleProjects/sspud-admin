<template>
  <div class="">
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          small
          class="button-style"
          text
          @click="showModal()"
          style="text-align: center"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon small>mdi-eye</v-icon>
        </v-btn>
      </template>
      <span>View Linked Categories</span>
    </v-tooltip>
    <!--Linked Category Dialog-->
    <v-dialog style="z-index: 10000" scrollable v-model="show" max-width="550">
      <v-card max-height="600px" >
        <v-card-title> View Linked Categories </v-card-title>
        <v-card-subtitle>
          View Sub and Sub-Subcategories linked to a category
        </v-card-subtitle>
        <!-- If main category, subcategory and subsubcategory are received -->
        <v-card-text>
          <!-- Main List -->
          <v-list v-if="!loading">
            <!-- Main Category -->
            <v-list-group
              color="black"
              :value="true"
              :prepend-icon="undefined"
              append-icon=""
              disabled
              :ripple="false"
            >
              <template v-slot:activator>
                <!-- <v-list-item-content
                  v-if="!category.mappedCategoryId"
                  :style="background"
                >
                  <v-list-item-title class="main-category">{{
                    category.name
                  }}</v-list-item-title>
                </v-list-item-content> -->
                <v-list-item-content class="mt-1"  :style="getMainCategoryStyle(category)">
                  <v-list-item-title class="main-category">
                    <v-row>
                      <v-col cols="10">
                        {{
                          category.name
                        }}  
                      </v-col>
                      <v-col cols="2">
                        <categories-link-scraped-category-dialog
                          :categories="categories"
                          :scrapedCategory="category"
                        />
                      </v-col>
                    </v-row>
                  </v-list-item-title>
                </v-list-item-content>
              </template>

              <!-- Subcategory -->
              <v-list-group
                color="black"
                class="sub-category"
                :value="true"
                :ripple="false"
                append-icon=""
                prepend-icon=""
                disabled
                v-for="(subcat, index) in filteredSubcategories"
                :key="index"
              >
                <template v-slot:activator>
                  <v-list-item-content class="mt-1"  v-on:click="logCategory(subcat)" :style="getSubCategoryStyle(subcat)">
                    <v-list-item-title class="sub-category-title">
                      <v-row>
                        <v-col cols="10">
                          {{
                            subcat.name
                          }}
                        </v-col>
                        <v-col cols="2">
                          <categories-link-scraped-category-dialog
                            :categories="categories"
                            :scrapedCategory="subcat"
                          />
                        </v-col>
                      </v-row>
                    </v-list-item-title>
                  </v-list-item-content>
                  <!-- <v-list-item-content v-else :style="backgroundLinked">
                    <v-list-item-title class="sub-category-title">{{
                      subcat.name
                    }}</v-list-item-title>
                  </v-list-item-content> -->
                </template>

                <!-- Sub-Subcategory -->
                <v-list-item
                  class="sub-sub-category"
                  :ripple="false"
                  v-for="(subSubCat, i) in subCategories"
                  :key="i"
                  link
                  v-if="subSubCat.parentId == subcat.id"
                >
                  <!-- <v-list-item-content v-if="!subSubCat.mappedCategoryId" :style="background">
                    <v-list-item-title class="sub-sub-category-title">{{
                      subSubCat.name
                    }}</v-list-item-title>
                  </v-list-item-content> -->
                  <v-list-item-content class="mt-1"  v-on:click="logCategory(subSubCat)" :style="getSubSubCategoryStyle(subSubCat)">
                    <v-list-item-title class="sub-sub-category-title" >
                      <v-row>
                        <v-col cols="10">
                          {{
                            subSubCat.name
                          }}
                        </v-col>
                        <v-col cols="2">
                          <categories-link-scraped-category-dialog
                            :categories="categories"
                            :scrapedCategory="subSubCat"
                          />
                        </v-col>
                      </v-row>
                   </v-list-item-title>                    
                  </v-list-item-content>
                </v-list-item>
              </v-list-group>
            </v-list-group>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn :disabled="loading" color="primary" text @click="close()"
            >Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    type: "",
    category: [],
    subCategories: [],
    subSubCategories: [],
    categories: []
  },
  data() {
    return {
      loading: false,
      show: false,
      admins: [{ name: "Management" }, { name: "Settings" }],
      cruds: [
        ["Create", "mdi-plus-outline"],
        ["Read", "mdi-file-outline"],
        ["Update", "mdi-update"],
        ["Delete", "mdi-delete"],
      ],
      filteredSubcategories: [],
      filteredSubSubcategories: [],
      background: "background-color:#f54242; border-radius:10px;",
      backgroundLinked: "background-color:#31a857; border-radius:10px;",
      mainCatBG: '',
    };
  },
  methods: {
    close() {
      this.show = false;
    },
    showModal() {
      this.loading = true;

      this.filteredSubcategories = [];

      console.log(this.category);

      if (this.subCategories) {
        this.subCategories.forEach((element) => {
          if (element.parentId == this.category.id) {
            this.filteredSubcategories.push(element);
          }
        });
      }

      this.show = true;
      this.loading = false;
    },
    getSubSubCategories(obj) {
      this.subCategories.forEach(element2 => {
        if (element2.parentId == obj.id) {
          this.filteredSubSubcategories.push(element2);
        }
      });
      console.log(obj);
    },
    getMainCategoryStyle(category){
      if(category.mappedCategoryId == null){
        return 'background-color:#f54242; border-radius:10px;'
      }else{
        var counter1 = 0;
        var filteredArray = [];
        this.subCategories.forEach(sub => {
          if(sub.parentId == category.id && sub.mappedCategoryId == null){
            filteredArray.push(sub);
            counter1 ++;
          }
        });
        if(counter1 > 0){
          return 'background-color:#fcab38; border-radius:10px;'
        }else{
          var counter2 = 0;
          if(this.filteredArray){
            this.filteredArray.forEach(subSub => {
                // result = inventory.find( subSubCat  => subSubCat.parentId === subSub.id );
                this.subCategories.forEach(element => {
                  if(element.parentId == subSub.id && element.mappedCategoryId == null){
                    counter2 ++;
                  }
                })
            })
          }            
            if(counter2 > 0){
              return 'background-color:#fcab38; border-radius:10px;'
            }else{
              return 'background-color:#31a857; border-radius:10px;'
            }
        }
      }
    },
    getSubCategoryStyle(subcategory){
      if(subcategory.mappedCategoryId == null){
        return 'background-color:#f54242; border-radius:10px;'
      }else{
        var counter1 = 0;
        var filteredArray = [];
        this.subCategories.forEach(sub => {
          if(sub.parentId == subcategory.id && sub.mappedCategoryId == null){
            filteredArray.push(sub);
            counter1 ++;
          }
        });
        if(counter1 > 0 ){
          return 'background-color:#fcab38; border-radius:10px;'
        }else{
          return 'background-color:#31a857; border-radius:10px;'
        }
      }
    },
    getSubSubCategoryStyle(subSubCategory){
        if(subSubCategory.mappedCategoryId == null){
          return 'background-color:#f54242; border-radius:10px;'
        }else{
          return 'background-color:#31a857; border-radius:10px;'
        }
    },
    logCategory(obj){
      console.log("👉OBJECT", obj);
    }
  },
};
</script>

<style scoped>
.main-category {
  padding-left: 10px;
}

.sub-category {
  margin-left: 50px;
}

.sub-category-title {
  margin-left: 10px;
}

.sub-sub-category {
  padding-left: 30px;
  margin-left: 50px;
}
.sub-sub-category-title {
  margin-left: 20px;
  display: block;
}

.item-style{
  border-radius: 10px;
}
</style>
