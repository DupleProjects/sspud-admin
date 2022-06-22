<template>
  <div class="">
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <button
            @click="showModal()"
            type="button"
            class="btn btn-sm btn-outline-secondary">
          Export
        </button>
      </template>
      <span>Export</span>
    </v-tooltip>
    <!--New Category Dialog-->
    <v-dialog style="z-index: 10000" v-model="exportModal" max-width="500">
      <v-card>
        <v-card-title> Export </v-card-title>
        <v-card-subtitle class="mt-0">
          Please indicate if you would like to export the current {{exportSheetName}} or all {{exportSheetName}}.
        </v-card-subtitle>
        <v-card-text>
        <v-switch
          v-model="exportAll"
          v-on:change="removeDoc();open()"
          label="Export all"
        >
        </v-switch>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-progress-circular
            v-if="disableExport"
            :size="20"
            indeterminate
            color="primary"
          ></v-progress-circular>
          <v-btn
            color="primary"
            text
            @click="exportModal = false"
            :href="exportHref"
            :disabled="disableExport"
          >
            Export
          </v-btn>
          <v-btn :disabled="loading" color="primary" text @click="closeExport"
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
    openFunction: null,
    products: [],
    exportTableName: "",
    exportSheetName: "",
    exportCriteria: "",
  },
  data() {
    return {
      loading: false,
      deleteDialog: false,
      exportModal: false,
      exportHref: "",
      href: "",
      exportAll: false,
      disableExport: false,
    };
  },
  mounted() {},
  methods: {
    async showModal() {
      this.exportModal = true;
      this.exportAll = false;
      this.exportHref = await this.showExport(this.exportAll);
    },
    async open() {
      //   if (this.openFunction) {
      this.disableExport = true;
      this.exportHref = await this.showExport(this.exportAll);
      this.disableExport = false;
      //   }
    },
    async close() {
      const arr = this.exportHref.split("=");

      console.log("arr", arr);
      const exportCancelReturn = await this.$store.dispatch(
        "callMiddlewareRoute",
        {
          route: "excelExport/remove",
          docID: arr[1],
        }
      );

      this.exportModal = false;
    },
    async removeDoc() {
      const arr = this.exportHref.split("=");

      //   console.log("arr", arr);
      const exportCancelReturn = await this.$store.dispatch(
        "callMiddlewareRoute",
        {
          route: "excelExport/remove",
          docID: arr[1],
        }
      );
    },
    async showExport(exportAll) {
      console.log("EXPORT ALL BOOLEAN", exportAll);
      if (exportAll && exportAll == true) {
        console.log("EXPORT ALL ROUTE CALLED", exportAll);
        const exportReturn = await this.$store.dispatch("callMiddlewareRoute", {
          route: "excelExport/createAllExcel",
          tableName: this.exportTableName,
          sheetName: this.exportSheetName,
          whereCriteria: this.exportCriteria,
        });

        this.href = exportReturn.DownloadURL;
        console.log("⚡⚡THIS HREF", this.href);
        return this.href;
      } else if (exportAll == false) {
        var body = {
          dataBody: this.products,
          sheetName: this.exportSheetName,
        };

        const exportReturn = await this.$store.dispatch("callMiddlewareRoute", {
          route: "excelExport/createExcel",
          dataBody: body.dataBody,
          sheetName: body.sheetName,
        });

        this.href = exportReturn.DownloadURL;
        return this.href;
      }
    },
    async closeExport() {
      var arr = this.href.split("=");

      if (arr) {
        var body = {
          docID: arr[1],
        };
        const exportCancelReturn = await this.$store.dispatch(
          "callMiddlewareRoute",
          {
            route: "excelExport/remove",
            docID: body.docID,
          }
        );
      }
      this.exportModal = false;
    },
  },
};
</script>

<style scoped>
/* .button-style{
  float:right;
} */
</style>
