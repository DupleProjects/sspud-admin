<template>
  <div>
    <button
        @click="openDialog()"
        type="button" class="btn btn-sm btn-outline-secondary">
      New Category
    </button>
    <!--New Category Dialog-->
    <v-dialog style="z-index: 10000" v-model="newCategoryDialog" max-width="1600">
      <v-card>
        <v-card-title>
          New Category
        </v-card-title>
        <v-card-subtitle>
          Create a new category
        </v-card-subtitle>
        <v-card-text class="pb-0">
          <h1>New Category Dialog</h1>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="primary"
              text
              v-on:click="saveCategory">
            Save
          </v-btn>
          <v-btn color="primary" text @click="newCategoryDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {

  },
  data() {
    return {
      newCategoryDialog: false
    }
  },
  mounted() {

  },
  methods: {
    async openDialog() {
      this.newCategoryDialog = true;
    },
    async saveCategory() {
      // Save...
    },
  }
}
</script>

<style scoped>

</style>
