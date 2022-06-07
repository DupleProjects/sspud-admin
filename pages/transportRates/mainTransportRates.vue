<template>
  <div>
    <div class="row">
      <div class="col-2"><h2>Main Transport Rates</h2></div>
      <div class="col-8"></div>
      <div class="col-2">
        <v-btn
          style="width: 100%; color: White"
          color="primary"
          rounded
          dark
          :loading="isSelecting"
          @click="dialogUploadRates = true"
        >
          Upload Rate Sheet
        </v-btn>
      </div>
    </div>

    <input ref="uploader" class="d-none" type="file" @change="onFileChanged" />
    <hr />

    <div class="row table-row">
      <div class="col">
        <h2>Rate Sheets</h2>
        <hr />
        <div class="table-responsive">
          <table class="table table-striped table-sm">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Type</th>
                <th scope="col">Active</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(rateSheet, index) of rateSheets"
                :key="index"
                @click="rateSheetClicked(rateSheet)"
              >
                <td>{{ index + 1 }}</td>
                <td>{{ rateSheet.name }}</td>
                <td>{{ rateSheet.type }}</td>
                <td>{{ rateSheet.isActive }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="col">
        <h2>Rate Sheet Details</h2>
        <hr />
        <div style="overflow-y: auto; overflow-x: none; height: 75vh">
          <table
            class="table table-striped table-sm"
            v-if="showDefualRates == 'defualt'"
          >
            <thead>
              <tr>
                <th scope="col">KG</th>
                <th
                  scope="col"
                  v-for="(Zone, index) of zoneUnique"
                  :key="index"
                >
                  {{ Zone }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(vol, index) of volumetricUnique" :key="index">
                <td>
                  <b>{{ vol }}</b>
                </td>
                <td>
                  <v-text-field
                    type="number"
                    v-model="
                      rates.find(
                        (x) => x.volumetric == vol && x.zoneId == zoneUnique[0]
                      ).rate
                    "
                  ></v-text-field>
                </td>
                <td>
                  <v-text-field
                    type="number"
                    v-model="
                      rates.find(
                        (x) => x.volumetric == vol && x.zoneId == zoneUnique[1]
                      ).rate
                    "
                  ></v-text-field>
                </td>
                <td>
                  <v-text-field
                    type="number"
                    v-model="
                      rates.find(
                        (x) => x.volumetric == vol && x.zoneId == zoneUnique[2]
                      ).rate
                    "
                  ></v-text-field>
                </td>
              </tr>
            </tbody>
          </table>
          <table
            class="table table-striped table-sm"
            v-if="showDefualRates == 'Remote'"
          >
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Location</th>
                <th scope="col">Closest SC Office</th>
                <th scope="col">rate</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(rateSheet, index) of rates" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ rateSheet.location }}</td>
                <td>{{ rateSheet.SC_Office }}</td>
                <td>
                  <v-text-field
                    type="number"
                    v-model="rates.find((x) => x.id == rateSheet.id).rate"
                  ></v-text-field>
                </td>
              </tr>
            </tbody>
          </table>
          <table
            class="table table-striped table-sm"
            v-if="showDefualRates == 'Depo'"
          >
            <thead>
              <tr>
                <th scope="col">From Depo</th>
                <th scope="col">To Depo</th>
                <th scope="col">Volume Rate</th>
                <th scope="col">Min Transport Charge</th>
                <th scope="col">KG Rate</th>
                <th scope="col">Fuel Surcharge</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(rateSheet, index) of rates" :key="index">
                <td>{{ rateSheet.fromDepo }}</td>
                <td>{{ rateSheet.toDepo }}</td>
                <td>
                  <v-text-field
                    type="number"
                    v-model="rates.find((x) => x.id == rateSheet.id).volumeRate"
                  ></v-text-field>
                </td>
                <td>
                  <v-text-field
                    type="number"
                    v-model="
                      rates.find((x) => x.id == rateSheet.id).minTransportCharge
                    "
                  ></v-text-field>
                </td>
                <td>
                  <v-text-field
                    type="number"
                    v-model="rates.find((x) => x.id == rateSheet.id).kgRate"
                  ></v-text-field>
                </td>
                <td>
                  <v-text-field
                    type="number"
                    v-model="
                      rates.find((x) => x.id == rateSheet.id).fuelSurcharge
                    "
                  ></v-text-field>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <v-btn
          style="width: 100%; color: White"
          color="primary"
          rounded
          dark
          v-if="showDefualRates != ''"
          @click="save"
        >
          Save Rates
        </v-btn>
      </div>
    </div>
    <v-dialog
      transition="dialog-bottom-transition"
      max-width="600"
      v-model="dialogUploadRates"
    >
      <v-card>
        <v-toolbar color="primary" dark>Upload New Rates</v-toolbar>
        <v-card-text>
          <v-text-field
            label="Rate Sheet Name"
            v-model="newRatesheetName"
          ></v-text-field>
          <v-select
            label="Rate Sheet Type"
            v-model="newRateSheetType"
            :items="[
              'REMOTE RATES',
              'STANDARD TARIFF RATES',
              'DEPO TO DEPO RATES',
            ]"
          ></v-select>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="handleFileImport">Create Rate Sheet</v-btn>
          <v-btn text @click="dialogUploadRates = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import * as XLSX from "xlsx";
import baseMixin from "@/mixins/baseMixin.js";
export default {
  mixins: [baseMixin],
  data() {
    return {
      loading: false,
      page: 1,
      numberPerPage: 20,
      rateSheetCount: 0,
      rateSheets: [],
      rates: [],
      volumetricUnique: [],
      zoneUnique: [],
      isSelecting: false,
      selectedFile: null,
      sheet: [],
      showDefualRates: "",
      uploadedRates: [],
      headers: [],
      dialogUploadRates: false,
      newRatesheetName: "",
      newRateSheetType: "",
    };
  },
  watch: {
    page(val) {},
    search(val) {},
  },
  beforeMount() {
    this.$nextTick(async function () {
      const rateSheetResponse = await this.$store.dispatch("dataGate", {
        tableName: "rateSheet",
        operation: "read",
        page: 1,
        numberPerPage: this.numberPerPage,
      });
      if (rateSheetResponse.count) {
        this.rateSheetCount = rateSheetResponse.count;
      }
      if (rateSheetResponse.data) {
        this.rateSheets = rateSheetResponse.data;
      }
      this.loading = false;
    });
  },
  unmounted() {
    this.$nextTick(async function () {});
  },
  methods: {
    async rateSheetClicked(val) {
      console.log(val);
      if (val.type == "STANDARD TARIFF RATES") {
        this.rates = [];
        this.volumetricUnique = [];
        this.zoneUnique = [];
        this.showDefualRates = "defualt";
        const shippingRates = await this.$store.dispatch("dataGate", {
          tableName: "shippingRates",
          operation: "read",
          whereCriteria: { sheetId: val.id },
        });

        console.log("Rates", shippingRates.data);

        this.rates = shippingRates.data;

        this.volumetricUnique = [];
        this.zoneUnique = [];

        this.rates.forEach((element) => {
          var itemcheckVol = this.volumetricUnique.find(
            (x) => x == element.volumetric
          );

          var itemcheckZone = this.zoneUnique.find((x) => x == element.zoneId);
          if (itemcheckVol == undefined || itemcheckVol == null) {
            this.volumetricUnique.push(element.volumetric);
          }
          if (itemcheckZone == undefined || itemcheckZone == null) {
            this.zoneUnique.push(element.zoneId);
          }
        });
      } else if (val.type == "REMOTE RATES") {
        this.showDefualRates = "Remote";
        const shippingRates = await this.$store.dispatch("dataGate", {
          tableName: "remoteShippingRates",
          operation: "read",
          whereCriteria: { sheetId: val.id },
        });

        this.rates = shippingRates.data;
      } else if (val.type == "DEPO TO DEPO RATES") {
        this.showDefualRates = "Depo";
        const shippingRates = await this.$store.dispatch("dataGate", {
          tableName: "depoToDepoShippingRates",
          operation: "read",
          whereCriteria: { sheetId: val.id },
        });

        this.rates = shippingRates.data;
      }
    },
    handleFileImport() {
      this.dialogUploadRates = false;
      this.isSelecting = true;

      // After obtaining the focus when closing the FilePicker, return the button state to normal
      window.addEventListener(
        "focus",
        () => {
          this.isSelecting = false;
        },
        { once: true }
      );

      // Trigger click on the FileInput
      this.$refs.uploader.click();
    },
    onFileChanged(e) {
      this.selectedFile = e.target.files[0];
      var self = this;
      var files = e.target.files,
        f = files[0];
      var reader = new FileReader();

      reader.onload = function (e) {
        var data = new Uint8Array(e.target.result);
        //console.log(XLSX)
        var workbook = XLSX.read(data, { type: "array" });
        let sheetName = workbook.SheetNames[0];
        /* DO SOMETHING WITH workbook HERE */
        // console.log(workbook)
        let worksheet = workbook.Sheets[sheetName];
        // console.log(XLSX.utils.sheet_to_json(worksheet))
        this.sheet = XLSX.utils.sheet_to_json(worksheet);
        //.upload here

        if (self.newRateSheetType == "STANDARD TARIFF RATES") {
          self.uploadRates(this.sheet);
        } else if (self.newRateSheetType == "REMOTE RATES") {
          self.uploadRemoteRates(this.sheet);
        } else if (self.newRateSheetType == "DEPO TO DEPO RATES") {
          self.updateDepoToDepoRates(this.sheet);
        }

        // self.uploadedRates = this.sheet;

        Object.keys(this.sheet[0]).forEach((key) => {
          self.headers.push(key);
        });
      };
      reader.readAsArrayBuffer(f);
      // Do whatever you need with the file, liek reading it with FileReader
    },
    async uploadRates(val) {
      const response = await this.$store.dispatch("dataGate", {
        primaryKey: "id",
        entity: {
          name: this.newRatesheetName,
          type: "STANDARD TARIFF RATES",
          isActive: false,
        },
        tableName: "rateSheet",
        operation: "create",
      });

      this.rateSheets.push({
        id: response.response.id,
        name: this.newRatesheetName,
        type: "STANDARD TARIFF RATES",
        isActive: false,
      });

      var sheetid = response.response.id;

      var promises = await val.map(async (element) => {
        var entity;
        Object.keys(element).forEach(async (key) => {
          if (key != "KGs") {
            entity = {
              sheetId: sheetid,
              volumetric: element.KGs,
              zoneId: key,
              rate: element[key],
            };
          }
          const response = await this.$store.dispatch("dataGate", {
            primaryKey: "id",
            entity: entity,
            tableName: "shippingRates",
            operation: "create",
          });
        });
      });

      var responces = await Promise.all(promises);

      this.showDefualRates = "defualt";
      const shippingRates = await this.$store.dispatch("dataGate", {
        tableName: "shippingRates",
        operation: "read",
        whereCriteria: { sheetId: sheetid },
      });

      console.log("Rates", shippingRates.data);

      this.rates = shippingRates.data;

      this.volumetricUnique = [];
      this.zoneUnique = [];
      shippingRates.data.forEach((element) => {
        var itemcheckVol = this.volumetricUnique.find(
          (x) => x == element.volumetric
        );
        var itemcheckZone = this.zoneUnique.find((x) => x == element.zoneId);
        if (itemcheckVol == undefined || itemcheckVol == null) {
          this.volumetricUnique.push(element.volumetric);
        }
        if (itemcheckZone == undefined || itemcheckZone == null) {
          this.zoneUnique.push(element.zoneId);
        }
      });

      console.log(this.rates);
    },
    async uploadRemoteRates(val) {
      const response = await this.$store.dispatch("dataGate", {
        primaryKey: "id",
        entity: {
          name: this.newRatesheetName,
          type: "REMOTE RATES",
          isActive: false,
        },
        tableName: "rateSheet",
        operation: "create",
      });

      var sheetid = response.response.id;

      this.rateSheets.push({
        id: sheetid,
        name: this.newRatesheetName,
        type: "REMOTE RATES",
        isActive: false,
      });

      var promises = await val.map(async (element) => {
        const response = await this.$store.dispatch("dataGate", {
          primaryKey: "id",
          entity: {
            location: element.location,
            SC_Office: element["SC Office"],
            rate: element.Rate,
            sheetid: sheetid,
          },
          tableName: "remoteShippingRates",
          operation: "create",
        });
      });

      var responces = await Promise.all(promises);

      this.showDefualRates = "Remote";
      const shippingRates = await this.$store.dispatch("dataGate", {
        tableName: "remoteShippingRates",
        operation: "read",
        whereCriteria: { sheetId: val.id },
      });

      this.rates = shippingRates.data;
    },
    async updateDepoToDepoRates(val) {
      console.log(val);

      const response = await this.$store.dispatch("dataGate", {
        primaryKey: "id",
        entity: {
          name: this.newRatesheetName,
          type: "DEPO TO DEPO RATES",
          isActive: false,
        },
        tableName: "rateSheet",
        operation: "create",
      });

      var sheetid = response.response.id;

      this.rateSheets.push({
        id: sheetid,
        name: this.newRatesheetName,
        type: "DEPO TO DEPO RATES",
        isActive: false,
      });

      var promises = await val.map(async (element) => {
        const response = await this.$store.dispatch("dataGate", {
          primaryKey: "id",
          entity: {
            fromDepo: element.fromDepo,
            toDepo: element.toDepo,
            volumeRate: element.Volume_Rate,
            minTransportCharge: element.Min_Transport_Charge,
            kgRate: element.KG_rate,
            fuelSurcharge: element.Fuel_Surcharge,
            sheetid: sheetid,
          },
          tableName: "depoToDepoShippingRates",
          operation: "create",
        });
      });

      var responces = await Promise.all(promises);

      this.showDefualRates = "Depo";
      const shippingRates = await this.$store.dispatch("dataGate", {
        tableName: "depoToDepoShippingRates",
        operation: "read",
        whereCriteria: { sheetId: val.id },
      });

      this.rates = shippingRates.data;
    },
    async save() {
      if (this.rates[0].zoneId != undefined) {
        console.log("STANDARD TARIFF RATES");

        this.rates.forEach(async (element) => {
          const response = await this.$store.dispatch("dataGate", {
            primaryKey: "id",
            entity: element,
            tableName: "shippingRates",
            operation: "update",
          });
        });
      } else if (this.rates[0].SC_Office != undefined) {
        console.log("REMOTE RATES");
        this.rates.forEach(async (element) => {
          const response = await this.$store.dispatch("dataGate", {
            primaryKey: "id",
            entity: element,
            tableName: "remoteShippingRates",
            operation: "update",
          });
        });
      } else if (this.rates[0].fromDepo != undefined) {
        console.log("DEPO TO DEPO RATES");
        this.rates.forEach(async (element) => {
          const response = await this.$store.dispatch("dataGate", {
            primaryKey: "id",
            entity: element,
            tableName: "depoToDepoShippingRates",
            operation: "update",
          });
        });
      }
    },
  },
};
</script>

<style scoped>
.col {
  max-height: 90vh;
}
.table-row {
  display: flex;
}
</style>
