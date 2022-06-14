<template>
  <div class="p-3">
    <!--Header-->
    <div
        class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
      <h1 class="h2">Process Variables</h1>
    </div>
    <hr>
    <div v-if="activeProcessVariables" class="card p-5">
      <div class="card-title">Variables</div>
      <v-form
          ref="validVariablesForm"
          v-model="validVariablesForm"
          lazy-validation>
        <div class="d-flex">
          <v-text-field
              class="mx-3"
              label="Volumetric Weight Factor"
              v-model="activeProcessVariables.volumetricWeightFactor"
              :rules="[(v) => !!v || 'Volumetric Weight Factor is required']">
          </v-text-field>
          <v-text-field
              class="mx-3"
              label="Kg Rate (BWP)"
              v-model="activeProcessVariables.kgRate"
              :rules="[(v) => !!v || 'Kg Rate is required']">
          </v-text-field>
          <v-text-field
              class="mx-3"
              label="Volume Rate (BWP)"
              v-model="activeProcessVariables.volumeRate"
              :rules="[(v) => !!v || 'Volume Rate is required']">
          </v-text-field>
          <v-text-field
              class="mx-3"
              label="Fuel Surcharge (%)"
              v-model="activeProcessVariables.fuelSurcharge"
              :rules="[(v) => !!v || 'Fuel Surcharge is required']">
          </v-text-field>
          <v-text-field
              class="mx-3"
              label="Minimum Transport (BWP)"
              v-model="activeProcessVariables.minimumTransportChange"
              :rules="[(v) => !!v || 'Minimum Transport is required']">
          </v-text-field>
          <v-text-field
              class="mx-3"
              label="BOBS Permit Cost (BWP)"
              v-model="activeProcessVariables.BOBSPermitCost"
              :rules="[(v) => !!v || 'BOBS Permit Cost is required']">
          </v-text-field>
          <v-text-field
              class="mx-3"
              label="Documentation Cost (BWP)"
              v-model="activeProcessVariables.documentationCost"
              :rules="[(v) => !!v || 'Documentation Cost is required']">
          </v-text-field>
          <v-text-field
              class="mx-3"
              label="Profit Margin (%)"
              v-model="activeProcessVariables.profiteMargin"
              :rules="[(v) => !!v || 'Profit Margin is required']">
          </v-text-field>
        </div>
      </v-form>
      <div class="text-end">
        <button class="btn btn-primary">
          <v-progress-circular
              v-if="loading"
              :size="30"
              :width="7"
              color="white"
              indeterminate
          ></v-progress-circular>
          <span v-if="!loading" v-on:click="save">Save</span>
        </button>
      </div>
      <v-snackbar
          v-model="snackbar"
          outlined
          color="success"
          :timeout="timeout">
        {{ snackBarText }}
      </v-snackbar>
    </div>
  </div>
</template>

<script>
import baseMixin from "@/mixins/baseMixin.js";
export default {
  mixins: [baseMixin],
  data() {
    return {
      activeProcessVariables: null,
      validVariablesForm: false,
      loading: false,
      // Snackbar
      snackbar: false,
      snackBarText: 'My timeout is set to 2000.',
      timeout: 2000,
    };
  },
  beforeMount() {
    this.$nextTick(async function () {
      this.loading = true;
      const processVariableResponse = await this.$store.dispatch('dataGate', {
        tableName: 'processVariables',
        operation: 'read',
        whereCriteria: {active: 1}
      });
      if (processVariableResponse && processVariableResponse.data) {
        this.activeProcessVariables = processVariableResponse.data[0];
      }
      this.loading = false;
    });
  },
  unmounted() {
    this.$nextTick(async function () {});
  },
  methods: {
    async save() {
      if (this.$refs.validVariablesForm.validate()) {
        this.loading = true;
        const saveResponse = await this.$store.dispatch('dataGate', {
          tableName: 'processVariables',
          operation: 'update',
          primaryKey: 'id',
          entity: this.activeProcessVariables
        });
        this.loading = false;
        this.snackBarText = 'Variables Saved!';
        this.snackbar = true;
        this.saving = false;
      }
    }
  },
};
</script>

<style scoped></style>
