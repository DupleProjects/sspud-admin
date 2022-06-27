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
              label="Foreign Tax"
              v-model="activeProcessVariables.foreignTax"
              :rules="[(v) => !!v || 'Foreign Tax is required']">
          </v-text-field>
          <v-text-field
              class="mx-3"
              label="Domestic Tax"
              v-model="activeProcessVariables.domesticTax"
              :rules="[(v) => !!v || 'Domestic Tax is required']">
          </v-text-field>
          <v-text-field
              class="mx-3"
              label="Foreign Conversion"
              v-model="activeProcessVariables.foreignConversion"
              :rules="[(v) => !!v || 'Foreign Conversion is required']">
          </v-text-field>
          <v-text-field
              class="mx-3"
              label="Profit Margin (%)"
              v-model="activeProcessVariables.profitMargin"
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
