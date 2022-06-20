<template>
  <div>
    <v-tooltip top>
    <template v-slot:activator="{ on, attrs }">
        <v-btn
        small
        class="button-style"
        icon
        color="black"
        @click="editShop(editedShop)"
        style="text-align: center"
        v-bind="attrs"
        v-on="on"
        >
        <v-icon small>mdi-lead-pencil</v-icon>
        </v-btn>
    </template>
    <span>Edit</span>
    </v-tooltip>
    <!--Edit Shop Dialog-->
    <v-dialog style="z-index: 10000" v-model="editShopDialog" max-width="800">
      <v-card v-if="editedShop">
        <v-card-title>
          Edit Shop
        </v-card-title>
        <v-card-subtitle>
          Edit the shop's delivery cost or change the shop's status
        </v-card-subtitle>
        <v-card-text class="pb-0">
          <v-form
              ref="editShopForm"
              v-model="validShopForm"
              lazy-validation>
            <v-text-field
                prepend-icon="mdi-store"
                v-model="editedShop.name"
                :rules="[(v) => !!v || 'A name is required']"
                label="Name"
                disabled
            ></v-text-field>
            <v-select
                v-model="shopStatus"
                prepend-icon="mdi-list-status"
                :items="['Active','Inactive']"
                hint="Is the shop active or inactive?"
                label="Status"
            >
            </v-select>
            <v-text-field
                prepend-icon="mdi-alpha-r-box-outline"
                v-model="cost"
                :rules="[(v) => !!v || 'An delivery cost is required']"
                hint="The shop's delivery cost"
                label="Delivery Cost"
                type="number"
                hide-spin-buttons
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-progress-circular
              v-if="loading"
              :size="20"
              indeterminate
              color="primary"
          ></v-progress-circular>
          <v-btn
              v-if="!loading"
              :disabled="!validShopForm"
              color="primary"
              text
              v-on:click="saveShop">
            Save
          </v-btn>
          <v-btn
              :disabled="loading"
              color="primary"
              text
              @click="editShopDialog = false; cost = editedShop.deliveryCost">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    saveCallBack: null,
    shopsCallBackEdit: null,
    editedShop: null
  },
  data() {
    return {
      loading: false,
      validShopForm: true,
      editShopDialog: false,
      shopStatus: null,
      cost: this.editedShop.deliveryCost
    }
  },
  mounted() {

  },
  methods: {
    async saveShop() {
      this.loading = true;

      if(this.shopStatus == "Active"){
        this.editedShop.active = 1
      }else{
        this.editedShop.active = 0
      }
      if(this.editedShop.deliveryCost){
        this.editedShop.deliveryCost = parseFloat(this.cost)
      }else{
          this.editedShop.deliveryCost = parseFloat(this.cost)
      }
      // Save the  shop if the form is valid
      if (this.$refs.editShopForm.validate()) {
        const response = await this.$store.dispatch("dataGate", {
          primaryKey: "id",
          entity: this.editedShop,
          tableName: "shops",
          operation: "update",
        });
        // If valid response return value
        if (response && response.response) {
          this.shopsCallBackEdit(this.editedShop)
        }
      }
      this.editShopDialog = false;
      this.loading = false;
    },
    editShop(){
        this.cost == this.editedShop.deliveryCost
        if(this.editedShop.active == 1){
            this.shopStatus = "Active"
        }else{
            this.shopStatus = "Inactive"
        }
        

        this.editShopDialog = true;
    }
  }
}
</script>

<style scoped>

</style>
